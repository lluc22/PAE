from flask import Flask
from flask_restful import Resource, Api,fields, marshal,reqparse,abort
from pymongo import MongoClient
from bson.binary import Binary
from doc2vec import doc2vec
from gensim import matutils
from celery import Celery
import pymongo,cPickle,gensim
import numpy as np
import gensim
import redis

#CONSTANTS
DEFAULT_TOPN = 50   #Default number of related tickets to track

#Establish connection with database
client = MongoClient('mongodb://localhost/Api1')
db = client.Api1

#Create Flask app context
app = Flask(__name__)
api = Api(app)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

#Celery (Async tasks)
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

#Response structure
vector_fields = {
    'related' : fields.List(fields.Integer),
    'uri' : fields.Url('vector')
}

REDIS_CLIENT = redis.Redis()


def only_one(function=None, key="", timeout=None):
    """Enforce only one celery task at a time."""

    def _dec(run_func):
        """Decorator."""

        def _caller(*args, **kwargs):
            """Caller."""
            ret_value = None
            have_lock = False
            lock = REDIS_CLIENT.lock(key, timeout=timeout)
            try:
                have_lock = lock.acquire(blocking=True)
                if have_lock:
                    ret_value = run_func(*args, **kwargs)
            finally:
                if have_lock:
                    lock.release()

            return ret_value

        return _caller

    return _dec(function) if function is not None else _dec

@only_one
def post_vector(id,body):
    if not (db.vectors.find_one({'id':id}) is None) : return
    f = open('workfile', 'w')
    f.write("hola")
    f.close()
    #Infer vector from Doc2Vec model
    vector = doc2vec.infer_vector(body)
    vector = vector / np.linalg.norm(vector)

    #We need to create the similarities for the new post and also
    #update the sim list for the tickets
    res = db.vectors.find({})
    sims = np.empty(res.count())
    ids = []
    toUpdate = []
    for i,v in enumerate(res):
        vec = cPickle.loads(v['vector'])
        sim = float(np.dot(vec,vector))
        if sim > v['topN'][-1]['sim']:
            print(v['id'])
            topn = v['topN']
            if id in [t['id'] for t in topn]: continue;
            print(v['id'])
            topn.append({'id':id,'sim':sim})
            topn = sorted(
                topn,
                key = lambda x: x['sim'],
                reverse = True)[:DEFAULT_TOPN]
            toUpdate.append({'id':v['id'],'topN':topn})
        sims[i] = sim
        ids.append(v['id'])

    #Sort the similarities
    best = matutils.argsort(sims,topn=DEFAULT_TOPN +1,reverse=True)
    topn = [{'id':ids[index],'sim':sims[index]} \
        for index in best if ids[index] != i]
    #Insert the post to the database

    db.vectors.insert_one(
        {
            'id':id,
            'vector':Binary(cPickle.dumps(vector,protocol=2)),
            'topN':topn
        }
    )

    #Update related
    for vec in toUpdate:
        db.vectors.update_one(
            {'id':vec['id']},
            {'$set' : {'topN': vec['topN']}}
        )

@only_one
def delete_vector(id):
    #Check if ticket exists
    if (db.vectors.find_one({'id':id}) is None) : return
    #Find tickets that relate with the ticket to delete
    res = db.vectors.find({'topN' : {'$elemMatch' : {'id':id}}})
    vecs = []
    ids = []
    for v in res:
        print(v['id'])
        vecs.append(cPickle.loads(v['vector']))
        ids.append(v['id'])
    vecs = np.array(vecs) #Matrix with related tickets matrix


    #We find all similarities for tickets
    #that relate with the deleted one
    res = db.vectors.find({})
    sims = {}
    for i in ids:
        sims[i] = np.empty(res.count())
    vec_order = []
    for i_vec,v in enumerate(res):
        vec = cPickle.loads(v['vector'])
        sim = np.dot(vecs,vec)
        vec_order.append(v['id'])
        for i,s in enumerate(sim):
            sims[ids[i]][i_vec] = s

    #We only save the DEFAULT_TOPN most similar
    for i in ids:
        best = matutils.argsort(sims[i],topn=DEFAULT_TOPN +1,reverse=True)
        topn = [{'id':vec_order[index],'sim':float(sims[i][index])} \
            for index in best if vec_order[index] != i]
        db.vectors.update_one({'id':i},{'$set':{'topN':topn}})
        db.vectors.delete_one({'id':id})

@celery.task
def async_post_vector(id,body):
    post_vector(id,body)



@celery.task
def async_delete_vector(id):
    delete_vector(id)

class vectorAPI(Resource):
    '''
    Class that manages tickets with a given id,
    that is getting relateds and delete tickets.
    '''
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('topn', type = int)  #Optional argument
        super(vectorAPI, self).__init__()

    #Get related tickets
    def get(self,id):
        '''
        Given an id return a list of tickets related
        to the one with the given id.
        Optional argument topn on the query to choose
        the number of related tickets to show.

        args:
            id: identification of the ticket
        return:
            json containing the related and the URI
        '''
        args = self.reqparse.parse_args()
        topn = DEFAULT_TOPN

        if('topn' in args):
            topn = args['topn']
        if(topn < 0): topn = DEFAULT_TOPN

        #Find ticket with given id
        res = db.vectors.find_one({'id':id})
        if res is None: abort(404)

        #Prepare response
        res = [r['id'] for r in res['topN']]
        vector = {'id':id,'related' : res[:topn]}
        return marshal(vector, vector_fields)


    #Delete a given ticket
    def delete(self, id):
        '''
        Given an id delete the ticket from the database.

        args:
            id: identification of the ticket
        return:
            json containing the result status
        '''
        #Check if ticket exists
        if (db.vectors.find_one({'id':id}) is None) : abort(404)
        async_delete_vector.apply_async(args=[id])
        return {'result': True}

class vectorListAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'id', type = int,location='json',required=True )
        self.reqparse.add_argument(
            'body', type = str,location='json', required=True)
        super(vectorListAPI, self).__init__()

    #Create a ticket
    def post(self):
        '''
        Creates a ticket and relates it with the
        other ones on the database.
        '''
        #Get the arguments from the query
        args = self.reqparse.parse_args()
        body = args['body']
        id = args['id']
        if not (db.vectors.find_one({'id':id}) is None) : abort(404)
        async_post_vector.apply_async(args=[id,body])
        return {'result': True}



#Api endpoints
#/vector/<int:id>&topn=<int>  topn optional, default=50
api.add_resource(vectorAPI, '/vectors/<int:id>',endpoint="vector")
api.add_resource(vectorListAPI, '/vectors')
if __name__ == '__main__':
    #For the moment I run the API with native threaded module,
    #next thing to do: celery to process background tasks(post,delete)
    app.run(debug=True,threaded=True)

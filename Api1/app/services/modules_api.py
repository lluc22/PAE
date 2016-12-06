from flask import Flask
from flask_restful import Resource, Api,fields, marshal,reqparse,abort
from pymongo import MongoClient
import pymongo
import numpy as np
import cPickle
from bson.binary import Binary
from doc2vec import doc2vec
import gensim

client = MongoClient('mongodb://localhost/Api1')
db = client.Api1

app = Flask(__name__)
api = Api(app)

vector_fields = {
    'related' : fields.List(fields.Integer),
    'uri' : fields.Url('vector')
}

class vectorAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('topn', type = int)
        super(vectorAPI, self).__init__()

    #Get related tickets
    def get(self,id):
        args = self.reqparse.parse_args()
        topn = 50
        if('topn' in args):
            topn = args['topn']
        if(topn < 0): topn = 50
        res = db.vectors.find_one({'id':id})
        if res is None: abort(404)
        res = [r['id'] for r in res['topN']]
        vector = {'id':id,'related' : res[:topn]}
        return marshal(vector, vector_fields)

    #It doesn't work yet, just a prototype
    def delete(self, id):
        if (db.vectors.find_one({'id':id}) is None) : abort(404)
        #db.vectors.delete_one({'id':id})
        print("delete",id)
        res = db.vectors.find({'topN' : {'$elemMatch' : {'id':id}}})
        vecs = []
        ids = []
        for v in res:
            vecs.append(cPickle.loads(v['vector']))
            ids.append(v['id'])
        vecs = np.array(vecs)
        res = db.vectors.find({})

        sims = dict.fromkeys(ids, [])
        for v in res:
            vec = cPickle.loads(res['vector'])
            sim = np.dot(vecs,vec)
            for i,s in enumerate(sim):
                sims[ids[i]].append({'id':ids[i],'sim':s})

        for i in ids:
            topn = sorted(sims[i],key=lambda x: x['sim'],reverse=True)[:50]
            print("update",i,topn)
            #db.update_one({'id':i},{'$set':{'topN':topn}})

        return {'result': True}

class vectorListAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('id', type = int,location='json',required=True)
        self.reqparse.add_argument('body', type = str, location='json', required=True)
        super(vectorListAPI, self).__init__()

    #It doesn't work yet, just a prototype
    def post(self):
        args = self.reqparse.parse_args()
        body = args['body']
        id = args['id']
        if not (db.vectors.find_one({'id':id}) is None) : abort(404)
        vector = doc2vec.infer_vector(body)
        vector = vector / np.linalg.norm(vector)
        res = db.vectors.find({})
        sims = []
        for v in res:
            vec = cPickle.loads(v['vector'])
            sim = float(np.dot(vec,vector))
            sims.append({'id':v['id'],'sim':sim})
            if sim > v['topN'][-1][1]:
                print(v['id'])
                topn = v['topN']
                if id in [t['id'] for t in topn]: continue;
                topn.append({'id':id,'sim':sim})
                topn = sorted(topn, key= lambda x: x['sim'], reverse = True)[:50]
                print("update",v['id'],topn)
                #db.vectors.update_one({'id':v['id']},{'$set' : {'topN': topn}})
        sims = sorted(sims,key=lambda x: x['sim'],reverse=True)[:50]
        db.vectors.insert_one({'id' : id ,'vector': Binary(cPickle.dumps(vector, protocol=2)), 'topN': sims})
        ret = {'id':id,'related':[sim[0] for sim in sims]}
        return marshal(ret, vector_fields)



#Api endpoints
api.add_resource(vectorAPI, '/vectors/<int:id>',endpoint="vector") #/vector/<int:id>&topn=<int>  topn optional, default=50
api.add_resource(vectorListAPI, '/vectors')
if __name__ == '__main__':
    #For the moment I run the API with native threaded module,
    #next thing to do: celery to process background tasks(post,delete)
    app.run(debug=True,processes=4,threaded=True)

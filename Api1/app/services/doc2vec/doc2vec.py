import gensim
import json
import os.path
import sys
import random
import datetime
from gensim.models import Doc2Vec
import gensim.models.doc2vec
from collections import OrderedDict
import multiprocessing
from uuid import uuid4

cores = multiprocessing.cpu_count()
assert gensim.models.doc2vec.FAST_VERSION > -1, "this will be painfully slow otherwise"

req_version = (3,5)
cur_version = sys.version_info

if cur_version < req_version:
    raise Exception("Python version requiered " + str(req_version))



class LabeledSentence(object):
    def __init__(self,words=[],labels=[]):
        self.words = words
        self.tags = labels
        self.chunk_charged = -1
        self.posts = []
        self.total_posts = 0
        self.chunks = 0
        self.actual_chunk = -1
    #We want to be able to iterate all elements
    def __iter__(self):
        anws = {'command':"build_vocab", "text":"next"}
        print(json.dumps(anws))
        postResp = dict(json.loads(input()))
        finished = postResp['finished']
        posts = postResp['posts']
        while (not finished):
            self.actual_chunk = self.chunks
            self.chunks += 1
            for i,post in enumerate(posts):
                self.total_posts += 1
                text = list(gensim.utils.tokenize(post["body"]))
                postId = post["id"]
                yield LabeledSentence(words= text, labels=['POST_%s' % postId])
            print(json.dumps(anws))
            postResp = dict(json.loads(input()))
            finished = postResp['finished']
            posts = postResp['posts']

    def random_iter(self):
        chunks = self.chunks
        randomChunk = list(range(chunks))
        random.shuffle(randomChunk)
        for c in randomChunk:
            anws = {'command':'train','finished':False,'chunk':c}
            print(json.dumps(anws))
            response = dict(json.loads(input()))
            posts = response['posts']
            indexList = list(range(len(posts)))
            random.shuffle(indexList)
            for i in indexList:
                post = posts[i]
                text = list(gensim.utils.tokenize(post["body"]))
                postId = post["id"]
                yield LabeledSentence(words= text, labels=['POST_%s' % postId])

def save_model(model):
    dirname = 'models/'
    soft_name = str(uuid4())
    model_name = soft_name + '.d2v'
    mPath = os.path.join(dirname,soft_name,model_name)
    while os.path.exists(mPath):
        model_name = str(uuid4())
        mPath = os.path.join(dirname,soft_name,model_name)
    os.makedirs(os.path.join(dirname,soft_name))
    model.save(mPath)
    return mPath

def train_model(model,sentences):
        alpha, min_alpha, passes = (0.025, 0.001, 20)
        alpha_delta = (alpha - min_alpha) / passes
        for epoch in range(passes):
            model.alpha, model.min_alpha = alpha, alpha
            model.train(sentences.random_iter())
            alpha -= alpha_delta
def main():
    global_model = Doc2Vec.load('models/default/default.d2v')
    data =  json.loads(input())
    command = data['command']
    while command != "finished":
        if command == "build_vocab":
            sentences = LabeledSentence()
            model = Doc2Vec(dm=1, dm_mean=1, size=100, window=10, negative=5, hs=0, min_count=2, workers=cores)
            model.build_vocab(sentences)
            train_model(model,sentences)
            path = save_model(model)
            print(json.dumps({"command":"train","finished":True,"model_path":path}))
        if command =="load_model":
            path = data['path']
            try:
                global_model = Doc2Vec.load(path)
            except IOError as e:
                print(json.dumps({"command":"load_model","ok":False,"err":str(e)}))
            else:
                print(json.dumps({"command":"load_model","ok":True}))
        if command =="get_vector":
            postId = data['id']
            vector = list(global_model.docvecs[postId])
            vector = [float(i) for i in vector]
            doct = global_model.docvecs.index_to_doctag(postId)
            doct = int(doct.split('_')[1])
            if postId < len(global_model.docvecs):
                print(json.dumps({"command":"get_vector","vector":vector,"id":doct}))
            else:
                print(json.dumps({"command":"get_vector","vector":vector,"id":doct,"finish":True}))

        if command =="topn":
            postId = data['id']
            n = data['n']
            topids = global_model.docvecs.most_similar(positive=["POST_%s"%postId],topn=n)
            topids = map(lambda post: int(post[0].split('_')[1]),topids)
            print(json.dumps({"command":"topn","n":n,"ids":list(topids)}))

        data = json.loads(input())
        command = data['command']



if __name__ == "__main__":
    main()

import warnings
warnings.filterwarnings("ignore")

import gensim
import json
import os.path
import sys
from bs4 import BeautifulSoup
import random
import datetime
from gensim.models import Doc2Vec
import gensim.models.doc2vec
from collections import OrderedDict
from gensim import utils, matutils
import multiprocessing
from uuid import uuid4
from pymongo import MongoClient
import pymongo

cores = multiprocessing.cpu_count()
assert gensim.models.doc2vec.FAST_VERSION > -1, "this will be painfully slow otherwise"
MAX_MEMORY_LIST = 1000000
conn = MongoClient()
db = conn.Api1


def normalize(text):
    parser = BeautifulSoup(text,'html.parser')

    # #Replace any code with "A_CODE"
    # if not parser.code is None:
    #     if not parser.code.string is None:
    #         parser.code.string.replace_with("A_CODE")

    #Replace any link with "A_LINK"
    if not parser.a is None:
        if not parser.a.string is None:
            parser.a.string.replace_with("A_LINK")

    if not parser.img is None:
        if not parser.img.string is None:
            parser.img.string.replace_with("A_IMG")

    text = parser.get_text()

    norm_text = text.lower()

    # Replace breaks with spaces
    norm_text = norm_text.replace('<br />', ' ')

    # Pad punctuation with spaces on both sides
    for char in ['.', '"', ',', '(', ')', '!', '?', ';', ':']:
        norm_text = norm_text.replace(char, ' ' + char + ' ')

    return norm_text

def infer_vector(body,model_path='./doc2vec/models/default/default.d2v'):
    model = Doc2Vec.load(model_path)
    return model.infer_vector(normalize(body))


class LabeledSentence(object):
    def __init__(self,words=[],labels=[]):
        self.words = words
        self.tags = labels

    #We want to be able to iterate all elements
    def __iter__(self):
        res = db.posts.find({})
        for post in res:
            postId = post.id
            text = normalize(post.body)
            text = list(gensim.utils.tokenize(text))
            yield(LabeledSentence(words=text,labels=['POST_%s' % postId]))

    def random_iter(self):
        num = db.posts.count()
        if n > MAX_MEMORY_LIST:
            self.iter()
        else:
            res = db.posts.find({})
            posts = [post for post in res]
            random.shuffle(posts)
            for post in posts:
                postId = post.id
                text = normalize(post.body)
                text = list(gensim.utils.tokenize(text))
                yield(LabeledSentence(words=text,labels=['POST_%s' % postId]))


def save_model(model):
    dirname = './app/services/doc2vec/models/'
    soft_name = str(uuid4())
    model_name = soft_name + '.d2v'
    mPath = os.path.join(dirname,soft_name,model_name)
    while os.path.exists(mPath):
        model_name = str(uuid4())
        mPath = os.path.join(dirname,soft_name,model_name)
    os.makedirs(os.path.join(dirname,soft_name))
    model.save(mPath)
    return mPath

def train_model():
        sentences = LabeledSentence()
        model = Doc2Vec(dm=1, dm_mean=1, size=100, window=10, negative=5, hs=0, min_count=2, workers=cores)
        model.build_vocab(sentences)
        alpha, min_alpha, passes = (0.025, 0.001, 20)
        alpha_delta = (alpha - min_alpha) / passes
        for epoch in range(passes):
            model.alpha, model.min_alpha = alpha, alpha
            model.train(sentences.random_iter())
            alpha -= alpha_delta
        Doc2Vec.save('default.d2v')

#!/usr/bin/python
#import logging
#logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import sys
import os.path
from gensim import corpora, models
import gensim 

pathLDAModel = "LDAModel.lda"
T = 5			# Number Of Topics
lda = None		# LDA model variable

command = sys.argv[1]
if command == 'update':
	# Update the LDA Model with the documents passed as argument	
	
	# Get the documents to update the model as array of Strings
	documents = sys.argv[2:]
	# Preprocess the documents, stemming, stopwords, etc ..
	docs = gensim.parsing.preprocessing.preprocess_documents(documents)
	# Create the dictionary of docs
	dictionary = corpora.Dictionary(docs)
	# Create the corpus of docs
	corpus = [dictionary.doc2bow(d) for d in docs]

	# Check if the model exists, for create or update
	if not os.path.isfile(pathLDAModel) :
		#lda = gensim.models.ldamulticore.LdaMulticore(num_topics=T)
		lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=5)
	else:
		lda = models.ldamodel.LdaModel.load(pathLDAModel)
		lda.update(corpus)
		#gensim.models.ldamodel.LdaModel.load("model.lda"

	# Save the Model with the new data
	lda.save(pathLDAModel)
	print "... Done"

elif command == 'delete':
	# Delete the existing Model and create one empty
	print "TODOs"


	
elif command == 'getTopics':
	# Return the topics of the LDA Model
	print "TODO"


	
elif command == 'topicsOf':
	# Return the topic of document
	print "TODO"


else:
	# Error command or syntaxis in the first argument
	print "Error Argument Command Syntax : " + command
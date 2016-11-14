#!/usr/bin/python
#import logging
#logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import time
import sys
import os.path
import json
from gensim import corpora, models, parsing

pathLDAModel = "LDAModel.lda"	# The LDA Model to save or load
T = 10							# Number Of Topics to extract
lda = None						# LDA model Global variable

command = sys.argv[1]
if command == 'update':
	# Update the LDA Model with the documents passed as argument		
	start_time = time.time()
	# Get the documents to update the model as array of Strings
	dictionary = corpora.Dictionary()

	numChunks = 0
	dataJson = json.loads(input())
	command = dataJson['command']
	while command != 'finish':
		documents = dataJson['posts']
		docs = parsing.preprocessing.preprocess_documents(documents)
		dictionary.add_documents(docs)
		corpus = [dictionary.doc2bow(d) for d in docs]
		corpora.MmCorpus.serialize('corpus/c' + str(numChunks), corpus)  # store to disk, for later use
		print '{"status":"OK"}'

	corpus = gensim.corpora.MmCorpus('corpus/c' + numChunks)
	lda = models.ldamulticore.LdaMulticore(corpus=corpus, id2word=dictionary, num_topics=T)
	
	for ci in range(numChunks):
		print '{"chunk":"'+ str(ci) +'"}'
		corpus = gensim.corpora.MmCorpus('corpus/c' + ci)
 		lda.update(corpus)

	# Save the Model with the new data
	lda.save(pathLDAModel)
	elapsed_time = time.time() - start_time
	print '{"status":"OK" , "elapsedTime" : "' + str(elapsed_time)+ '"}'


elif command == 'delete':
	# Delete the existing Model 
	if os.path.isfile(pathLDAModel) :
		os.remove(pathLDAModel)
	if os.path.isfile(pathLDAModel + ".state") :
		os.remove(pathLDAModel + ".state")
	print '{"status":"OK"}'

	
elif command == 'getTopics':
	# Return the topics of the LDA Model

	# Check if the LDA Model exists
	if not os.path.isfile(pathLDAModel) :
		print '{"status":"NoExistingModel"}'
		exit()


	print '{"status":"OK"}'

	
elif command == 'topicsOf':
	# Return the topic of document

	# Check if the LDA Model exists
	if not os.path.isfile(pathLDAModel) :
		print '{"status":"NoExistingModel"}'
		exit()

	print '{"status":"OK"}'


else:
	# Error command or syntaxis in the first argument
	print '{"status":"Error Argument Command Syntax = ' + command +'"}'
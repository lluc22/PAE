#!/usr/bin/python
#import logging
#logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import time
import sys; 
import os.path
import json
from gensim import corpora, models, parsing

pathLDAModel = "LDAModel.lda"	# The LDA Model to save or load
T = 10							# Number Of Topics to extract
lda = None						# LDA model Global variable

command = sys.argv[1]

if command == 'update':
	# Update the LDA Model with the documents chunks as input	
	start_time = time.time()
	# Create the dictionary of all documents
	dictionary = corpora.Dictionary()
	# Counter of input chunks
	numChunks = 0
	# Read the first chunk in json
	dataJson = json.loads(raw_input())
	op = dataJson['op']
	# Loop when the operation is not finish
	while op != 'finish':
		#Get the documents to update the model as array of Strings
		documents = dataJson['posts']
		# Preprocess the documents, stemming, stopwords, etc ..
		docs = parsing.preprocessing.preprocess_documents(documents)
		# Update the global dictionary
		dictionary.add_documents(docs)
		# Create the corpus chunk and save it in a file
		corpus = [dictionary.doc2bow(d) for d in docs]
		corpora.MmCorpus.serialize('corpus/c' + str(numChunks), corpus)  # store to disk, for later use
		# print message to recieve next chunk of documents
		print '{"status":"OK" , "docs":"'+ str(len(docs))+'"}'
		sys.stdout.flush()
		# Read new chunk of documents and operation
		dataJson = json.loads(raw_input())
		op = dataJson['op']
		numChunks += 1


	# Create the initial chunk corpus and LDA to update
	corpus = corpora.MmCorpus('corpus/c0')
	lda = models.ldamulticore.LdaMulticore(corpus=corpus, id2word=dictionary, num_topics=T)
	
	for ci in range(1, numChunks):
		# for each corpus chunk, update the LDA model
		print ('{"chunk":"'+ str(ci) +'"}')
		corpus = corpora.MmCorpus('corpus/c' + str(ci))
		lda.update(corpus)

	# Save the Model with the new data
	lda.save(pathLDAModel)
	# Return the elapsed time
	elapsed_time = time.time() - start_time
	print ('{"status":"OK" , "elapsedTime" : "' + str(elapsed_time)+ '"}')


elif command == 'delete':
	# Delete the existing Model 
	if os.path.isfile(pathLDAModel) :
		os.remove(pathLDAModel)
	if os.path.isfile(pathLDAModel + ".state") :
		os.remove(pathLDAModel + ".state")
	print ('{"status":"OK"}')

	
elif command == 'getTopics':
	# Return the topics of the LDA Model

	# Check if the LDA Model exists
	if not os.path.isfile(pathLDAModel) :
		print ('{"status":"NoExistingModel"}')
		exit()


	print ('{"status":"OK"}')

	
elif command == 'topicsOf':
	# Return the topic of document

	# Check if the LDA Model exists
	if not os.path.isfile(pathLDAModel) :
		print ('{"status":"NoExistingModel"}')
		exit()

	print ('{"status":"OK"}')


else:
	# Error command or syntaxis in the first argument
	print ('{"status":"Error Argument Command Syntax = ' + command +'"}')
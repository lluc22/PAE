#!/usr/bin/python
#import logging
#logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import time
import sys; 
import os.path
import json
from gensim import corpora, models, parsing

pathLDAModel = "./app/services/lda/LDAModel.lda"		# The LDA Model to save or load
pathDictionary = "./app/services/lda/Dictionary.dict"	# The dictionary of the data
pathCorpus = './app/services/lda/corpus'
T = 10								# Number Of Topics to extract
lda = None							# LDA model Global variable

dataJson = json.loads(raw_input())
command= dataJson['command']

while command != 'finish':
	# Loop to stay in the python script	
	if command == 'create':
		# Update the LDA Model with the documents chunks as input	
		start_time = time.time()
		# Create the dictionary of all documents
		dictionary = corpora.Dictionary()
		# Counter of input chunks
		numChunks = 0
		# Read the first chunk in json
		dataJson = json.loads(raw_input())
		op = dataJson['op']
		# Loop each chunk of documents
		while op != 'finish':
			# Get the documents as array of Strings
			documents = dataJson['posts']
			# Preprocess the documents, stemming, stopwords, etc ..
			docs = parsing.preprocessing.preprocess_documents(documents)
			# Update the global dictionary
			dictionary.add_documents(docs)
			# Create the corpus chunk and save it in a file
			corpus = [dictionary.doc2bow(d) for d in docs]
			corpora.MmCorpus.serialize(pathCorpus + '/c' + str(numChunks), corpus)  # store to disk, for later use
			# print message to recieve next chunk of documents
			print ('{"message":"Reading Docs" , "chunk":'+ str(numChunks+1) + ', "status":0}')
			sys.stdout.flush()
			# Read new chunk of documents and operation
			dataJson = json.loads(raw_input())
			op = dataJson['op']
			numChunks += 1


		# Create the initial chunk corpus and LDA model to update
		corpus = corpora.MmCorpus(pathCorpus + '/c0')
		lda = models.ldamulticore.LdaMulticore(corpus=corpus, id2word=dictionary, num_topics=T)
		
		# for each corpus chunk, update the LDA model
		for ci in range(1, numChunks):
			# print ('{ "message":"Updating Model" , "chunk":"'+ str(ci) +'", "status":0}')
			corpus = corpora.MmCorpus(pathCorpus + '/c' + str(ci))
			lda.update(corpus)

		# Save the Model with the new data
		lda.save(pathLDAModel)
		# Save the dictionary
		dictionary.save(pathDictionary)
		# Return the elapsed time
		elapsed_time = time.time() - start_time
		print ('{"message":"Terminated" , "elapsedTime" : "' + str(elapsed_time)+ '" , "status":0}')


	elif command == 'delete':
		# Delete the existing Model 
		if os.path.isfile(pathLDAModel) :
			os.remove(pathLDAModel)
		if os.path.isfile(pathLDAModel + ".state") :
			os.remove(pathLDAModel + ".state")
		# Delete the dictionary
		if os.path.isfile(pathDictionary) :
			os.remove(pathDictionary)
		# Delete the corpus files
		for the_file in os.listdir(pathCorpus):
			file_path = os.path.join(pathCorpus, the_file)
			if os.path.isfile(file_path):
				os.remove(file_path)
		# Print status
		print ('{"status":0}')

		
	elif command == 'getTopics':
		# Return the topics of the LDA Model
		if not os.path.isfile(pathLDAModel) :
			# Check if the LDA Model exists
			print ('{"message":"NoExistingModel", "status":1}')
		else: 
			# Loads the LDA model
			lda = models.ldamulticore.LdaMulticore.load(pathLDAModel, mmap='r')
			# For each topics create a json string
			output = '{'		
			for t in range(T):
				topic = lda.show_topic(t)
				topicString = str(topic).replace('(u', '[')
				topicString = str(topicString).replace(')', ']')
				output += ' "topic' + str(t) + '" : "' + topicString + '" ,'
			# Print the topics in json format
			print (output + ' "status":0}')

		
	elif command == 'topicsOf':
		# Return the topics of document
		if not os.path.isfile(pathLDAModel) :
			# Check if the LDA Model exists
			print ('{"message":"NoExistingModel", "status":1}')

		else :
			# Loads the LDA model
			lda = models.ldamodel.LdaModel.load(pathLDAModel, mmap='r')
			# Loads the dictionary
			dictionary = corpora.Dictionary.load(pathDictionary)
			# Counter of input chunks
			numChunks = 0
			# Read the first chunk in json
			dataJson = json.loads(raw_input())
			op = dataJson['op']
			# Loop each chunk of documents
			while op != 'finish':
				# Get and preprocess the documents
				documents = dataJson['posts']
				docs = parsing.preprocessing.preprocess_documents(documents)
				output = []
				# for each document get the topics probabilities
				for doc in docs:
					topics = lda[dictionary.doc2bow(doc)]
					output.append(topics)
				# Output the topics of the documents
				posts = str(output).replace('(', '[').replace(')', ']')
				print('{"status":0 , "chunk":'+ str(numChunks+1) + ', "posts" :'+ posts +'}')
				sys.stdout.flush()
				# Read new chunk of documents and operation
				dataJson = json.loads(raw_input())
				op = dataJson['op']
				numChunks += 1

	else:
		# Error command or syntaxis in the first argument
		print ('{"message":"Error Argument Command Syntax = ' + command +'" , "status":1}')

	print('{"status":0 , "message":"finish"}')
	sys.stdout.flush()
	dataJson = json.loads(raw_input())
	command= dataJson['command']

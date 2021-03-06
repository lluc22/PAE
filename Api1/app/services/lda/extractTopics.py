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

if not os.path.exists(pathCorpus):
    os.makedirs(pathCorpus)
    
T = 10								# Number Of Topics to extract
NW = 50								# Number Of word for Topics to show
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
			print ('{"message":"Reading Docs" , "chunk":'+ str(numChunks+1) + '}')
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
			# print ('{ "message":"Updating Model" , "chunk":"'+ str(ci) +'"}')
			corpus = corpora.MmCorpus(pathCorpus + '/c' + str(ci))
			lda.update(corpus)

		# Save the Model with the new data
		lda.save(pathLDAModel)
		# Save the dictionary
		dictionary.save(pathDictionary)
		# Return the elapsed time
		elapsed_time = time.time() - start_time
		print ('{"message":"finish" , "elapsedTime" : "' + str(elapsed_time)+ '" }')


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
		# Print message
		print ('{"message":"Model deleted"}')

		
	elif command == 'getTopics':
		# Return the topics of the LDA Model
		if not os.path.isfile(pathLDAModel) :
			# Check if the LDA Model exists
			print ('{"message":"NoExistingModel"}')
		else: 
			# Loads the LDA model
			lda = models.ldamulticore.LdaMulticore.load(pathLDAModel, mmap='r')

			# Topics terms frecnuency, in all topics
			frecuency = dict()
			for t in range(T):
				topic = lda.show_topic(t)
				for (key, value) in topic:
					if key in frecuency: frecuency[key] += 1
					else: frecuency[key] = 1

			# topics names
			maxWords = 2	# Number of words for label
			maxFrec = 4		# max frecuency to filter term
			topicsNames = []
			for t in range(T):
				topic = lda.show_topic(t)
				label = []
				for (key, value) in topic:
					if (frecuency[key] < maxFrec):
						label.append(key)
						if len(label) > (maxWords - 1):
							break
				labelString = ""			
				for word in label:
					labelString += word + " "
				topicsNames.append(labelString[:-1])

			# For each topics create a json string
			output = '{ "topics": ['		
			for t in range(T):
				topic = lda.show_topic(t, topn=NW)
				topicString = '['
				for word in topic:
					if not word[0] in frecuency or frecuency[word[0]] < maxFrec:
						topicString += ' {"word":"' + unicode(word[0]).encode("utf-8") + '", "value":"' + unicode(word[1]).encode("utf-8")  + '"},'
				topicString = topicString[:-1] + ']'
				output += '{ "topicName":"' + unicode(topicsNames[t]).encode("utf-8") + '", "words":'+ topicString + ' },'
			# Print the topics in json format
			print (output[:-1] + '] }')
			#output = output[:-1] + '] }'
			#print (output.replace("@", ""))
			# {"command":"getTopics"}


		
	elif command == 'topicsOf':
		# Return the topics of document
		if not os.path.isfile(pathLDAModel) :
			# Check if the LDA Model exists
			print ('{"message":"finish", "info":"NoExistingModel" }')

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
				print('{ "chunk":'+ str(numChunks+1) + ', "posts" :'+ posts +'}')
				sys.stdout.flush()
				# Read new chunk of documents and operation
				dataJson = json.loads(raw_input())
				op = dataJson['op']
				numChunks += 1

	else:
		# Error command or syntaxis in the first argument
		print ('{"message":"Error Argument Command Syntax = ' + command +'"}')

	print('{ "message":"finish"}')
	sys.stdout.flush()
	dataJson = json.loads(raw_input())
	command= dataJson['command']



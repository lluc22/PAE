import time
import sys; 
import os.path
import json
from gensim import corpora, models, parsing

pathLDAModel = 'LDAModel.lda'
T = 10								# Number Of Topics to extract
lda = None							# LDA model Global variable

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

	# Print terms ordered
	dictlist = []
	for key, value in frecuency.iteritems():
		temp = (value, key)
		dictlist.append(temp)
	ordList = sorted(dictlist)
	print ordList


	# Print topics 
	maxWords = 2	# Number of words for label
	maxFrec = 4		# max frecuency to filter term
	for t in range(T):
		topic = lda.show_topic(t)
		label = []
		for (key, value) in topic:
			if (frecuency[key] < maxFrec):
				label.append(key)
				if len(label) > (maxWords - 1):
					break
		print "topic" + str(t) + " : " + str(label)
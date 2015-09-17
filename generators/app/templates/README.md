Rico Jython <%= projectName %> Jobs
===

Getting started
--- 
1. Install pre-requisites
	* Python 2.7
	* Java 8
	* Maven 3.x

1. Setup the env by running
 
        pip install -r bin/rico-requirements.txt
        #Sets RICO_APP_HOME and PATH env vars
        . bin/activate
        #One-time build of Java uber-jar
        #Might take a long time down download jars the first time
        rico build

1. Run unit tests

		#In C-Python
		nosetests app
		#In Jython
		rico test
		
1. Run in command line mode

		#View available jobs
		rico jobs
		
		cat data/<test_data>.json | rico cmdline <job>
		
1. Run in Samza local mode

		#One time install of YARN, ZooKeeper, Kafka, and Confluent Platform
		/bin/grid install all
		
		#Start Samza
		rm -rf /tmp/zookeeper/ /tmp/kafka-logs/
		./bin/grid start all
		
		#Create and load topics
		./bin/create_topics.sh
		./bin/load_topics.sh
		
		#View jobs
		rico jobs
		
		#Wait for job to fully initialize, then stop with ^C
		
		rico samza <job>
		#View output topic
		./deploy/confluent/bin/kafka-console-consumer --zookeeper localhost:2181 --topic <out_topic> --from-beginning
				
		#Stop Samza
		./bin/grid stop all

1. To build a YARN package

		rico package





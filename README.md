# VistA Audit Solution (aka VAS, aka VSRA) (WIP)

[![Airbnb-standard-style](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript) [![MIT License](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://github.com/barlowm/mono_repo_template/blob/master/LICENSE) [![tested with mocha](https://img.shields.io/badge/tested_with-mocha-99424f.svg)](https://mochajs.org) 

## Description
The VistA Audit Solution (VAS) is a prototype HIPAA Compliant Audit Solution for the Veterans Health Information Systems & Technology Architecture (VistA). 
It consists of several independent modules.
1. Patches for VistA which are designed to send Audit Information out to an Elasticache Message Queue cluster.
2. The Elasticache Message Queue Cluster
3. A Node JS based Subscriber Microservice running in a Docker container hosted in the VAEC Gov Cloud
4. A Node JS based Redshift Microservice running in a Docker container hosted in the VAEC Gov Cloud
5. A Data Repository (DR) hosted within the VistA Enterprise Cloud (VAEC) Gov Cloud which consists of:
   - Amazon S3 Bucket - vas-audit-records for storing the VistA Audit Records
   - Amazon Redshift - for storing the VistA Audit Record Metadata
6. A Node JS based Metadata REST Service running in the VAEC Gov Cloud
7. A Web Application Graphical User Interface hosted by an Apache Web Server residing in the VAEC Gov Cloud

![AWS Redshift_S3 Architecture Diagram 2 Sept 2020](ReadMe/AWS%20Redshift_S3%20Architecture%20Diagram%202%20Sept%202020.png)

This mono-repository contains the components for the 

* Subscriber Microservice
* Redshift Microservice
* RESTful Query Metadata Microservice
* Web Application/Graphical User Interface

Note that in the above diagram VistA is in the cloud. This will be our first IOC (Initial Operational Capability) test. A second IOC for VistA outside of the cloud (where VistA resides in a RDC (Regional Data Center) is also planned (see diagram below).

![AWS Redshift_S3 Architecture Diagram - Red_S3 4 Tampa IOC](ReadMe/AWS%20Redshift_S3%20Architecture%20Diagram%20-%20Red_S3%204%20Tampa%20IOC.png)

## Table of Contents

* [Synopsis](#synopsis)
* [VistA Simplified Data Schema](#vista-simplified-data-schema)
* [Development Requirements](#development-requirements)
* [Build Process](#build-process)
* [Environment Setup](#environment-setup)
* [Monitoring Containers During Testing](#monitoring-containers-during-testing)
* [SQL Table Schema](#sql-table-schema)

## Synopsis

### Microservices

- Subscriber
- Redshift
- Metadata

### Subscriber Microservice

* VistA Pushes Audit records to the "mqKey" (which is specified in an ENV variable) queue in the Message Queue Server (MQS) (e.g. Elasticache/Redis)

* Subscriber process pulls the message from the "mqKey" queue in the MQS

* Extracts the date from the HEADER.DateTime field (YYYYMMDDhhmmss-Zulu) and converts it to a path for S3 and adds a unique ID to the end of the path
  **(YYYYMMDDhhmmss-Zulu --> YY/MM/DD/<UNID>.json))**

* Adds the "S3BucketPath" to a new field (path) in the audit record

* The updated Audit record is then pushed out to the S3 bucket AND back out to the "mqWriteKey" (which is specified in an ENV variable) queue in the MQS 

### Redshift Microservice

- Pulls the audit records from the "mqWriteKey" (which is specified in an ENV variable) queue in the MQS 
- Extracts the necessary metadata from the audit record
- Writes the metadata to the Redshift Data Repository

### Metadata Microservice

Receives queries from the VAS Web Application

Pulls Metadata based on query from the Redshift Data Repository and returns to  VAS Web Application

Pulls requested Audit Record from S3 Bucket and returns to  VAS Web Application

## VistA Simplified Data Schema

Below is a simplified data schema for the data coming from VistA. For a more detailed schema examine the 

[audit_schema.json](/packages/sample_data/audit_schema.json) file which is a complete JSON Schema based on the [json-schema](https://json-schema.org/) format

```{
	"path": "2016/09/04/12345678.json",

	"HEADER": {	<-- Headerfields are consistent across all VistA records
		"RequestType": "Read",
		"User": {
			"DUZ": 1087960193, <-- Integer
			"UID": 59074875, <-- Integer
			"UserName": "KAZU,G'KALI", <-- LastName, FirstName MiddleName(optional)
			"Title": "movement might rays everything"
		},
		"Location": {
			"Site": "PORTLAND",
			"StationNumber": 107740	<-- Integer
		},
		"DateTime": "20160904014916-0500",	<-- Date/Time/Zulu offset (YYYYMMDDhhmmss-Z)
		"SchemaType": "FMAUDIT",
		"Patient": {
			"DFN": 4490997511,	<-- Integer
			"DOB": 19532105,	<-- Integer
			"INITPLUS4": "V4778",	<-- String
			"MVI": "c4bcc974Ve67243fa",	<-- String
			"PatientName": "VRAG,KELLY",
			"SSN": "560864778"	<-- Either a 9 digit number or a string consisting of 9 digits followed by the letter "P"
		}
	},
	"SCHEMA": {	<-- Schema contents varies based on what is sent
		"RECORD ADDED": "",
		"ACCESSED": "",
		"NEW VALUE": "",
		"OLD VALUE": "",
		"FIELD NAME": "PREFERRED NAME",
		"PROTOCOL or OPTION USED": "VAQ PDX4 (MENU)",
		"FILE NUMBER": 162.2,
		"FILE NAME": "PATIENT ALLERGIES",
		"MENU OPTION USED": ""
	}
}
```



## Development Requirements

### Environment Variables
Variables specified in an environment file to be used by the Docker Container service when launching the application.
```
**metadataPort** - Port to communicate with the Metadata Microservice

**CertFile** - Certificate file for access to the environment

#S3
AWS_VAS_BUCKET - S3 Bucket
S3_ARN - S3 Bucket ARN

#Redis
mqServer=
REDIS=
REDIS_HOST=

#Redshift
RS_HOST=
REDSHIFT_HOST=
RED_SHIFT=

dcmqPorts=

# MQ Key to read records posted by VistA
mqKey=vsr
# MQ Key for posting Audit records back to MQ for Redshift to pick up
mqWriteKey=vsr_audit
mqPort=6379
REDIS_PORT=6379

# Redshift Client Parameters
RS_USER
RS_DATABASE
RS_PASSWORD
RS_PORT
# Same as above but for Redshift Node/Java code
REDSHIFT_USER
REDSHIFT_DB
REDSHIFT_PASSWORD
REDSHIFT_PORT

# Tells process to use docker environment variables instead of .config
NODE_ENV=docker
```


## Build Process

There are a series of scripts in the package.json file for building the various microservices. With the exception of the GUI (which should be built in a Windows environment), these should all be run from a Linux environment (or a Windows environment which has docker installed)

    # Build the subscriber module and push the resulting Docker Container up to Docker
    > npm run subscriber:build
    
    # Build the metadata module and push the resulting Docker Container up to Docker
    > npm run metadata:build
    
    # Build the Node-JS Redsfhit module and push the resulting Docker Container up to Docker
    > npm run redshift:build
    
    # Build the GUI module in developer mode and launch in Windows
    > npm run gui:dev
    
    # Build the production version of the GUI module
    > npm run gui:prod
    
    # ZIP up the GUI production application
    > npm run gui:zip
    
    # ZIP up the shell scripts
    > npm run env:zip
With the exception of the GUI and Shell Scripts all modules are deployed to Docker and can be installed to any Linux environment via one or more of the prepared shell scripts.

To install the GUI and Shell scripts the ZIP files need to be copied to an AWS Jumpbox, unzipped there and run.

To copy the ZIP files to the AWS jumpbox run the following from a terminal (with the utils container running):

```
> cd ENVS
> docker cp utils:/usr/ENVS/envs.zip .
> docker cp utils:/usr/ENVS/vsr_gui.zip .
```

This will extract the zip file containing the various shell scripts and the GUI from the container.

Then unzip the envs.zip file which will contain the following files:

- metadata.sh
- pullAllServices.sh
- pullMetadata.sh
- pullRedshift.sh
- pullSubscriber.sh
- pullutils.sh
- pushGUI.sh
- redshift.sh
- runAllServices.sh
- subscriber.sh
- utils.sh

Then use the "pushGUI.sh" to move the GUI into the HTML server 

```
> ./pushGUI.sh
```



### 1. Utils

The test utilities reside in the "utils" package and are built into a single Docker container

Note: Because the build process for the utils generates a docker container, the build should be run from a Linux or Windows instance which has docker installed, (the Dev envionment is a CentOS platform)

```
npm run build:utils
```

Note: There is a special environment variable (***display_records***), which when set to 1

set display_records=1

Will cause both the utils s3_gen_2_mq.js utility to display on the console the contents of every Audit Record generated.

This environment variable is also used by the ***Subscriber Microservice*** to display the contents of every Audit Record read from the Message Queue Server (e.g. Elasticache or Redis).

### Local Machine Testing

The following versions of node.js and npm packages are required.

```
# VAS> node -v
v12.16.3

# VAS> npm -v
6.14.4
```

Ideally a MongoDB Database for complete testing (test cases are run using the [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) which is an *actual/real MongoDB Server programmatic-ally from node for testing or mocking during development*).

All other components for building and unit testing are installed as part of the `package.json` file.

To install all dependencies you'll have to authenticate to GitHub Packages. Login with your GitHub username and a [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) as your password.

See [configuring npm for use with GitHub Packages](https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages) for more details.

```
# VAS> npm login --registry=https://npm.pkg.github.com
```

```
# VAS> npm install
```

Scripts for lint checking and unit tests are also included and run from npm as well:

```
# VAS> npm run test
# VAS> npm run lint
```

### Environment Setup

Prior to running unit tests a local `.env` file is required to configure environment variables. 

#### project root - .env

***Example only, used for local development environment***

```
AccessControlAllowOrigin=*
metadataHost=localhost
metadataPort=8081

CertFile=/vapkirootsub1.pem

AWS_ACCESS_KEY_ID=<AWS ACCESS KEY>
AWS_SECRET_ACCESS_KEY=<AWS SECRET ACCESS KEY>
AWS_REGION=<AWS GOVCLOUD REGION>

# Separate environments listed below are used by the various utilities to allow to run one utility app
# across any environment while developing. They are not needed for production

# Local Dev Environment configuration used for docker-compose version
LOCRedis=redis
LOCRedisP=6379
LOCDR_URL=mongodb://192.168.0.25:27017/vsr

# Configurations similar to above for POC (Proof of Concept), DAS, Dev, Test, Stage environments
POCRedis=
POCRedisP=
POCDR_URL=

DAS_Redis=
DAS_RedisP=
DAS_DR_URL=

DEVRedis=
DEVRedisP=
DEVDR_URL=

TestRedis=
TestRedisP=
TestDR_URL=

StageRedis=
StageRedisP=
StageDR_URL=

# Configuration for current working environment (Replace with actual params when move to non local dev)
dcmqPorts=6379:6379
mqKey=vsr
mqServer=192.168.0.25
mqPort=6379
drUrl=mongodb://192.168.0.25:27017/vsr?
```

#### project root/packages/gui - .env

***Example only, used for local development environment***

```
HOST=localhost
PORT=8082
MDPORT=8081
APIBASE=http://192.168.0.25:8081/
```

## Monitoring Containers During Testing

There are several containers which run as part of the VAS system

```
CONTAINER ID        IMAGE               NAMES
a0dfc65a1c12        redshift            redshift
d7ea635b8b0b        metadata_r2         metadata
aa3590518dc3        subscriber_r2       subscriber
f247c8404669        redis               redis
ea47f9a2459d        utils               utils
```

Note that the "redis" container is only used for monitoring the Redis server. To launch the redis container run:

```
> docker run --name redis redis
```

For each container to monitor perform the following from a terminal window (replacing the ###.###.### with the appropriate IP address for the remote maching)

### Redis

```
> ssh -i "vas-dev.pem" ubuntu@##.##.###.###
> sudo -i
> docker exec -it redis bash
> redis-cli -h <REDIS HOST ADDRESS> -p 6379

> keys *
> llen <some key>
> flushall <-- Delete all data 
> monitor
```

### Monitor Subscriber Logs

```
> ssh -i "vas-dev.pem" ubuntu@##.##.###.###
> sudo -i
> docker logs -f subscriber
AWS_Config -  { apiVersions: { s3: '2006-03-01' }, region: 'us-gov-west-1' }
Initialize Subscriber service
Subscriber Initialization port: 6379, server: <SERVER ADDRESS>, bucket: vas-audit-records
Displaying records pulled from MQ
connected
SET -  OK
Are we connected? - Yes we are
Starting with data in the DR:  { nAudit: 278 }
```



### Monitor Metadata Logs

```
> ssh -i "vas-dev.pem" ubuntu@##.##.###.###
> sudo -i
> docker logs -f metadata
Listening on Local Server, Port: 8081
```



### Monitor Redshift Logs

```
> ssh -i "vas-dev.pem" ubuntu@##.##.###.###
> sudo -i
> docker logs -f metadata
Listening on Local Server, Port: 8081
```





Results from the unit tests and lint are in the `reports` folder as HTML documents

### Utils scripts

There are also a series of utility scripts which can help in testing the environment (a real MongoDB server is necessary for running the `utils` scripts):

- clear - Clear out the data repository
- howmany - How many records exist in the data repository
- gen_records - generate X # of random audit records and push to MQ Server
- gen2das - generate X # of random audit records and push to data repository

See the ReadMe in the packages\utils folder for more details

The various util scripts can be run from the local development environment providing access to redis and MongoDB servers are available:

```
# VAS> node packages/utils/howmany LOC
# VAS> node packages/utils/clear LOC --confirm
# VAS> node packages/utils/gen_records LOC
```

### Environment Testing and Docker

Since the subscriber and metadata micro-services are delivered as Docker containers (the utils package can also be delivered as a docker container, to build the containers and test them Docker needs to be installed on the local machine (I have a CentOS 7 Virtual Machine installed locally for this purpose).

Again there are npm scripts for building the Docker containers

```
# VAS> npm run build_subscriber
# VAS> npm run build_utils
```

Testing out the docker containers can be done with the docker-compose file named docker-compose.yml (*Note: this docker compose file pulls from the local .env file in the root*)

```
# VAS> npm run dc
```

Once the local environments are up and running the utils can then be run in their own Docker instance:

```
# VAS> sudo docker exec -it utils bash
bash-5.0# cd utils
bash-5.0# node howmany LOC
bash-5.0# node clear LOC --confirm
bash-5.0# node gen_records c=10 p=5 u=10
bash-5.0# node howmany LOC
bash-5.0# node gen2das c=10 p=5 u=10
bash-5.0# node howmany LOC
```
## Branching Model
Vincent Driessen’s  ["git flow"](https://nvie.com/posts/a-successful-git-branching-model/) branching model is a git branching and release management workflow that helps developers keep track of features, hotfixes and releases in a software projects. We will follow this model and mainly use five branches - master, dev, sqa, preprod and feature/fix. 

### dev
* This branch is our default branch, for development work that is not ready for testing.

### master
* This branch contains production-ready code of VistA Audit Solution (VAS).
* This branch should be kept stable at all times

### pre-prod 
* This branch contains code that is ready to be tested by the customer.

### sqa 
* This branch contains code that is ready to be tested by the SQA team.

### feature/fix
* These branches are created from dev; **each feature/fix branch is used to implement a single task.** After completing the task, the feature/fix branch must be merged into dev.





## SQL Workbench for access to Redshift

https://blog.openbridge.com/definitive-guide-for-connecting-sql-workbench-j-to-amazon-redshift-57d06aa32805

https://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-connection.html



RUN apk add openssh-client
COPY vas-dev.pem ./
RUN chmod 600 ./*.pem





### CMD tail -f /dev/null

Monitoring Containers During Testing
Build from Repo

## Build from Repo

1. Clone repo to local windows environment

2. From windows command prompt do:

   ```
   > npm install
   > cd packages\gui
   > npm install
   ```

3. Open Linux environment and build each individual service (Linux required because of Docker, or if running Docker in windows environment it can be done from there as well)

   ```
   npm run subscriber:build
   npm run metadata:build
   npm run redshift:build
   ```

4. From Windows build and zip up the GUI

  ```
  npm run gui:prod
  npm run gui:zip
  ```

  

## Testing in GCIO Environment

1. From DOS Prompt (does not need to be connected to VA VPN or using GFE) connect to a linux box:

   ```
   > ssh -i "vas-dev.pem" ubuntu@52.61.241.177
   ```

   Note the use of the vas-dev.pem key file

## SQL Table Schema

<table>
<tr><th>column</th><th>type</th><th>encoding</th><th>distkey</th><th>sortkey</th><th>notnull</th></tr>
<tr><th colspan="7" style="text-align: left;">Table: change_dimension</th></tr>
<tr><td>change_id </td><td>bigint </td><td>az64 </td><td>false </td><td>0 <td>true </td></tr>
<tr><td>change_id </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>description </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: date_dimension</th></tr>
<tr><td>date_id </td><td> integer </td><td> none </td><td> false </td><td> 1 </td><td> true </td></tr>
<tr><td>full_date </td><td> date </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>au_format_date </td><td> character(10) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>us_format_date </td><td> character(10) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>year_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>year_week_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>year_day_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>au_fiscal_year_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>us_fiscal_year_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>qtr_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>au_fiscal_qtr_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>us_fiscal_qtr_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>month_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>month_name </td><td> character(9) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>month_day_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>week_day_number </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_name </td><td> character(9) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_is_weekday </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_is_last_of_month </td><td> smallint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: file_dimension</th></tr>
<tr><td>file_id </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>path </td><td> character(100) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: locations_dimension</th></tr>
<tr><td>location_id </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>site_number </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>station_number </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: message_fact</th></tr>
<tr><td>user_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>patient_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>change_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>location_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>file_path </td><td> character(100) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>date_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>time_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: patients_dimension</th></tr>
<tr><td>patient_id </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>mvi </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>first_name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>last_name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>middle_name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>ssn </td><td> character(10) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>dob </td><td> date </td><td> az64 </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: time_dimension</th></tr>
<tr><td>time_id </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>time_value </td><td> character(5) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>hours_24 </td><td> character(2) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>hours_12 </td><td> character(2) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>hour_minutes </td><td> character(2) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_minutes </td><td> integer </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_time_name </td><td>character varying(20) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>day_night </td><td>character varying(20) </td><td> lzo </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><th colspan="7" style="text-align: left;">Table: users_dimension</th></tr>
<tr><td>user_id </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> true </td></tr>
<tr><td>uid </td><td> bigint </td><td> az64 </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>first_name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
<tr><td>last_name </td><td> character(50) </td><td> lzo </td><td> false </td><td> 0 </td><td> false </td></tr>
</table>
















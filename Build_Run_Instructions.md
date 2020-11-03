# Building and Deploying the VistA Audit Solution (VAS)

## Basic Components Background

The Vista Audit Solutions consists of several different team developed components:

![AWS Redshift_S3 Architecture Diagram 2 Sept 2020](Build_Run_Instructions.assets/AWS%20Redshift_S3%20Architecture%20Diagram%202%20Sept%202020.png)

1. Node JS Subscriber Microservice
2. Node JS Redshift Microservice
3. Node JS Metadata Microservice
4. Vue JS Web Application.

All components can be built using the various scripts in the package.json file using NPM.

Deployment of the components can be done using various Unix Shell Scripts.

## Development Requirements

The code was developed using standard text editors and makes use of the following tools:

- NPM
- Node.JS
- Docker
- SQL Workbench/j

The Subscriber, Redshift, and Metadata Microservices must be built on a Unix platform with Docker installed (it could potentially be built on a windows platform with docker installed but this was not done during development).

Prior to starting to build any components, Node.JS, NPM, and Docker must be installed on the development systems.

Download the code from Github and perform a standart npm install from the following folders:

1. Application root folder

	```
	> npm install
	```

   This will install all the necessary modules for the Subscriber, Redshift, and Metadata Microservices

2. packages/gui folder

   ```
   > npm install
   ```

   This will install all the necessary modules for the Web Application

## Subscriber Microservice

The subscriber Microservice task is to pull Audit Records from the Redis/Elasticache server and push them to an AWS S3 bucket.

The subscriber code resides in the packages/subscriber folder

### Building the subscriber component

Once the initial modules are installed, each component can be built from a terminal window in a unix environment with the appropriate npm script

1. Subscriber Microservice

   ```
   > npm run subscriber:build
   ```

2. Metadata Microservice

   ```
   > npm run metadata:build
   ```

3. Redshift Microservice

   ```
   > npm run redshift:build
   ```

Similarly running and testing locally is done via the "shell" scripts in the ENVs folder

```
> ./pullSubscriber.sh
> ./subscriber.sh
> ./pullMetadata.sh
> ./metadata.sh
> ./pullRedshift.sh
> ./redshift.sh
```

There are also a set of utility functions in the packages\utils folder

```
> npm run utils:build
> ./ENVs/pullutils.sh
> ./ENVs/utils.sh
```

The Web application is built using npm also

```
> npm run gui:dev
```

This will build and launch an instance of the Web application for access by a chrome web browser

A production version of the Web Application is done via the "build" script

```
> npm run gui:prod
```

Once the production version of the Web Application is built it needs to be zipped up and prepared for deployment

```
> npm run gui:zip
```

The zip file will be moved in to the ENVs folder which is where all the shell scripts for deployment reside.

To deploy the VAS copy all the shell scripts from the ENVs folder up to the AWS deployment site and create an appropriate `CommonEnv_List.env` file based on the example in the ENVs folder.

Deployment is then done via running the following shell scripts

```
> pullSubscriber.sh
> subscriber.sh

> pullMetadata.sh
> metadata.sh

> pullRedshift.sh
> redshift.sh

> pullutils.sh
> utils.sh

> pushGUI.sh
```

Note: The `pushGUI.sh` script pushes the Web Application to the 

```
/var/www/vsr/
```

folder in the Amazon EC2 instance that will be running the application. Prior to this, an http service needs to be established in the EC2 environment. 



## Utils

The utils component is a set of utility functions, built and run as part of a docker container, used in development/testing of the VAS.

Access to the utility functions is through docker:

*Note: Connect to the GCIO - Gov-Cloud EC2 instance via the following ssh command:*

```
ssh -i "vas-dev.pem" ubuntu@52.61.241.177
```

*This also requires the vas-dev.pem key file*

```
> sudo docker exec -it utils bash
> cd utils
```

It consists of the following node.js applications:

- get_from_metadata.js

- howmany.js
  Tells how many Audit and Metadata records exist

  ```
  > node howmany
  ```

  **returns:** 
  Testing Counts - Audit: {"wCount":0,"rCount":0,"s3Count":{"nAudit":5}}; Metadata: 5

  

- rs_PushMeta.js

- s3_count_records.js

- s3_gen_2_dr.js

- s3_gen_2_mq.js
  Generates random records which are pushed to Redis, then picked up by subscriber and pushed to S3 and Redshift

  ```
  > node s3_gen_2_mq -c <COUNT> -p <PATIENT ID> -u <USER ID>
  ```

  where:

  * count = # of records to generate (if left out only 1 record will be generated)
  * patient id = index into list of random patients. If left out a random patient will be used, otherwise a specific patient will be used for all generated records
  * user id = index into list of random users. If left out a random userwill be used, otherwise a specific user will be used for all generated records

- s3_list_buckets.js

- s3_read_audit function.md

- s3_read_audit.js

- s3_read_bucket.js

- s3_write_bucket.js


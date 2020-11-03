## Requirements:

- Docker
- Github
- npm (version 6.14 or above)
- node (version 12.16 or above)
- Eclipse IDE
- Apache Maven (version 3.6.3 or above)



## Environment Assumptions

## Modules to be delivered

- Subscriber Microservice
- Redshift Microservice
- Metadata Microservice
- Utils Module
- AQRA (Audit Query and Retrieval Application) Web Application

## Build Components

Component building is done from a Windows Terminal Prompt, unless otherwise specified and, with the exception of the AQRA Web Application, requires Docker as part of the build process.

### Microservices Source Code Download and Module Installation

```
USER PROMPT> git clone https://github.com/department-of-veterans-affairs/vsra-code.git
Cloning into 'vsra-code'...
Username for 'https://github.com': <ENTER USER NAME>
Password for '<ENTER USER NAME>': <ENTER PERSONAL ACCESS TOKEN>
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 1371 (delta 0), reused 0 (delta 0), pack-reused 1366
Receiving objects: 100% (1371/1371), 26.75 MiB | 6.13 MiB/s, done.
Resolving deltas: 100% (806/806), done.

USER PROMPT> cd vsra-code
USER PROMPT> npm install

> restana@4.7.2 postinstall <WORK PATH>\node_modules\restana
> node ./libs/tasks/postinstall.js

Love restana? Take 30 seconds to share your happiness:

 > https://goo.gl/forms/qlBwrf5raqfQwteH3

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules\@babel\cli\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

added 831 packages from 740 contributors and audited 833 packages in 76.215s

46 packages are looking for funding
  run `npm fund` for details

found 1 high severity vulnerability
  run `npm audit fix` to fix them, or `npm audit` for details
```

### GUI Code Module Installation

```
USER PROMPT>cd packages\gui
USER PROMPT>npm install

> core-js@2.6.11 postinstall <WORK PATH>\packages\gui\node_modules\babel-register\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"

Thank you for using core-js ( https://github.com/zloirock/core-js ) for polyfilling JavaScript standard library!

The project needs your help! Please consider supporting of core-js on Open Collective or Patreon:

> https://opencollective.com/core-js
> https://www.patreon.com/zloirock

Also, the author of core-js ( https://github.com/zloirock ) is looking for a good job -)


> core-js@2.6.11 postinstall <WORK PATH>\packages\gui\node_modules\babel-runtime\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"


> core-js@3.6.5 postinstall <WORK PATH>\packages\gui\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"


> ejs@2.7.4 postinstall <WORK PATH>\packages\gui\node_modules\ejs
> node ./postinstall.js

Thank you for installing EJS: built with the Jake JavaScript build tool (https://jakejs.com/)


> uglifyjs-webpack-plugin@0.4.6 postinstall <WORK PATH>\packages\gui\node_modules\webpack\node_modules\uglifyjs-webpack-plugin
> node lib/post_install.js

npm WARN vista_audit_mqari@0.3.0-dev-3-31-20 No repository field.
npm WARN vista_audit_mqari@0.3.0-dev-3-31-20 No license field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules\webpack-dev-server\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules\watchpack-chokidar2\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

added 1237 packages from 732 contributors and audited 1243 packages in 69.18s

38 packages are looking for funding
  run `npm fund` for details

found 241 vulnerabilities (235 low, 2 moderate, 4 high)
  run `npm audit fix` to fix them, or `npm audit` for details

USER PROMPT>
```



## Microservice Module Build

The microservices are built with the use of Docker *(via either a windows terminal with windows having docker installed, or a Linux terminal with access to the code repository with docker installed)*

### Build Subscriber Module

```
USER PROMPT> npm run subscriber:build

> vas@0.0.1 subscriber:build <WORK PATH>/vsra-code
> npm run ds1 && npm run ds2 && npm run ds3


> vas@0.0.1 ds1 <WORK PATH>/vsra-code
> docker build -t subscriber_r2 -f Dockerfile.subscriber .

Sending build context to Docker daemon 185.6 MB
Step 1/12 : FROM alpine
 ---> f70734b6a266
Step 2/12 : RUN apk add --update nodejs
 ---> Using cache
 ---> f4bf414ac517
Step 3/12 : RUN apk add --update npm
 ---> Using cache
 ---> 937a4568741f
Step 4/12 : RUN apk add --update bash
 ---> Using cache
 ---> 089715a51acc
Step 5/12 : WORKDIR /usr
 ---> Using cache
 ---> 16ef46e128b4
Step 6/12 : COPY package*.json ./
 ---> b97f5506b4bd
Removing intermediate container 87c3adaa4b76
Step 7/12 : COPY packages/AWS/* ./AWS/
 ---> de0aa055c573
Removing intermediate container 55a54343b902
Step 8/12 : COPY packages/sample_data/* ./sample_data/
 ---> 601cdb171d42
Removing intermediate container a4b6fb621e9e
Step 9/12 : COPY packages/subscriber/* ./subscriber/
 ---> b83ed259e47c
Removing intermediate container 1f30c4fca6db
Step 10/12 : COPY packages/subscriber/*js ./subscriber/
 ---> 76dfdfcc2559
Removing intermediate container 3cfb8d409664
Step 11/12 : RUN npm ci --only=production
 ---> Running in 7756b8467df6


> restana@4.7.2 postinstall /usr/node_modules/restana
> node ./libs/tasks/postinstall.js

Love restana? Take 30 seconds to share your happiness:

 > https://goo.gl/forms/qlBwrf5raqfQwteH3

added 259 packages in 7.064s
 ---> 330c63437aef
Removing intermediate container 7756b8467df6
Step 12/12 : CMD node subscriber/
 ---> Running in 73de7e9e9d56
 ---> c8a6e9ed8b45
Removing intermediate container 73de7e9e9d56
Successfully built c8a6e9ed8b45

> vas@0.0.1 ds2 <WORK PATH>/vsra-code
> docker tag subscriber_r2 <DOCKER WORK REPOSITORY>/subscriber_r2:latest


> vas@0.0.1 ds3 <WORK PATH>/vsra-code
> npm run dNLogin && docker push <DOCKER WORK REPOSITORY>/subscriber_r2:latest && docker rmi <DOCKER WORK REPOSITORY>/subscriber_r2:latest

The push refers to a repository [docker.io/<DOCKER WORK REPOSITORY>/subscriber_r2]
26988a25d5b5: Pushed 
844ba47b54e0: Pushed 
f0b96e7fd284: Pushed 
b652d6d3d88f: Pushed 
35e15a419405: Pushed 
93e39474e136: Pushed 
6bda11e5ce50: Layer already exists 
4e42bcc9d044: Layer already exists 
2d39f226cbb4: Layer already exists 
3e207b409db3: Layer already exists 
latest: digest: sha256:7cb379f634c7779fb48d9cad72fc6f031d2b5ea823d350d6066590955a91a76a size: 2416
Untagged: <DOCKER WORK REPOSITORY>/subscriber_r2:latest
Untagged: <DOCKER WORK REPOSITORY>/subscriber_r2@sha256:7cb379f634c7779fb48d9cad72fc6f031d2b5ea823d350d6066590955a91a76a


   ╭────────────────────────────────────────────────────────────────╮
   │                                                                │
   │      New patch version of npm available! 6.14.4 → 6.14.8       │
   │   Changelog: https://github.com/npm/cli/releases/tag/v6.14.8   │
   │               Run npm install -g npm to update!                │
   │                                                                │
   ╰────────────────────────────────────────────────────────────────╯

USER PROMPT>
```

### Build Metadata Module

```
USER PROMPT> npm run metadata:build

> vas@0.0.1 metadata:build <WORK PATH>/vsra-code
> npm run dm1 && npm run dm2 && npm run dm3


> vas@0.0.1 dm1 <WORK PATH>/vsra-code
> docker build -t metadata_r2 -f Dockerfile.metadata .

Sending build context to Docker daemon 185.6 MB
Step 1/11 : FROM alpine
 ---> f70734b6a266
Step 2/11 : RUN apk add --update nodejs
 ---> Using cache
 ---> f4bf414ac517
Step 3/11 : RUN apk add --update npm
 ---> Using cache
 ---> 937a4568741f
Step 4/11 : RUN apk add --update bash
 ---> Using cache
 ---> 089715a51acc
Step 5/11 : WORKDIR /usr
 ---> Using cache
 ---> 16ef46e128b4
Step 6/11 : COPY package*.json ./
 ---> Using cache
 ---> b97f5506b4bd
Step 7/11 : COPY packages/AWS/* ./AWS/
 ---> Using cache
 ---> de0aa055c573
Step 8/11 : COPY packages/metadata/*.js ./metadata/
 ---> 70ae0bd3d307
Removing intermediate container 41a39abd6e69
Step 9/11 : RUN npm ci --only=production
 ---> Running in 64a504616c1f


> restana@4.7.2 postinstall /usr/node_modules/restana
> node ./libs/tasks/postinstall.js

Love restana? Take 30 seconds to share your happiness:
 > https://goo.gl/forms/qlBwrf5raqfQwteH3

added 259 packages in 8.381s
 ---> 517930afdb82
Removing intermediate container 64a504616c1f
Step 10/11 : EXPOSE 8081
 ---> Running in ce1d9567179b
 ---> 5e8b238892ff
Removing intermediate container ce1d9567179b
Step 11/11 : CMD node metadata/
 ---> Running in d63289f9823b
 ---> 1e5be0909e67
Removing intermediate container d63289f9823b
Successfully built 1e5be0909e67

> vas@0.0.1 dm2 <WORK PATH>/vsra-code
> docker tag metadata_r2 <DOCKER WORK REPOSITORY>/metadata_r2:latest


> vas@0.0.1 dm3 /media/sf_CentOS7/VAS_VA/VDD/vsra-code
> npm run dNLogin && docker push <DOCKER WORK REPOSITORY>/metadata_r2:latest && docker rmi <DOCKER WORK REPOSITORY>/metadata_r2:latest

The push refers to a repository [docker.io/<DOCKER WORK REPOSITORY>/metadata_r2]
a1d8cfd28ad9: Pushed 
9af8f728f281: Pushed 
35e15a419405: Mounted from <WORK PATH>/subscriber_r2 
93e39474e136: Mounted from <WORK PATH>/subscriber_r2 
6bda11e5ce50: Layer already exists 
4e42bcc9d044: Layer already exists 
2d39f226cbb4: Layer already exists 
3e207b409db3: Layer already exists 
latest: digest: sha256:5c7c0d1483d037d4a013db0387280cf371c6ed860b97c98587551d639e5bce69 size: 1998
Untagged: <WORK PATH>/metadata_r2:latest
Untagged: <WORK PATH>/metadata_r2@sha256:5c7c0d1483d037d4a013db0387280cf371c6ed860b97c98587551d639e5bce69
USER PROMPT> 

```



### 

### Build Redshift Microservice Module

```
❯ mvn clean install
[INFO] Scanning for projects...
[INFO]
[INFO] --------------------< gov.va.redshift:vas-redshift >--------------------
[INFO] Building vas-redshift 0.0.1-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ vas-redshift ---
[INFO] Deleting <WORK PATH>/vas-redshift/target
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ vas-redshift ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ vas-redshift ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 23 source files to <WORK PATH>/vas-redshift/target/classes
[INFO]
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ vas-redshift ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory <WORK PATH>/vas-redshift/src/test/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ vas-redshift ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 7 source files to <WORK PATH>/vas-redshift/target/test-classes
[INFO]
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ vas-redshift ---
[INFO] Surefire report directory: <WORK PATH>/vas-redshift/target/surefire-reports

-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running gov.va.redshift.data.TimeDimensionTest
Wed Sep 17 01:00:00 EDT 2014
23/Sep/2020 14:42:55,284- RedshiftConnection: Instatiating new Redshift connection
23/Sep/2020 14:42:55,308- RedshiftConnection: Connecting to Redshift jdbc:redshift://vas-dev.ctibauijw8aw.us-gov-west-1.redshift.amazonaws.com:5439/dev
23/Sep/2020 14:42:57,619- TimeDimension: Patient ID: 100
Time ID: 100
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.639 sec
Running gov.va.redshift.data.LocationDimensionTest
23/Sep/2020 14:42:57,805- LocationDimension: SELECT location_id as id from vasdw.locations_dimension WHERE station_number=? and name=?, (107740,BINGHAMTON)
23/Sep/2020 14:42:58,067- LocationDimension: LocationID: 50
Location ID: 50
User [duz=1087960193, uid=59074875, userName=KAZU,G'KALI, title=depth flat mother]
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.442 sec
Running gov.va.redshift.data.PatientDimensionTest
23/Sep/2020 14:42:58,511- PatientDimension: SELECT patient_id as id from vasdw.patients_dimension WHERE mvi=? AND first_name=? AND last_name=? AND ssn=?, (74d2c7f1V80ef4cf2, ORGULAS, SANDHEAVER, 490050875)
Patient ID: 41
Patient [dfn=6274619801, dob=Sun Dec 27 00:00:00 EST 1998, initPlusFour=S0875, mvi=74d2c7f1V80ef4cf2, patientName=SANDHEAVER,ORGULAS, ssn=490050875]
Last Name: SANDHEAVER
First Name: ORGULAS
Middle Name: null
Last Name: AVERY
First Name: DORMAN
Middle Name: K
Last Name: BARLOW
First Name: MIKE
Middle Name: S
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.443 sec
Running gov.va.redshift.data.DateDimensionTest
DAte test:Wed Sep 17 01:00:00 EDT 2014
23/Sep/2020 14:42:58,695- DateDimension: SELECT date_id as id from vasdw.date_dimension WHERE full_date=Wed Sep 17 01:00:00 EDT 2014
23/Sep/2020 14:42:58,958- DateDimension: Date ID: 1356
Date ID: 1356
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.444 sec
Running gov.va.redshift.data.UserDimensionTest
23/Sep/2020 14:42:59,399- UserDimension: SELECT user_id as id from vasdw.users_dimension WHERE uid=?, (59074875)
23/Sep/2020 14:42:59,399- UserDimension: User ID: 33
User ID: 33
User [duz=1087960193, uid=59074875, userName=KAZU,G'KALI, title=depth flat mother]
Last Name: SANDHEAVER
First Name: ORGULAS
Middle Name: null
Last Name: AVERY
First Name: DORMAN
Middle Name: K
Last Name: BARLOW
First Name: MIKE
Middle Name: S
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.44 sec
Running gov.va.redshift.data.FileDimensionTest
23/Sep/2020 14:42:59,838- FileDimension: SELECT file_id as id from vasdw.file_dimension WHERE path = ?, (/path/to/file)
23/Sep/2020 14:42:59,838- FileDimension: File ID: 1
File ID: 1
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.437 sec
Running gov.va.redshift.data.ChangeDimensionTest
23/Sep/2020 14:43:00,282- ChangeDimension: SELECT change_id as id from vasdw.change_dimension WHERE request_type=? and field_name=? and  protocol = ? and file_number = ? and file_name = ? and menu = ?, (Update,STREET ADDRESS 1 (CIVIL),RG EXCPT EDIT PATIENT DATA,396.17,RECALL REMINDERS,)
23/Sep/2020 14:43:00,283- ChangeDimension: Change ID: 2
Change ID: 2
Change [requestType=Update, fieldName=STREET ADDRESS 1 (CIVIL), protocol=RG EXCPT EDIT PATIENT DATA, fileNumber=396.17, fileName=RECALL REMINDERS, menu=]
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.444 sec

Results :

Tests run: 14, Failures: 0, Errors: 0, Skipped: 0

[INFO]
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ vas-redshift ---
[INFO] Building jar: <WORK PATH>/vas-redshift/target/vas-redshift-0.0.1-SNAPSHOT.jar
[INFO]
[INFO] --- maven-assembly-plugin:2.2-beta-5:single (default) @ vas-redshift ---
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] org/ already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] org/ already added, skipping
[INFO] org/apache/ already added, skipping
[INFO] org/apache/commons/ already added, skipping
[INFO] META-INF/NOTICE.txt already added, skipping
[INFO] META-INF/LICENSE.txt already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/ already added, skipping
[INFO] com/ already added, skipping
[INFO] com/fasterxml/ already added, skipping
[INFO] com/fasterxml/jackson/ already added, skipping
[INFO] module-info.class already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/NOTICE already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/ already added, skipping
[INFO] META-INF/services/ already added, skipping
[INFO] com/ already added, skipping
[INFO] com/fasterxml/ already added, skipping
[INFO] com/fasterxml/jackson/ already added, skipping
[INFO] module-info.class already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/LICENSE.txt already added, skipping
[INFO] META-INF/NOTICE already added, skipping
[INFO] META-INF/NOTICE.txt already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-annotations/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-annotations/pom.xml already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-core/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-core/pom.xml already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-databind/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-databind/pom.xml already added, skipping
[INFO] META-INF/maven/commons-logging/commons-logging/pom.properties already added, skipping
[INFO] META-INF/maven/commons-logging/commons-logging/pom.xml already added, skipping
[INFO] META-INF/services/ already added, skipping
[INFO] META-INF/services/com.fasterxml.jackson.core.JsonFactory already added, skipping
[INFO] META-INF/services/com.fasterxml.jackson.core.ObjectCodec already added, skipping
[INFO] Building jar: <WORK PATH>/vas-redshift/target/vas-redshift-0.0.1-SNAPSHOT-jar-with-dependencies.jar
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] org/ already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] org/ already added, skipping
[INFO] org/apache/ already added, skipping
[INFO] org/apache/commons/ already added, skipping
[INFO] META-INF/NOTICE.txt already added, skipping
[INFO] META-INF/LICENSE.txt already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/ already added, skipping
[INFO] com/ already added, skipping
[INFO] com/fasterxml/ already added, skipping
[INFO] com/fasterxml/jackson/ already added, skipping
[INFO] module-info.class already added, skipping
[INFO] META-INF/ already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/NOTICE already added, skipping
[INFO] META-INF/maven/ already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/ already added, skipping
[INFO] META-INF/services/ already added, skipping
[INFO] com/ already added, skipping
[INFO] com/fasterxml/ already added, skipping
[INFO] com/fasterxml/jackson/ already added, skipping
[INFO] module-info.class already added, skipping
[INFO] META-INF/MANIFEST.MF already added, skipping
[INFO] META-INF/LICENSE already added, skipping
[INFO] META-INF/LICENSE.txt already added, skipping
[INFO] META-INF/NOTICE already added, skipping
[INFO] META-INF/NOTICE.txt already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-annotations/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-annotations/pom.xml already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-core/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-core/pom.xml already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-databind/pom.properties already added, skipping
[INFO] META-INF/maven/com.fasterxml.jackson.core/jackson-databind/pom.xml already added, skipping
[INFO] META-INF/maven/commons-logging/commons-logging/pom.properties already added, skipping
[INFO] META-INF/maven/commons-logging/commons-logging/pom.xml already added, skipping
[INFO] META-INF/services/ already added, skipping
[INFO] META-INF/services/com.fasterxml.jackson.core.JsonFactory already added, skipping
[INFO] META-INF/services/com.fasterxml.jackson.core.ObjectCodec already added, skipping
[INFO]
[INFO] --- maven-install-plugin:2.4:install (default-install) @ vas-redshift ---
[INFO] Installing <WORK PATH>/vas-redshift/target/vas-redshift-0.0.1-SNAPSHOT.jar to <DOCKER WORK REPOSITORY>/vas-redshift/0.0.1-SNAPSHOT/vas-redshift-0.0.1-SNAPSHOT.jar
[INFO] Installing <WORK PATH>/vas-redshift/pom.xml to <DOCKER WORK REPOSITORY>/vas-redshift/0.0.1-SNAPSHOT/vas-redshift-0.0.1-SNAPSHOT.pom
[INFO] Installing <WORK PATH>/vas-redshift/target/vas-redshift-0.0.1-SNAPSHOT-jar-with-dependencies.jar to <DOCKER WORK REPOSITORY>/vas-redshift/0.0.1-SNAPSHOT/vas-redshift-0.0.1-SNAPSHOT-jar-with-dependencies.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  12.645 s
[INFO] Finished at: 2020-09-23T14:43:04-04:00
[INFO] ------------------------------------------------------------------------

```



### Build GUI Module

*Note: The GUI Module must be built before building the Utils module*

The GUI (Graphical User Interface) module is built with the use of Webpack (installed as part of the module installation process) via a windows terminal

```
USER PROMPT> npm run gui:prod

> vas@0.0.1 gui:prod <WORK PATH>\vsra-code
> cd packages/GUI && npm run build


> vista_audit_mqari@0.3.0-dev-3-31-20 build <WORK PATH>\vsra-code\packages\gui
> node build/build.js

Hash: be952de38405cc9f13fa
Version: webpack 3.12.0
Time: 26468ms
                                                  Asset       Size  Chunks                    Chunk Names
                static/fonts/fa-solid-900.b15db15.woff2    79.4 kB          [emitted]
                    static/img/fa-solid-900.ec76329.svg     897 kB          [emitted]  [big]
                  static/fonts/fa-solid-900.1ab236e.ttf     203 kB          [emitted]
                 static/fonts/fa-brands-400.c1868c9.eot     133 kB          [emitted]
                static/fonts/fa-regular-400.261d666.eot    34.4 kB          [emitted]
                static/fonts/fa-brands-400.ec3cfdd.woff    89.8 kB          [emitted]
                  static/fonts/fa-solid-900.a0369ea.eot     203 kB          [emitted]
                 static/fonts/fa-solid-900.bea989e.woff     103 kB          [emitted]
               static/fonts/fa-regular-400.f89ea91.woff    16.8 kB          [emitted]
              static/fonts/fa-regular-400.c20b5b7.woff2    13.6 kB          [emitted]
                  static/img/fa-regular-400.89ffa3a.svg     144 kB          [emitted]
                static/fonts/fa-regular-400.db78b93.ttf    34.1 kB          [emitted]
                 static/fonts/fa-brands-400.1368537.ttf     133 kB          [emitted]
               static/fonts/fa-brands-400.a06da7f.woff2    76.6 kB          [emitted]
                   static/img/fa-brands-400.0cb5a5c.svg     716 kB          [emitted]  [big]
               static/js/vendor.e8969ca24bf183c75050.js    2.81 MB       0  [emitted]  [big]  vendor
                  static/js/app.38bd45124c009fdee8be.js    84.3 kB       1  [emitted]         app
             static/js/manifest.2ae2e69a05c33dfc65f8.js     3.9 kB       2  [emitted]         manifest
    static/css/app.e05a69efaa8d6765e34c737f6b1de9a0.css     954 kB       1  [emitted]  [big]  app
static/css/app.e05a69efaa8d6765e34c737f6b1de9a0.css.map    1.27 MB          [emitted]
           static/js/vendor.e8969ca24bf183c75050.js.map    3.46 MB       0  [emitted]         vendor
              static/js/app.38bd45124c009fdee8be.js.map     141 kB       1  [emitted]         app
         static/js/manifest.2ae2e69a05c33dfc65f8.js.map    3.97 kB       2  [emitted]         manifest
                                             index.html  624 bytes          [emitted]
                                         static/mdb.ico    1.15 kB          [emitted]

  Build complete.

  Tip: built files are meant to be served over an HTTP server.
  Opening index.html over file:// won't work.


USER PROMPT> npm run gui:zip

> vas@0.0.1 gui:zip <WORK PATH>\vsra-code
> cd packages/gui/dist && cp -r ../src/assets . && bestzip gui.zip *.ico index.html assets static && mv gui.zip ../../../ENVs/vsr_gui.zip

Writing *.ico, index.html, assets, static to gui.zip...
zipped!

USER PROMPT>
```



### Build Utils Module

Prior to building the Utils module a "*CommonEnv_List.env*" file must be created in the ENV folder of the local development environment and customized with the information appropriate to the environment being utilized (VAEC GovCloud/Redis)

```
# Tells process to use docker environment variables instead of .config
NODE_ENV=docker

metadataPort=8081

AWS_ENV=VAEC
CertFile=<PATH TO CERT FILE>

AWS_REGION=
dcmqPorts=6379:6379

#S3
AWS_VAS_BUCKET=
S3_ARN=
S3=

#Redis/Message Queue Service
# Key to read records posted by VistA
mqKey=vsr
# Key for posting Audit records back to MQ for Redshift to pick up
mqWriteKey=vsr_audit
mqServer=
REDIS=
REDIS_HOST=
REDIS_PORT=6379
mqPort=6379

#Redshift
RS_HOST=
REDSHIFT_HOST=
RED_SHIFT=
REDSHIFT_USER=
RS_USER=
REDSHIFT_DB=
RS_DATABASE=
REDSHIFT_PASSWORD=
RS_PASSWORD=
REDSHIFT_PORT=
RS_PORT=

```



```

USER PROMPT> npm run utils:build

> vas@0.0.1 utils:build <WORK PATH>\vsra-code
> npm run du1 && npm run du2 && npm run du3

> vas@0.0.1 du1 <WORK PATH>\vsra-code
> docker build -t utils -f Dockerfile.utils .

Sending build context to Docker daemon 197.5 MB
Step 1/14 : FROM alpine
 ---> f70734b6a266
Step 2/14 : RUN apk add --update nodejs
 ---> Using cache
 ---> f4bf414ac517
Step 3/14 : RUN apk add --update npm
 ---> Using cache
 ---> 937a4568741f
Step 4/14 : RUN apk add --update bash
 ---> Using cache
 ---> 089715a51acc
Step 5/14 : WORKDIR /usr
 ---> Using cache
 ---> 16ef46e128b4
Step 6/14 : COPY package*.json ./
 ---> Using cache
 ---> b97f5506b4bd
Step 7/14 : COPY packages/AWS/* ./AWS/
 ---> Using cache
 ---> de0aa055c573
Step 8/14 : COPY packages/subscriber/* ./subscriber/
 ---> Using cache
 ---> 1e34d43e2155
Step 9/14 : COPY packages/sample_data/* ./sample_data/
 ---> Using cache
 ---> 2660580f3dc1
Step 10/14 : COPY packages/utils/*.js ./utils/
 ---> Using cache
 ---> 9b8811ff16fa
Step 11/14 : COPY *.pem ./utils/
 ---> 0a6d56d83e42
Removing intermediate container f59814a41c3f
Step 12/14 : RUN chmod 600 ./utils/*.pem
 ---> Running in 8b4b114928eb

 ---> b3fd63d46553
Removing intermediate container 8b4b114928eb
Step 13/14 : RUN npm ci --only=production
 ---> Running in c68b18b3776f


> restana@4.7.2 postinstall /usr/node_modules/restana
> node ./libs/tasks/postinstall.js

Love restana? Take 30 seconds to share your happiness:
 > https://goo.gl/forms/qlBwrf5raqfQwteH3

added 259 packages in 8.385s
 ---> 8e03d6b5f4b3
Removing intermediate container c68b18b3776f
Step 14/14 : CMD tail -f /dev/null
 ---> Running in 5eaececaf8d7
 ---> 8b24acf7bdb3
Removing intermediate container 5eaececaf8d7
Successfully built 8b24acf7bdb3

> vas@0.0.1 du2 <WORK PATH>/vsra-code
> docker tag utils <DOCKER WORK REPOSITORY>/utils:latest


> vas@0.0.1 du3 <WORK PATH>/vsra-code
> npm run dNLogin && docker push <WORK PATH>/utils:latest && docker rmi <DOCKER WORK REPOSITORY>/utils:latest

The push refers to a repository [<DOCKER WORK REPOSITORY>/utils]
88e67e6075e8: Pushed 
ebf0f61edbad: Pushed 
4b823f16aac4: Pushed 
d8eab21df160: Pushed 
8471889cc88b: Pushed 
c1f93e883cdb: Pushed 
35e15a419405: Mounted from <WORK PATH>/metadata_r2 
93e39474e136: Mounted from <WORK PATH>/metadata_r2 
6bda11e5ce50: Layer already exists 
4e42bcc9d044: Layer already exists 
2d39f226cbb4: Layer already exists 
3e207b409db3: Layer already exists 
latest: digest: sha256:2902c107d337947ff0a999b8a134e848ee5ac3037de3ea377a2c63ceefe2d90c size: 2832
Untagged: <WORK PATH>/utils:latest
Untagged: <WORK PATH>/utils@sha256:2902c107d337947ff0a999b8a134e848ee5ac3037de3ea377a2c63ceefe2d90c

USER PROMPT>
```



## Microservice Module Installation

Use SSH to connect up to the VAEC EC2 instance established for the working environment

```
USER PROMPT>mkdir ENVS
USER PROMPT>cd ENVS
USER PROMPT>sudo docker run -d --name utils <DOCKER WORK REPOSITORY>/utils:latest
USER PROMPT>sudo docker cp utils:/usr/ENVS/envs.zip
USER PROMPT>sudo docker cp utils:/usr/ENVS/vsr_gui.zip
USER PROMPT>sudo unzip envs.zip
USER PROMPT>sudo chmod 777 *.sh
USER PROMPT>./pullMetadata.sh
USER PROMPT>./pullSubscriber.sh
USER PROMPT>./pullRedsfhit.sh
USER PROMPT>./metadata.sh
USER PROMPT>./subscriber.sh
USER PROMPT>./utils.sh
USER PROMPT>./pushGUI.sh
```

The status of any service can be determined by checking the logs for any of the services (subscriber, redshift, metadata). For example:

```
USER PROMPT>sudo docker logs --tail 20 subscriber

USER PROMPT$ sudo docker logs --tail 20 subscriber
AWS_Config -  { apiVersions: { s3: '2006-03-01' }, region: 'us-gov-west-1' }
Initialize Subscriber service
Subscriber Initialization port: 6379, server: <REDIS SERVER>, bucket: <S3 BUCKET>
connected
SET -  OK
Are we connected? - Yes we are
Starting with data in the DR:  { nAudit: 1000 }
USER PROMPT$
```




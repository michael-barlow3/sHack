# `Utils`

## Usage

Various individual components for use in checking out the various components of the different environments in the VistA Audit Solution

####Environments:

**LOC** - Local Computer Development Environment ()

**POC** - Proof of Concept Environment

**DEV** - MUMPS Development Environment

**Test** - QA Test Environment

**Stage** - QA Staging/PreProd environment

### Functions

**clear** - Delete Metadata and Audit records from Data Repository

**clearAudit** - Delete Audit Records from temporary Data Repository (no longer needed)

**gen_2_das** - Generate random audit records and write directly to Data Repository

**gen_records** - Generate random audit records and write to Message Queue Service

**get -** Get Metadata and Audit Records (up to 100) from Data Repository

**howmany -** Count how many Audit and Metadata records are in the Data Repository

**read_meta -** Get Metadata and display Patient Names and the people who looked at their records

**s3_count_records -** 

**s3_list_bucket -**

**s3_read_bucket -**

**s3_write_bucket -** 

### clear

Clear out the Data Repository of the specified environment

```
VAS> docker exec -it utils bash
VAS> node utils/clear <ENV> --confirm
```

### clearAudit

Clear out the Audit Records in the Data Repository of the specified environment

```
VAS> docker exec -it utils bash
VAS> node utils/clearAudit <ENV> --confirm
```

### gen_records

Generate random audit records and push them the the Message Queue Service of the specified environment <ENV>.

The following parameters are optional, if none are given a single random record will be generated:

- The number of records to generate (c)
- A specific patient from a list of random patient names (p)
- A specific user from a list of random user names (u)

```
VAS> docker exec -it utils bash
VAS> node utils/gen_records <ENV> c=# p=# u=#
```



### gen2das

Generate random audit records and write them directly to the DAS Data Repository, bypassing the Message Queue Service as well as the Subscriber Microservice.

The following parameters are optional, if none are given a single random record will be generated:

- The number of records to generate (c)
- A specific patient from a list of random patient names (p)
- A specific user from a list of random user names (u)

```
VAS> docker exec -it utils bash
VAS> node utils/gen2das <ENV> c=# p=# u=#
```



### howmany

How many records (both Audit and Metadata) exist within the Data Repository of the specified environment

```
VAS> docker exec -it utils bash
VAS> node utils/howmany <ENV>
```



### ReadMD

Read the first 100 records in the DAS DR and display them on the console





### common_code

Common code module for use by the various utilities

*Note: if not running the utils module in docker then the following can replace the docker command:*

```
VAS> cd packages\utils
VAS> node lib/<util><ENV><Parameters>
```


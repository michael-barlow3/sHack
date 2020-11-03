# `MetaData` REST Based Microservice

## Usage

Launch the service via:

```
# VAS> cd packages/metadata
# VAS /packages/metadata> node index
```

*Note: Makes use of the following ENV variables from the standard .env at the root*

- *metadataPort*
- *drURL*

So make sure the .env file (or a reduced version containing the required variables) from the root is copied to the packages/metadata folder before starting

This starts up an HTTP server listening on the port specified in the .ENV file (8081 by default)

The metadata service responds to the following queries:

- patient
- user
- ubyp
- abygup
- INT_QueryMeta



### patient query

Retrieve all patient metadata records by PatientName AND one or both of the following: DOB, SSN
	**qsParams:**
		p = PatientName - LastName,FirstName
		d = DOB - mmddyyyy
		s = SSN - #########

	http://192.168.0.25:8081/patient?p=MOGODUSH,GELLY&d=19981001
returns an array of metadata record objects:

```
{
	"response": {
		"p": "MOGODUSH,GELLY",
		"s": "278949806",
		"d": "19981001",
		"u": [
			["PUDDIFOOT,HAMFAST-37072076"]
		]
	}
}
```

```
http://192.168.0.25:8081/patient?p=SUBAIESH,KETHAS&d=20002012
```

```
{
	"response": {
		"p": "SUBAIESH,KETHAS",
		"s": "397136412",
		"d": "20002012",
		"u": [
			[ 
				"KULTAN,M'LARA-80900497", 
				"BURROWES,GLORIANA-43749663", 
				"RUMBLE,HAL-51352024", 
				"HAYWARD,FILIBERT-4611120",
				...
			]
	}
}
```

New POC Environment:

```
http://192.168.0.25:8081/MetaData/{patient}
```

where {patient} 

| Name                    | Description                             |
| :---------------------- | :-------------------------------------- |
| patient - *string(path) | Patient Name - Last,First Middle format |
| ssn - string(query)     | Patient SSN (######### OR #########P)   |
| dob - integer(query)    | Patient DOB (YYYYMMDD)                  |

```
https://virtserver.swaggerhub.com/michael-barlow3/VAS-DR-3/1.0/MetaData/Barlow%2CMichael?ssn=123456789
```



```
http://192.168.0.25:8081/meta?p=SUBAIESH,KETHAS-397136412-20002012&u=AMEREX,AHIKAR-32049556
```



```
[{
	"_id": "5ef11f195ffaac0087da30af",
	"p": "SUBAIESH,KETHAS-397136412-20002012",
	"u": "AMEREX,AHIKAR-32049556",
	"c": "ICN CHECKSUM",
	"l": "DALY CITY",
	"d": "20091009221242-0500"
}]
```
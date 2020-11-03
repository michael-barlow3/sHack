# Utility Functions

## s3_read_audit function

### Usage

Return a list of paths to audit record from the Data Repository or a specific audit record

```
> node s3_read_audit -h
```

​                                     

```
Usage: s3_read_audit [options]

Options:
  --version    Show version number                                     [boolean]
  -c, --count  Number of records to retrieve                           [default: 1]
  -p, --path   Retrieve record(s) at specified path - e.g. 2016/09/
  -h, --help   Show help                                               [boolean]

Examples:
  s3_read_audit - Retrieve Audit Records (up to 100) in the Environment being  tested and display paths to the individual audit records
  s3_read_audit -c 10 - Retrieve up to 10 Audit Records
  s3_read_audit -c 10 -p 2016/09 - Retrieve up to 10 Audit Records starting in  the specified path (2016/09)
  s3_read_audit -c 10 -p 2016/04/05/1595887639906_5900_348476de.json -  Retrieve specific audit record and display the record
```

### Examples

**Example:** passing only count (which is less than the total # of records in the repository)

```
> node s3_read_audit -c 5
```



```
Audit Records:  [
  '1980/12/04/1595887639913_5900_4c787577.json',
  '1990/09/11/1595887639896_5900_82fec9e1.json',
  '1992/10/22/1595887639892_5900_9e5b06f1.json',
  '2000/08/26/1595887639908_5900_815ea546.json',
  '2003/02/19/1595887639900_5900_48fae579.json'
]

```



**Example:** Passing count (which is less than the total # of records in the repository) and a partial path

```
> node s3_read_audit -c 5 -p 2016/
```

Note there are only 3 records matching the specified partial path

```
Audit Records:  [
  '2016/04/05/1595887639906_5900_348476de.json',
  '2016/09/04/1595623191688_22384_6599c280.json',
  '2016/09/04/1595623827388_27825_c8680535.json'
]
```





**Example:** Passing count and a full path to a specific Audit Record

```
> node s3_read_audit -c 5 -p 2016/04/05/1595887639906_5900_348476de.json
```



```
Audit Record:  {
  HEADER: {
    RequestType: 'Update',
    User: {
      DUZ: 4683392493,
      UID: 74739558,
      UserName: 'TRETH,KOVLOR',
      Title: 'dish electricity game determine simple'
    },
    Location: { Site: 'DRAPER', StationNumber: 107740 },
    DateTime: '20160405100325-0500',
    SchemaType: 'FMAUDIT',
    Patient: {
      DFN: 4146660556,
      DOB: 19341711,
      INITPLUS4: 'E8988',
      MVI: '76ee7cfeV1f214ae7',
      PatientName: "ERADA,G'MORA",
      SSN: '771168988'
    }
  },
  SCHEMA: {
    'RECORD ADDED': '',
    ACCESSED: '',
    'NEW VALUE': '',
    'OLD VALUE': '',
    'FIELD NAME': 'FULL ICN',
    'PROTOCOL or OPTION USED': 'RG ADT OUTPATIENT ENCOUNTER DRIVER',
    'FILE NUMBER': 500123,
    'FILE NAME': 'ZDKA PATIENT',
    'MENU OPTION USED': ''
  },
  path: '2016/04/05/1595887639906_5900_348476de.json'
}
```


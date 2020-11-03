# `sample_data`

## Usage

```
This package is used internally to generate sample Audit Records to simulate data coming from VistA in order to test out the non-Mumps code w/o the need for a VistA Environment
```

There is no direct installation or testing of this package from within the package itself.

###Installation (and testing) is done from the root:

```
#VAS> npm run install
```

###Run LINT check

```
#VAS> npm run lint_sample
```

###Run Unit Tests

```
#VAS> npm run test_sample
```

### Function/Schema exposed for external use

	genAuditRecords,
	auditSchema
The `genAuditRecords()` function is the only function in the package designated for external use. This function is designed to generate one or more random records from a list of potential patients/users and other VistA related style data.

This package also exposes an `auditSchema` for use in checking if records match the designated schema

The list of potential patients/users was generated from an external site with that intended purpose: // Names data from: https://www.fakenamegenerator.com/order.php

A list of Names, DOB, SSN and various other information was generated and then used to generate the random information for testing.

*H_K_Names.json* data file is used for Patient information, while the

*HKNames2.json* data file is used for User information.

Calling syntax for the function follows:

**genAuditRecords(howmany, idxP, idxU)**

*"howmany"* tells how many random simulated VistA Audit records to generate

*"idxP"* if passed as null indicates that random Patient Information is to be used for the generation of each record. If "idxP" is passed as a number then that is used as an index into the list of Patients extracted from the fakenamegenerator site (there are a total of 3000 random patients in the current list, so idxP should NOT exceed 3000)

*"idxU"* if passed as null indicates that random User information is to be used for the generation of each record. If "idxU" is passed as a number then that is used as an index into the list of Users extracted from the fakenamegenerator site (there are a total of 3000 random patients in the current list, so idxU should NOT exceed 3000)

The function will return an array of simulated VistA Audit records.


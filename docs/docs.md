# Kevin the Hack Buster – API Docs

**version:** *1.0*

**by** *Patryk Ryak*

---

**Table of contents:**

1. [Introduction](#introduction)
    
    * [Basic info](#basic-info)
    * [API Levels](#api-levels)
    * [Errors](#errors)
    
2. [Endpoints](#endpoints)
    * [Root level](#root-level)
    
      * [Set public key](#set-public-key)
    
      * [Adding a company](#adding-a-company)
      * [Deleting a company](#deleting-a-company)
    
    * [public](#public-level)
    
      * [Requesting a quiz](#requesting-a-quiz)
      * [Submit an answer](#submit-an-answer)
    
    * [company](#company-level)
    
      * [Login](#login)
      * [Logout](#logout)
      * [Telemetry](#telemetry)
      * [Getting questions](#getting-questions)
      * [Adding new question](#adding-new-question)
      * [Editing question](#editing-question)
      * [Deleting question](#deleting-question)

---

# Introduction

## Basic info

This is first public version of this **API**.

Kevin's api is organized around **REST**.

For presentation purposes we will use the base URL as:
```
https://kevin.com/api
```

**NOTE:** Final URL will differ.

Please, report to me if you find a bug! :bug:

## API Levels

API consists of three level of access:
* Root level
* Public level
* Company level

**Root level** allows to add and delete companies. It can also set API public key for clients to autenticate. It is not supposed to have GUI. It is designed to be used by company that hosts API and wants root access.

**Public level** is an access level for client apps (game distributed to many platforms). It is used for sending selected questions for quiz and reciving data about answers. In order to make sure only trusted clients can use api, "*PublicKey*" is required to connect. It is also usefull to forbid older versions of client apps from connecting to the API. Public level request must include statment showed below:

```json
{
	"publicKey": "testKey"
}
```

**Company Level** is the most advanced of all layers. It uses JWT cookie to authenticate clients. It is designed for administration of a single client company account. It allows to manage questions and see telemetry data gathered from answered questions.

### Errors

How API handles errors?

Every error has specific message that will further explain a problem.

**Errors table:**

| **Error** | **Code** | **Meaning** |
| --- | --- | --- |
| 200 | Success | Everything went well |
| 404 | Not Found | No such route |
| 403 | Forbidden | Permission denied |
| 400 | syntax error | Something is wrong with .json (message will specify) |
| 500 | Server error | Cannot process something (message will specify) |

**Error example:**

```json
{
	"error": "403",
	"message": "Access Denied"
}
```

# Endpoints
---
## Root level:



### <u>Set public key:</u>

**Path:**

```
https://kevin.com/api/root/setApiPublicKey
```

**Type:** POST

**Request:**

```json
{
	"rootKey": "RootExampleKey",
	"newPublicKey": "testKey"
}
```
**Response:**
```json
{
	"Success": "200",
	"message": "Public key updated successfully",
	"previous": "exampleKey",
	"current": "testKey"
}
```
**Info:** All fields in request are required



### <u>Adding a company:</u>

**Path:**

```
https://kevin.com/api/root/addCompany
```

**Type:** POST

**Request:**

```json
{
	"rootKey": "RootSuperSecretKey",
	"companyName": "TestCompany",
	"password": "example"
}
```

**Response:**

```json
{
	"status": "200",
	"message": "Company added"
}
```

**Info:** All fields in request are required



### <u>Deleting a company</u>

**Path:**

```
https://kevin.com/api/root/delCompany
```

**Type:** POST

**Request:**

```json
{
	"rootKey": "RootSuperSecretKey",
	"companyName": "TestCompany"
}
```

**Response:**

```json
{
	"status": "200",
	"message": "Company deleted"
}
```

**Info:** All fields in request are required



---
## Public level:



### <u>Requesting a quiz:</u>

**Path:**

```
https://kevin.com/api/quiz
```

**Type:** POST

**Request:**

```json
{
	"publicKey": "testKey",
	"company": "TestCompany"
}
```

"company" field is a data that user has to provide. If it's correct then the access to a quiz will be granted and response will end with success.

**Response:**

```json
{
	"status": "200",
	"questions": [
		{
			"QID": "c9d14faa-6eb8-430d-8a05-d328010a7c85",
			"Options": [
				[
					"Option 1",
					true
				],
				[
					"Option 2",
					false
				]
			],
			"Company": "TestCompany",
			"InUse": true,
			"Category": "Examples",
			"Body": "My question"
		}
	]
}
```

Successful request will return status and array of questions. In this example only one question has been associated with this company. [Learn more about question structure](#adding-new-question).



### <u>Submit an answer:</u>

**Path:**

```
https://kevin.com/api/answer
```

**Type:** POST

**Request:**

```json
{
	"publicKey": "testKey",
	"company": "TestCompany",
	"qid": "c9d14faa-6eb8-430d-8a05-d328010a7c85",
  "platform": "PC",
  "options": [false, true]
}

```

In order to submit an answer about question qou need to provide its QID (Question ID) and array of selected options by user in order as provided in .json from quiz request. 

**For example:**
There were two options:

```json
"Options": [
				[
					"Option 1",
					true
				],
				[
					"Option 2",
					false
				]
		]
```

So submited array of options looks like: "options": [false, true]. That means that user selected "Option 2" as an answer.

**Response:**

```json
{
	"status": "200",
	"message": "Answer submited"
}
```

**Info:** All fields in request are required



---
## Company level:

### <u>Login:</u>
**Path:**

```
https://kevin.com/api/company/auth/login
```

**Type:** POST

**Request:** 

```json
{
	"login": "TestCompany",
	"password": "example"
}
```

**Response:**

```json
{
	"status": "200",
	"message": "Logged as TestCompany"
}
```



### <u>Logout</u>:

**Path:**

```
https://kevin.com/api/company/auth/logout
```

**Type:** POST

**Request:** No data needs to be sent.

**Response:**

```json
{
	"status": "200",
	"message": "Logged out"
}
```



### <u>Setting a new password:</u>

**Path:**

```
https://kevin.com/api/company/newPassword
```

**Type:** POST

**Request:** 

```json
{
	"login": "TestCompany",
	"password": "example"
}
```

**Response:**

```json
{
	"status": "200",
	"message": "Logged as TestCompany"
}
```



### <u>Telemetry:</u>

**Path:**

```
https://kevin.com/api/company/telemetry
```

**Type:** POST

**Request:** No data needs to be sent.

**Response:**

```json
{
	"status": "200",
	"telemetry": [
		{
			"Platform": "PC",
			"Date": "2024-02-03T20:34:41.564Z",
      "QID": "c9d14faa-6eb8-430d-8a05-d328010a7c85",
			"Options": [
				false,
				true
			],
			"Company": "TestCompany"
		}
	]
}
```

Response returns telemetry array that contains previously sent values. They are not filtered to reduce ammount of requests to database. Processing and presenting that data is a front-end job. To get information about all questionss associated with this company use request showed in the next paragraph.

### <u>Getting questions:</u>

**Path:**

```
https://kevin.com/api/company/questions
```

**Type:** POST

**Request:** No data needs to be sent.

**Response:**

```json
{
	"status": "200",
	"questions": [
		{
			"QID": "c9d14faa-6eb8-430d-8a05-d328010a7c85",
			"Options": [
				[
					"Option 1",
					true
				],
				[
					"Option 2",
					false
				]
			],
			"Company": "TestCompany",
			"InUse": true,
			"Category": "Examples",
			"Body": "My question"
		}
	]
}
```

This route will return all questions associated with company even if "InUse" parameter is set to *false*.



### <u>Adding new question:</u>

**Path:**

```
https://kevin.com/api/company/questions/add
```

**Type:** POST

**Request:** 

```json
{
	"body": "Question",
	"options": [
			[
					"A",
					true
			],
			[
					"B",
					false
			],
			[
					"C",
					false
			]
	],
	"category": "Programming",
	"inUse": true
}
```

**About question structure:**

All fields 



**Response:**

```json
{
	"status": "200",
	"message": "Question added"
}
```



### <u>Editing question:</u>







### <u>Deleting question:</u>



***

## The End!


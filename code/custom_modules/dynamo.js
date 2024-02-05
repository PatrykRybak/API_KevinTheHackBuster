const fs = require('fs');
const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

let api_conf = JSON.parse(fs.readFileSync(__dirname + '/../api_configuration.json'));

AWS.config.update({
    region: api_conf.aws.region,
    accessKeyId: api_conf.aws.accessKeyId,
    secretAccessKey: api_conf.aws.secretAccessKey,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const addOrUpdate = async (tableName, data) => {
    const params = {
        TableName: tableName,
        Item: data,
    };
    return await dynamoClient.put(params).promise();
};

const readTelemetryRecord = async (Company) => {
    const params = {
        TableName: 'Telemetry',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
          '#id': 'Company'
        },
        ExpressionAttributeValues: {
          ':id': Company
        }
      };
    return await dynamoClient.query(params).promise();
};

const newTelemetryRecord = async (data) => {
    const params = {
        TableName: "Telemetry",
        Item: data,
    };
    return await dynamoClient.put(params).promise();
};


const del = async (tableName, id) => {
    const params = {
        TableName: tableName,
        Key: id
    };
    return await dynamoClient.delete(params).promise();
};

const getCompanyByName = async (tableName, Name) => {
    const params = {
        TableName: tableName,
        Key: {
            Name,
        },
    };
    return await dynamoClient.get(params).promise();
};

const getQuestionsfromCompany = async (Company) => {
    const params = {
        TableName: "Questions",
        FilterExpression : "#sk1 = :skv1 AND #sk2 = :skv2",
        ExpressionAttributeNames:{
            "#sk1": "Company",
            "#sk2": "InUse"
        },
        ExpressionAttributeValues: {
            ":skv1": Company,
            ":skv2": true
        }
    };
    return await dynamoClient.scan(params).promise();
};

const getAllQuestions = async (Company) => {
    const params = {
        TableName: "Questions",
        FilterExpression : "#sk = :skv",
        ExpressionAttributeNames:{
            "#sk": "Company"
        },
        ExpressionAttributeValues: {
            ":skv": Company
        }
    };
    return await dynamoClient.scan(params).promise();
};

const deleteQuestionByQID = async (QID) => {
    const params = {
        TableName: "Questions",
        Key: QID
    };
    console.log(params);
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    addOrUpdate,
    del,
    getCompanyByName,
    getAllQuestions,
    getQuestionsfromCompany,
    deleteQuestionByQID,
    newTelemetryRecord,
    readTelemetryRecord
};

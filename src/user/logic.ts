'use strict'
import { ProxyCallback } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
const dynamoDb = new DynamoDB.DocumentClient()
import * as uuid from 'uuid'
import { User } from '../interface'

const timestamp = new Date().getTime()

export const createUser = (event: any, callback: ProxyCallback, tableName: string) => {

    const data: User = event.body
    const params: any = {
        TableName: tableName,
        Item: {
            id: uuid.v1(),
            uname: data.uname,
            status: data.status,
            createdAt: timestamp
        }
    }

    // write the todo to the database
    dynamoDb.put(params, (error, result) => {
        // handle potential errors
        if (error) {
            callback(new Error('Couldn\'t create the todo item. awsTest' + error))
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        }
        callback(undefined, response)
    })

}

export const updateUser = (event: any, callback: ProxyCallback, tableName: string) => {
    const data: User = event.body
    const params: any = {
        TableName: tableName,
        Key: { id: data.id },
        UpdateExpression: "set uname = :uname, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":uname": data.uname,
            ":updatedAt": timestamp
        },
        ReturnValues: "UPDATED_NEW"
    }

    // write the todo to the database
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            callback(new Error('Couldn\'t update the todo item. awsTest' + error))
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        }
        callback(undefined, response)
    })

}
export const removeUser = (event: any, callback: ProxyCallback, tableName: string) => {
    const data: User = event.body
    const params: any = {
        TableName: tableName,
        Key: { id: data.id }
    }

    // write the todo to the database
    dynamoDb.delete(params, (error, result) => {
        // handle potential errors
        if (error) {
            callback(new Error('Couldn\'t delete the todo item. awsTest' + error))
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        }
        callback(undefined, response)
    })

}

export const getSingleUser = (event: any, callback: ProxyCallback, tableName: string) => {
    const data: User = event.body
    const params: any = {
        TableName: tableName,
        Key: { id: data.id }
    }

    // write the todo to the database
    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            callback(new Error('Couldn\'t get Single the todo item. awsTest' + error))
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        }
        callback(undefined, response)
    })

}

export const getUsers = (event: any, callback: ProxyCallback, tableName: string) => {
    const data: User = event.body
    const params: any = {
        TableName: tableName,
        ProjectionExpression: "id,uname",
        FilterExpression: "#uname = :uname",
        ExpressionAttributeNames: {
            "#uname": "uname",
        },
        ExpressionAttributeValues: {
            ":uname": data.uname
        }
    }

    let items: any = []

    var scanExecute = function (callback: ProxyCallback) {
        dynamoDb.scan(params, function (err, result) {
            if (err) {
                callback(err)
                return
            }

            items = items.concat(result.Items)
            if (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey
                scanExecute(callback)
            } else {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(items)
                }
                callback(err, response)
            }
        })
    }
    scanExecute(callback)

}
'use strict'
import { Handler, Context, ProxyCallback } from 'aws-lambda'
import { userValidation } from '../validation'
import { createUser, updateUser, removeUser, getSingleUser, getUsers } from './logic'

export const update: Handler = (event: any, context: Context, callback: ProxyCallback) => {

  const result = userValidation(event, callback)
  if (result) {
    if (event.body.id) {
      updateUser(event, callback, 'awsTest')
    } else {
      createUser(event, callback, 'awsTest')
    }
  }
}

export const remove: Handler = (event: any, context: Context, callback: ProxyCallback) => {
  removeUser(event, callback, 'awsTest')
}

export const get: Handler = (event: any, context: Context, callback: ProxyCallback) => {
  if (event.type === 'single') {
    getSingleUser(event, callback, 'awsTest')
  } else {
    getUsers(event, callback, 'awsTest')
  }

}
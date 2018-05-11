'use strict'
import { ProxyCallback } from 'aws-lambda'
import { User } from '../interface'

export const userValidation = (event: any, callback: ProxyCallback) => {
    let result: boolean = true
    const data: User = event.body
    if (typeof data.uname !== 'string') {
        callback(new Error('Couldn\'t create the todo item. Validation'))
        result = false
    }
    return result
}
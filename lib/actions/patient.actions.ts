'use server'

import { ID, Query } from 'node-appwrite'
import { users } from '../appwrite.config'
// import { log } from 'console'
import { parseStringify } from '../utils'

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )
    // console.log({ newUser })

    return parseStringify(newUser)
  } catch (error: any) {
    // CHECK EXISTING USER
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])])

      return documents?.users[0]
    }
    console.error('User not created error found:', error)
  }
}

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId)

    return parseStringify(user)
  } catch (error) {
    console.error(error)
  }
}

'use server'

import { ID, Query } from 'node-appwrite'
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from '../appwrite.config'
// import { log } from 'console'
import { parseStringify } from '../utils'
import { InputFile } from 'node-appwrite/file'

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

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      )

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    )

    return parseStringify(newPatient)
  } catch (error) {
    console.error(error)
  }
}

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    )

    return parseStringify(patients.documents[0])
  } catch (error) {
    console.error(error)
  }
}

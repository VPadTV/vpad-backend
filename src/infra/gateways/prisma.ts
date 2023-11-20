import { PrismaClient } from '@prisma/client'

export abstract class Database {
  static client: PrismaClient

  static get(): PrismaClient {
    if (!Database.client)
      Database.client = new PrismaClient()
    return Database.client
  }
}
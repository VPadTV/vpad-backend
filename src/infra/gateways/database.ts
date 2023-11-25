import { PrismaClient } from '@prisma/client'

export type DatabaseClient = PrismaClient

export abstract class Database {
    static client: DatabaseClient

    static get(): DatabaseClient {
        if (!Database.client)
            Database.client = new PrismaClient()
        return Database.client
    }
}
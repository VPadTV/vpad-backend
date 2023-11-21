export type FileStorageClient = any

export class FileStorage {
    private static instance: FileStorage;
    private client: FileStorageClient
    
    private constructor() {
        this.client = {}
    }

    static get(): FileStorage {
        if (!FileStorage.instance)
            FileStorage.instance = new FileStorage()
        return FileStorage.instance
    }

    private async upload(fileBase64: string): Promise<string> {
        console.log(`Uploading ${fileBase64}`)
        return 'debugUrl'
    }

    private async delete(url: string): Promise<void> {
        console.log(`Deleting ${url}`)
    }
}
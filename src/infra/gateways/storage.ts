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

    public async upload(fileBase64: string): Promise<string> {
        console.log(`Uploading ${fileBase64}`)
        console.log(this.client)
        return 'debugUrl'
    }

    public async delete(url: string): Promise<void> {
        console.log(`Deleting ${url}`)
    }
}
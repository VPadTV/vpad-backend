import { App } from './app'
import dotenv from 'dotenv'
dotenv.config()

const startApplication = async () => {
    const app = new App()
    try {
        app.start()
    }
    catch (e) {
        console.error('====================================')
        console.error(e)
        console.error('====================================')
    }
}

startApplication()
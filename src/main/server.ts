import { App } from './app';
import dotenv from 'dotenv';
dotenv.config();

const startApplication = async (): Promise<void> => {
	try {
		const app = new App();

		app.server.listen(process.env.PORT, () =>
			console.log(
				`[API] Server running at http://localhost:${process.env.PORT}`,
			),
		);
	} catch (e) {
		console.error('====================================');
		console.error(e);
		console.error('====================================');
	}
};

startApplication();

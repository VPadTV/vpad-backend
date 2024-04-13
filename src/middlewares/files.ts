import os from 'os';
import multer, { memoryStorage } from 'multer';
import { FileField } from './files.types';

const multerMidd = multer({
	dest: os.tmpdir(),
	storage: memoryStorage(),
});

export const fields = (names: string[]) => {
	const fields: FileField[] = [];
	for (const name of names)
		fields.push({
			name,
			maxCount: 1,
		});
	return multerMidd.fields(fields);
};

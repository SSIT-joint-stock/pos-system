import * as path from 'node:path';
import * as process from 'node:process';

const workerPath = path.join(process.cwd(), 'dist/workers');
const storagePath = path.join(process.cwd(), 'storage');
const staticPath = path.join(process.cwd(), 'storage/static');
const assetPath = path.join(process.cwd(), 'storage/asset');

console.log('workerPath', workerPath);
console.log('storagePath', storagePath);
console.log('staticPath', staticPath);
console.log('assetPath', assetPath);


export {
	workerPath,
	storagePath,
	staticPath,
	assetPath
}
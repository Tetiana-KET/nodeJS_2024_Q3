import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import { startServer } from './server';
import { config } from 'dotenv';
import { DEFAULT_BALANCER_PORT } from './consts/detaultPort';
import { HttpStatus } from './models/HttpStatus';
import { ErrorMessages } from './models/ErrorMessages';
config();

const PORT = process.env.LOAD_BALANCER_PORT || DEFAULT_BALANCER_PORT;
const WORKERS_NUM = availableParallelism() - 1;
let requestCount = 0;

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running on port ${PORT}`);

	for (let i = 0; i < WORKERS_NUM; i++) {
		cluster.fork();
	}

	const loadBalancer = http.createServer((req, res) => {
		const workerId = (requestCount % WORKERS_NUM) + 1;
		requestCount++;

		const options = {
			hostname: 'localhost',
			port: +PORT + workerId,
			path: req.url,
			method: req.method,
			headers: req.headers,
		};
		const proxy = http.request(options, workerRes => {
			const statusCode = workerRes.statusCode || HttpStatus.InternalServerError;
			res.writeHead(statusCode, workerRes.headers);
			workerRes.pipe(res, { end: true });
		});
		req.pipe(proxy, { end: true });
		proxy.on('error', err => {
			console.error('Proxy error:', err);
			res.writeHead(HttpStatus.InternalServerError);
			res.end(ErrorMessages.InternalServerError);
		});
	});

	loadBalancer.listen(PORT, () => {
		console.log(`Load balancer running on http://localhost:${PORT}`);
	});
} else {
	const workerId = cluster.worker?.id;
	if (workerId) {
		const workerPort = (+PORT + workerId).toString();
		startServer(workerPort, () => {
			console.log(`Worker ${process.pid} started on port ${workerPort}`);
		});
	} else {
		console.error('Worker ID is undefined');
	}
}

import express from 'express';
import fabricRoutes from './routes/fabric.routes';

const app = express();

// parse JSON bodies
app.use(express.json());

// mount the Fabric CRUD routes
app.use('/api/fabrics', fabricRoutes);

// simple healthcheck
app.get('/health', (_req, res) => res.send({ status: 'ok' }));

export { app }; 
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger.js';

const router = express.Router();

// Interface do Swagger (documentação visual)
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
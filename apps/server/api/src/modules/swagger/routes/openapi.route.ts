import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from '@shared/config/swagger.config';

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);


/**
 * OpenAPI Route
 * Defines HTTP endpoints for OpenAPI documentation
 */

const router = Router();

// Setup Swagger UI endpoint
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

// Serve Swagger specification as JSON
router.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export { router as openapiRoutes };
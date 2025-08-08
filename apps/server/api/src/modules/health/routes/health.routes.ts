import { Router } from 'express';
import { HealthController, HealthControllerFactory } from '../controllers/health.controller';

/**
 * Health Routes
 * Defines HTTP endpoints for health check functionality
 * Follows RESTful API conventions
 */

const router = Router();

// Create health controller instance
const healthController = HealthControllerFactory.create();

/**
 * @route   GET /health
 * @desc    Perform comprehensive health check
 * @access  Public
 * @query   includeMetrics - Include system metrics in response
 * @query   timeout - Health check timeout in milliseconds
 * @query   checks - Specific health checks to perform
 */
router.get('/', healthController.handle());

/**
 * @route   GET /health/status
 * @desc    Get current system status (quick check)
 * @access  Public
 */
router.get('/status', (req, res, next) => {
  req.query.action = 'status';
  healthController.handle()(req, res, next);
});

/**
 * @route   GET /health/metrics
 * @desc    Get system metrics
 * @access  Public
 */
router.get('/metrics', (req, res, next) => {
  req.query.action = 'metrics';
  healthController.handle()(req, res, next);
});

/**
 * @route   GET /health/history
 * @desc    Get health check history
 * @access  Public
 * @query   startDate - Start date for history (ISO string)
 * @query   endDate - End date for history (ISO string)
 * @query   checkName - Specific health check name to filter
 */
router.get('/history', (req, res, next) => {
  req.query.action = 'history';
  healthController.handle()(req, res, next);
});

/**
 * @route   GET /health/live
 * @desc    Liveness probe endpoint (for Kubernetes)
 * @access  Public
 * @returns Simple 200 OK if service is alive
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'alive',
      timestamp: new Date().toISOString()
    },
    message: 'Service is alive',
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1'
    }
  });
});

/**
 * @route   GET /health/ready
 * @desc    Readiness probe endpoint (for Kubernetes)
 * @access  Public
 * @returns 200 OK if service is ready to accept traffic
 */
router.get('/ready', async (req, res, next) => {
  try {
    // Perform a quick health check to determine readiness
    const result = await healthController['healthService'].performHealthCheck({
      includeMetrics: false,
      timeout: 1000,
      checks: ['database', 'memory']
    });

    if (result.status === 'healthy') {
      res.status(200).json({
        success: true,
        data: {
          status: 'ready',
          timestamp: new Date().toISOString()
        },
        message: 'Service is ready',
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1'
        }
      });
    } else {
      res.status(503).json({
        success: false,
        data: {
          status: 'not-ready',
          timestamp: new Date().toISOString()
        },
        message: 'Service is not ready',
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1'
        }
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      data: {
        status: 'not-ready',
        timestamp: new Date().toISOString()
      },
      message: 'Service is not ready',
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    });
  }
});

/**
 * @route   GET /health/detailed
 * @desc    Get detailed health information with all checks and metrics
 * @access  Public
 */
router.get('/detailed', (req, res, next) => {
  req.query.includeMetrics = 'true';
  healthController.handle()(req, res, next);
});

/**
 * @route   GET /health/simple
 * @desc    Get simple health status (minimal information)
 * @access  Public
 */
router.get('/simple', (req, res, next) => {
  req.query.includeMetrics = 'false';
  healthController.handle()(req, res, next);
});

export { router as healthRoutes }; 
import { Router } from 'express';
import {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from '../controllers/attributeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/attributes:
 *   get:
 *     summary: Get all attributes
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllAttributes);

/**
 * @swagger
 * /api/attributes/{id}:
 *   get:
 *     summary: Get attribute by ID
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getAttributeById);

/**
 * @swagger
 * /api/attributes:
 *   post:
 *     summary: Create new attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', createAttribute);

/**
 * @swagger
 * /api/attributes/{id}:
 *   put:
 *     summary: Update attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', updateAttribute);

/**
 * @swagger
 * /api/attributes/{id}:
 *   delete:
 *     summary: Delete attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', deleteAttribute);

export default router;

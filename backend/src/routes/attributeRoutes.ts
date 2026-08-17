import { Router } from 'express';
import {
  getAllAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from '../controllers/attributeController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

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
router.post('/', authorize(UserRole.ADMIN, UserRole.MODERATOR), createAttribute);

/**
 * @swagger
 * /api/attributes/{id}:
 *   put:
 *     summary: Update attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize(UserRole.ADMIN, UserRole.MODERATOR), updateAttribute);

/**
 * @swagger
 * /api/attributes/{id}:
 *   delete:
 *     summary: Delete attribute
 *     tags: [Attributes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteAttribute);

export default router;

import { Router } from 'express';
import {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../controllers/variantController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/variants:
 *   get:
 *     summary: Get all variants
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllVariants);

/**
 * @swagger
 * /api/variants/{id}:
 *   get:
 *     summary: Get variant by ID
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getVariantById);

/**
 * @swagger
 * /api/variants:
 *   post:
 *     summary: Create new variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize(UserRole.ADMIN, UserRole.MODERATOR), createVariant);

/**
 * @swagger
 * /api/variants/{id}:
 *   put:
 *     summary: Update variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize(UserRole.ADMIN, UserRole.MODERATOR), updateVariant);

/**
 * @swagger
 * /api/variants/{id}:
 *   delete:
 *     summary: Delete variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteVariant);

export default router;

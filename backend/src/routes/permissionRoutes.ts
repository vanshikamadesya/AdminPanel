import { Router } from 'express';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from '../controllers/permissionController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllPermissions);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getPermissionById);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize(UserRole.ADMIN), createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize(UserRole.ADMIN), updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authorize(UserRole.ADMIN), deletePermission);

export default router;

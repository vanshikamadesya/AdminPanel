import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize(UserRole.ADMIN), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize(UserRole.ADMIN), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authorize(UserRole.ADMIN), deleteRole);

export default router;

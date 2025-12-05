import express from 'express';
import * as ResourceTypeController from '../controllers/resourceType.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/resource-types:
 *   get:
 *     summary: Get all resource types
 *     tags: [ResourceType]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resource types
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/resource-types',
  authenticate,
  authorizeRoles('ADMIN'),
  ResourceTypeController.getAllResourceTypes
);

/**
 * @openapi
 * /api/resource-types/{resource_id}:
 *   get:
 *     summary: Get resource type by ID
 *     tags: [ResourceType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resource type details
 *       404:
 *         description: Resource type not found
 */
router.get(
  '/resource-types/:resource_id',
  authenticate,
  authorizeRoles('ADMIN'),
  ResourceTypeController.getResourceTypeById
);

/**
 * @openapi
 * /api/resource-types:
 *   post:
 *     summary: Create a new resource type
 *     tags: [ResourceType]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource_name
 *             properties:
 *               resource_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource type created
 *       400:
 *         description: Invalid input
 */
router.post(
  '/resource-types',
  authenticate,
  authorizeRoles('ADMIN'),
  ResourceTypeController.createResourceType
);

/**
 * @openapi
 * /api/resource-types/{resource_id}:
 *   put:
 *     summary: Update resource type
 *     tags: [ResourceType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resource_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource type updated
 */
router.put(
  '/resource-types/:resource_id',
  authenticate,
  authorizeRoles('ADMIN'),
  ResourceTypeController.updateResourceType
);

/**
 * @openapi
 * /api/resource-types/{resource_id}:
 *   delete:
 *     summary: Delete resource type
 *     tags: [ResourceType]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Resource type deleted
 */
router.delete(
  '/resource-types/:resource_id',
  authenticate,
  authorizeRoles('ADMIN'),
  ResourceTypeController.deleteResourceType
);

export default router;

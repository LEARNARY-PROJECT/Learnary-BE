import express from 'express';
import * as PermissionOnResourceController from '../controllers/permissionOnResource.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/permission-resources:
 *   get:
 *     summary: Get all permission-resource assignments
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get(
  '/permission-resources',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.getAllPermissionOnResources
);

/**
 * @openapi
 * /api/permission-resources/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment details
 */
router.get(
  '/permission-resources/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.getPermissionOnResourceById
);

/**
 * @openapi
 * /api/permission-resources/permission/{permissionId}:
 *   get:
 *     summary: Get all resources assigned to a permission
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of resources
 */
router.get(
  '/permission-resources/permission/:permissionId',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.getResourcesByPermissionId
);

/**
 * @openapi
 * /api/permission-resources/resource/{resourceTypeId}:
 *   get:
 *     summary: Get all permissions assigned to a resource
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get(
  '/permission-resources/resource/:resourceTypeId',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.getPermissionsByResourceId
);

/**
 * @openapi
 * /api/permission-resources:
 *   post:
 *     summary: Assign a resource to a permission
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *               - resourceTypeId
 *             properties:
 *               permissionId:
 *                 type: string
 *               resourceTypeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post(
  '/permission-resources',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.createPermissionOnResource
);

/**
 * @openapi
 * /api/permission-resources/assign-to-permission:
 *   post:
 *     summary: Bulk assign resources to a permission (replaces existing)
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *               - resourceTypeIds
 *             properties:
 *               permissionId:
 *                 type: string
 *               resourceTypeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Resources assigned to permission
 */
router.post(
  '/permission-resources/assign-to-permission',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.assignResourcesToPermission
);

/**
 * @openapi
 * /api/permission-resources/assign-to-resource:
 *   post:
 *     summary: Bulk assign permissions to a resource (replaces existing)
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceTypeId
 *               - permissionIds
 *             properties:
 *               resourceTypeId:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions assigned to resource
 */
router.post(
  '/permission-resources/assign-to-resource',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.assignPermissionsToResource
);

/**
 * @openapi
 * /api/permission-resources/unassign:
 *   delete:
 *     summary: Remove specific resource from permission
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *               - resourceTypeId
 *             properties:
 *               permissionId:
 *                 type: string
 *               resourceTypeId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Assignment deleted
 */
router.delete(
  '/permission-resources/unassign',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.deleteByPermissionAndResource
);

/**
 * @openapi
 * /api/permission-resources/{id}:
 *   delete:
 *     summary: Delete assignment by ID
 *     tags: [PermissionOnResource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Assignment deleted
 */
router.delete(
  '/permission-resources/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  PermissionOnResourceController.deletePermissionOnResource
);

export default router;

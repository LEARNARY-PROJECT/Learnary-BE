import express from 'express';
import * as GroupController from '../controllers/group.controller';
import { authenticate, authorizeRoles, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Group]
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get(
  '/groups',
  GroupController.getAllGroups
);

/**
 * @openapi
 * /api/groups/type/{type}:
 *   get:
 *     summary: Get groups by type (Combo or Group)
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Combo, Group]
 *     responses:
 *       200:
 *         description: List of groups by type
 */
router.get(
  '/groups/type/:type',
  optionalAuthenticate,
  GroupController.getGroupsByType
);

/**
 * @openapi
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 */
router.get(
  '/groups/:id',
  GroupController.getGroupById
);

/**
 * @openapi
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - discount
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Combo, Group]
 *               discount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Group created
 */
router.post(
  '/groups',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  GroupController.createGroup
);

/**
 * @openapi
 * /api/groups/{id}:
 *   put:
 *     summary: Update group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Combo, Group]
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Group updated
 */
router.put(
  '/groups/:id',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  GroupController.updateGroup
);

/**
 * @openapi
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete group
 *     tags: [Group]
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
 *         description: Group deleted
 */
router.delete(
  '/groups/:id',
  authenticate,
  authorizeRoles('ADMIN','INSTRUCTOR'),
  GroupController.deleteGroup
);

export default router;

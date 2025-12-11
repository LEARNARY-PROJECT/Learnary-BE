import express from "express";
import { FavoriteController } from "../controllers/favorite.controller";

const router = express.Router();

/**
 * @openapi
 * /api/favorites/add:
 *   post:
 *     summary: Add a course to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to favorites successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/favorites/add', FavoriteController.addFavorite);

/**
 * @openapi
 * /api/favorites/remove:
 *   delete:
 *     summary: Remove a course from favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Removed from favorites successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.delete('/favorites/remove', FavoriteController.removeFavorite);

/**
 * @openapi
 * /api/favorites/{userId}:
 *   get:
 *     summary: Get all favorite courses of a user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of favorite courses
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.get('/favorites/:userId', FavoriteController.getFavorites);

/**
 * @openapi
 * /api/favorites/check/{userId}/{courseId}:
 *   get:
 *     summary: Check if a course is in user's favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check result
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.get('/favorites/check/:userId/:courseId', FavoriteController.checkFavorite);

export default router;

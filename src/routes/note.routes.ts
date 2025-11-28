import express from "express";
import { authenticate, authorizeRoles, optionalAuthenticate } from "../middlewares/auth.middleware";
import { create, getAll, getById, update, remove,getMyNotesGrouped,getMyNotesByLesson,getMyNotes } from "../controllers/note.controller";

const router = express.Router();

/**
 * @openapi
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/notes/create", authenticate, optionalAuthenticate, create);

/**
 * @openapi
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 *       401:
 *         description: Unauthorized
 */
router.get("/notes", authenticate, optionalAuthenticate, getAll);

/**
 * @openapi
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Note]
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
 *         description: Note found
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.get("/notes/:id", authenticate, optionalAuthenticate, getById);

/**
 * @openapi
 * /api/notes/{id}:
 *   put:
 *     summary: Update note by ID
 *     tags: [Note]
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
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.put("/notes/:id", authenticate, optionalAuthenticate, update);

/**
 * @openapi
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete note by ID
 *     tags: [Note]
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
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/notes/:id", authenticate, optionalAuthenticate, remove);
/**
 * @openapi
 * /api/notes/my-notes:
 *   get:
 *     summary: Get all notes of current user
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's notes
 *       401:
 *         description: Unauthorized
 */
router.get("/notes/my-notes", authenticate, getMyNotes);

/**
 * @openapi
 * /api/notes/my-notes/lesson/{lesson_id}:
 *   get:
 *     summary: Get all notes of current user for a specific lesson
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lesson_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's notes for the lesson
 *       401:
 *         description: Unauthorized
 */
router.get("/notes/my-notes/lesson/:lesson_id", authenticate, getMyNotesByLesson);

/**
 * @openapi
 * /api/notes/my-notes/grouped:
 *   get:
 *     summary: Get all notes of current user grouped by lesson
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's notes grouped by lesson
 *       401:
 *         description: Unauthorized
 */
router.get("/notes/my-notes/grouped", authenticate, getMyNotesGrouped);

export default router;

import express from 'express';
import {
    createBank,
    getAllBank,
    getUserBankAccount,
    updateBankInformation,
    deleteBank,
    getBankAccountByInstructorId,
    updateBankAccountByInstructorId
} from '../controllers/bankAccount.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/bank-accounts:
 *   post:
 *     summary: Create a new bank account
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bank_name
 *               - account_number
 *               - account_holder_name
 *               - instructor_id
 *             properties:
 *               bank_name:
 *                 type: string
 *                 example: "Vietcombank"
 *               account_number:
 *                 type: string
 *                 example: "0123456789"
 *               account_holder_name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               instructor_id:
 *                 type: string
 *                 example: "instr-001"
 *     responses:
 *       201:
 *         description: Bank account created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/bank-accounts', authenticate, authorizeRoles('INSTRUCTOR'), createBank);

/**
 * @openapi
 * /api/bank-accounts:
 *   get:
 *     summary: Get all bank accounts
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bank accounts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/bank-accounts', authenticate, authorizeRoles('ADMIN'), getAllBank);

/**
 * @openapi
 * /api/bank-accounts/{bank_id}:
 *   get:
 *     summary: Get bank account by ID
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bank_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     responses:
 *       200:
 *         description: Bank account details
 *       404:
 *         description: Bank account not found
 *       401:
 *         description: Unauthorized
 */
router.get('/bank-accounts/:bank_id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), getUserBankAccount);

/**
 * @openapi
 * /api/bank-accounts/{bank_id}:
 *   patch:
 *     summary: Update bank account information
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bank_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bank_name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               account_holder_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank account updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bank account not found
 */
router.patch('/bank-accounts/:bank_id', authenticate, authorizeRoles('INSTRUCTOR'), updateBankInformation);

/**
 * @openapi
 * /api/bank-accounts/{bank_id}:
 *   delete:
 *     summary: Delete bank account
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bank_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     responses:
 *       200:
 *         description: Bank account deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bank account not found
 */
router.delete('/bank-accounts/:bank_id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), deleteBank);

/**
 * @openapi
 * /api/bank-account/{instructor_id}:
 *   get:
 *     summary: Get bank account by instructor ID
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instructor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Bank account details
 *       404:
 *         description: Bank account not found
 *       401:
 *         description: Unauthorized
 */
router.get('/bank-account/:instructor_id', authenticate, authorizeRoles('INSTRUCTOR', 'ADMIN'), getBankAccountByInstructorId);

/**
 * @openapi
 * /api/bank-account/{instructor_id}:
 *   patch:
 *     summary: Update bank account by instructor ID
 *     tags: [BankAccount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instructor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bank_name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               account_holder_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank account updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bank account not found
 */
router.patch('/bank-account/:instructor_id', authenticate, authorizeRoles('INSTRUCTOR'), updateBankAccountByInstructorId);

export default router;

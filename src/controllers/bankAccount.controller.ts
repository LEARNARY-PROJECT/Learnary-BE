import { RequestHandler} from 'express'
import {
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getAllBankAccount,
    getBankById,
    getBankByInstructorId,
    updateBankByInstructorId
} from '../services/bankAccount.service'
import { BankAccount } from '../generated/prisma'

type updateBankData = Omit<BankAccount,"bank_id"| "instructor_id" | "created_at" | "updated_at">
export const createBank: RequestHandler = async (req, res) => {
    try {
        const { bank_name, account_number, account_holder_name, instructor_id } = req.body;
        if (!bank_name || !account_number || !account_holder_name || !instructor_id) {
            res.status(400).json({ error: 'Missing required fields: bank_name, account_number, account_holder_name, instructor_id' 
            });
            return;
        }
        const newBankAccount = await createBankAccount({
            bank_name,
            account_holder_name,
            account_number,
            instructor_id,
        });
        
        res.status(201).json({
            message: 'Bank account created successfully',
            data: newBankAccount
        });
    } catch (error) {
        const e = error as Error;
        console.error("Failed to create bank account:", e);
        res.status(500).json({ 
            error: 'Failed to create bank account',
            details: e.message 
        });
    }
};
export const getAllBank: RequestHandler = async (req,res) => {
    try {
        const bankAccounts = await getAllBankAccount();
        res.status(200).json(bankAccounts)
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch bank account.'});
        throw new Error('Error while fetching bank accounts!');
    }
}
export const updateBankInformation: RequestHandler = async (req, res) => {
    const bank_id = req.params.bank_id;
    const data: Partial<updateBankData> = req.body;
    
    if (!bank_id) {
        res.status(400).json({ error: "Missing bank_id in params!" });
        return;
    }
    
    if (!data || Object.keys(data).length === 0) {
        res.status(400).json({ error: "No data provided for update!" });
        return;
    }
    
    try {
        const updatedInformation = await updateBankAccount(bank_id, data);
        res.status(200).json({
            message: 'Bank account updated successfully',
            data: updatedInformation
        });
    } catch (error) {
        const e = error as Error;
        console.error("Update bank information error:", e);
        res.status(500).json({ 
            error: 'Failed to update bank information.',
            details: e.message
        });
    }
};
export const deleteBank: RequestHandler = async (req, res) => {
    const bank_id = req.params.bank_id;
    
    if (!bank_id) {
        res.status(400).json({ error: "Missing bank_id in params" });
        return;
    }
    
    try {
        await deleteBankAccount(bank_id);
        res.status(200).json({ 
            message: "Bank account deleted successfully!" 
        });
    } catch (error) {
        const e = error as Error;
        console.error("Delete bank error:", e);
        res.status(500).json({ 
            error: 'Failed to delete bank account.',
            details: e.message
        });
    }
};
export const getUserBankAccount: RequestHandler = async (req, res) => {
    const bank_id = req.params.bank_id;
    
    if (!bank_id) {
        res.status(400).json({ error: "Missing bank_id in params" });
        return;
    }
    
    try {
        const neededBank = await getBankById(bank_id);
        
        if (!neededBank) {
            res.status(404).json({ error: "Bank account not found" });
            return;
        }
        
        res.status(200).json({
            message: "Bank account retrieved successfully",
            data: neededBank
        });
    } catch (error) {
        const e = error as Error;
        console.error("Get bank account error:", e);
        res.status(500).json({ 
            error: 'Failed to get bank account.',
            details: e.message
        });
    }
};

export const getBankAccountByInstructorId: RequestHandler = async (req, res) => {
    const instructor_id = req.params.instructor_id;
    
    if (!instructor_id) {
        res.status(400).json({ error: "Missing instructor_id in params" });
        return;
    }
    
    try {
        const bankAccount = await getBankByInstructorId(instructor_id);
        
        if (!bankAccount) {
            res.status(404).json({ error: "Bank account not found for this instructor" });
            return;
        }
        
        res.status(200).json({
            message: "Bank account retrieved successfully",
            data: bankAccount
        });
    } catch (error) {
        const e = error as Error;
        console.error("Get bank account by instructor error:", e);
        res.status(500).json({ 
            error: 'Failed to get bank account.',
            details: e.message
        });
    }
};

export const updateBankAccountByInstructorId: RequestHandler = async (req, res) => {
    const instructor_id = req.params.instructor_id;
    const data: Partial<updateBankData> = req.body;
    
    if (!instructor_id) {
        res.status(400).json({ error: "Missing instructor_id in params!" });
        return;
    }
    
    if (!data || Object.keys(data).length === 0) {
        res.status(400).json({ error: "No data provided for update!" });
        return;
    }
    
    try {
        const updatedBank = await updateBankByInstructorId(instructor_id, data);
        res.status(200).json({
            message: 'Bank account updated successfully',
            data: updatedBank
        });
    } catch (error) {
        const e = error as Error;
        console.error("Update bank by instructor error:", e);
        res.status(500).json({ 
            error: 'Failed to update bank information.',
            details: e.message
        });
    }
}; 
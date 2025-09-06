import { Request, Response } from "express";
import * as WalletService from "../services/wallet.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const wallet = await WalletService.createWallet(req.body);
    res.status(201).json(success(wallet, "Wallet created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create wallet", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const wallet = await WalletService.getWalletById(req.params.id);
    if (!wallet) {
      res.status(404).json(failure("Wallet not found"));
      return;
    }
    res.json(success(wallet, "Wallet fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch wallet", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const wallets = await WalletService.getAllWallets();
    res.json(success(wallets, "All wallets fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch wallets", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await WalletService.updateWallet(req.params.id, req.body);
    res.json(success(updated, "Wallet updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update wallet", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await WalletService.deleteWallet(req.params.id);
    res.json(success(null, "Wallet deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete wallet", err.message));
  }
};

import { Request, Response } from "express";
import * as NoteService from "../services/note.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const note = await NoteService.createNote(req.body);
    res.status(201).json(success(note, "Note created successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to create note", err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const note = await NoteService.getNoteById(req.params.id);
    if (!note) {
      res.status(404).json(failure("Note not found"));
      return;
    }
    res.json(success(note, "Note fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch note", err.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const notes = await NoteService.getAllNotes();
    res.json(success(notes, "All notes fetched successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to fetch notes", err.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await NoteService.updateNote(req.params.id, req.body);
    res.json(success(updated, "Note updated successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to update note", err.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await NoteService.deleteNote(req.params.id);
    res.json(success(null, "Note deleted successfully"));
  } catch (err: any) {
    res.status(500).json(failure("Failed to delete note", err.message));
  }
};

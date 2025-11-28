import { Request, Response } from "express";
import * as NoteService from "../services/note.service";
import { success, failure } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const note = await NoteService.createNote(req.body);
    res.status(201).json(success(note, "Note created successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to create note", e.message));
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
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch note", e.message));
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const notes = await NoteService.getAllNotes();
    res.json(success(notes, "All notes fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch notes", e.message));
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const updated = await NoteService.updateNote(req.params.id, req.body);
    res.json(success(updated, "Note updated successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to update note", e.message));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await NoteService.deleteNote(req.params.id);
    res.json(success(null, "Note deleted successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to delete note", e.message));
  }
};

// Lấy tất cả notes của user hiện tại
export const getMyNotes = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    
    if (!user_id) {
      res.status(401).json(failure("Unauthorized"));
      return;
    }

    const notes = await NoteService.getNotesByUserId(user_id);
    res.json(success(notes, "User notes fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch user notes", e.message));
  }
};

// Lấy notes của user theo lesson_id
export const getMyNotesByLesson = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    const { lesson_id } = req.params;
    
    if (!user_id) {
      res.status(401).json(failure("Unauthorized"));
      return;
    }

    const notes = await NoteService.getNotesByUserAndLesson(user_id, lesson_id);
    res.json(success(notes, "User notes for lesson fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch user notes for lesson", e.message));
  }
};

// Lấy notes của user, nhóm theo lesson
export const getMyNotesGrouped = async (req: Request, res: Response) => {
  try {
    const user_id = req.jwtPayload?.id;
    
    if (!user_id) {
      res.status(401).json(failure("Unauthorized"));
      return;
    }

    const notes = await NoteService.getNotesByUserGroupedByLesson(user_id);
    
    // Group notes by lesson
    const groupedNotes = notes.reduce((acc: any, note) => {
      const lessonId = note.lesson_id;
      if (!acc[lessonId]) {
        acc[lessonId] = {
          lesson: note.belongLesson,
          notes: []
        };
      }
      acc[lessonId].notes.push(note);
      return acc;
    }, {});

    res.json(success(groupedNotes, "User notes grouped by lesson fetched successfully"));
  } catch (err) {
    const e = err as Error;
    res.status(500).json(failure("Failed to fetch grouped notes", e.message));
  }
};

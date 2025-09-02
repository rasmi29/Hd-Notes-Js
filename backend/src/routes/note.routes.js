import { Router } from "express";
import isLoggedIn from "../middleware/isLogin.middleware.js";
import { getAllNotes, getNote, deleteNote, createNote } from "../controllers/note.controller.js";
import { noteValidator } from "../validators/validator.js";
import validate from "../middleware/validator.middleware.js";

const router = Router();

//create note
router.post("/create", isLoggedIn, noteValidator(), validate, createNote);

//get all notes 
router.get("/all", isLoggedIn, getAllNotes);

//get a single note by ID
router.get("/:noteId", isLoggedIn, getNote);

//delete a note by ID
router.delete("/:noteId", isLoggedIn, deleteNote);

export default router;
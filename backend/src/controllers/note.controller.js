import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import Note from "../models/Note.model.js";

//get all notes of a user
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("title content createdAt updatedAt");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        count: notes.length,
      },
      "notes fetched successfully"
    )
  );
});

//create note
const createNote = asyncHandler(async (req, res) => {
  //fetch data
  const { title, content } = req.body;
  //create note
  const note = await Note.create({ title, content, userId: req.user._id });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
      },
      "Note created successfully"
    )
  );
});

// delete note
const deleteNote = asyncHandler(async (req, res) => {
  //fetch note id
  const { noteId } = req.params;
  //fetch note from database
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  //validate note
  if (!note) {
    throw new ApiError(404, "Note not found or unauthorized");
  }
  //delete note
  await Note.findByIdAndDelete(noteId);
  //send response
  res.status(200).json(new ApiResponse(200, "Note deleted successfully"));
});

//get note by id
const getNote = asyncHandler(async (req, res) => {
  //fetch note id
  const { noteId } = req.params;
  //fetch note from database
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  //validate note
  if (!note) {
    throw new ApiError(404, "Note not found or unauthorized");
  }
  //send response
  res.status(200).json(new ApiResponse(200,note, "Note fetched successfully"));
});

export { getAllNotes, createNote, deleteNote, getNote };

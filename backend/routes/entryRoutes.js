import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createEntry,deleteEntry,updateEntry,getEntry } from "../controller/entryController.js";

const router = express.Router();

// Create a new entry
router.post("/create-entry", verifyUser, createEntry);

// Get all entries
router.get("/get-entry", verifyUser, getEntry);

// Update an entry by ID
router.put("/update-entry/:id", verifyUser, updateEntry);

// Delete an entry by ID
router.delete("/delete-entry/:id", verifyUser, deleteEntry);

export default router;

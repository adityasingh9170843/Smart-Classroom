import { Router } from "express";
import Timetable from "../models/Timetable.js";
import { generateTimetableWithAI, optimizeTimetableWithAI } from "../utils/timetableGenerator.js";

export const timetablesRouter = Router();

// Get all timetables
timetablesRouter.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.json(timetables);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    res.status(500).json({ error: "Failed to fetch timetables" });
  }
});

// Get timetable by ID
timetablesRouter.get("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });
    res.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

// Create new timetable
timetablesRouter.post("/", async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    console.error("Error creating timetable:", error);
    res.status(500).json({ error: "Failed to create timetable" });
  }
});

// Update timetable
timetablesRouter.put("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });
    res.json(timetable);
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ error: "Failed to update timetable" });
  }
});

// Delete timetable
timetablesRouter.delete("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).json({ error: "Failed to delete timetable" });
  }
});

// Generate timetable using AI
timetablesRouter.post("/generate", async (req, res) => {
  try {
    const createdTimetable = await generateTimetableWithAI(req.body);
    res.json(createdTimetable);
  } catch (error) {
    console.error("Error generating timetable:", error);
    res.status(500).json({ error: "Failed to generate timetable" });
  }
});

// Optimize timetable using AI
timetablesRouter.post("/:id/optimize", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ error: "Timetable not found" });

    const optimizedTimetable = await optimizeTimetableWithAI(timetable);
    res.json(optimizedTimetable);
  } catch (error) {
    console.error("Error optimizing timetable:", error);
    res.status(500).json({ error: "Failed to optimize timetable" });
  }
});

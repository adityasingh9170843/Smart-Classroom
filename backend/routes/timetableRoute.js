import { Router } from "express"
import { db } from "../database"
import { optimizeTimetableWithAI, generateTimetableWithAI } from "../utils/timetableGenerator"
export const timetablesRouter = Router()


timetablesRouter.get("/", async (req, res) => {
  try {
    const timetables = await db.getTimetables()
    res.json(timetables)
  } catch (error) {
    console.error("Error fetching timetables:", error)
    res.status(500).json({ error: "Failed to fetch timetables" })
  }
})


timetablesRouter.get("/:id", async (req, res) => {
  try {
    const timetable = await db.getTimetable(req.params.id)
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" })
    }
    res.json(timetable)
  } catch (error) {
    console.error("Error fetching timetable:", error)
    res.status(500).json({ error: "Failed to fetch timetable" })
  }
})


timetablesRouter.post("/", async (req, res) => {
  try {
    const timetable = await db.createTimetable(req.body)
    res.status(201).json(timetable)
  } catch (error) {
    console.error("Error creating timetable:", error)
    res.status(500).json({ error: "Failed to create timetable" })
  }
})


timetablesRouter.put("/:id", async (req, res) => {
  try {
    const timetable = await db.updateTimetable(req.params.id, req.body)
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" })
    }
    res.json(timetable)
  } catch (error) {
    console.error("Error updating timetable:", error)
    res.status(500).json({ error: "Failed to update timetable" })
  }
})


timetablesRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.deleteTimetable(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: "Timetable not found" })
    }
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting timetable:", error)
    res.status(500).json({ error: "Failed to delete timetable" })
  }
})


timetablesRouter.post("/generate", async (req, res) => {
  try {
    const result = await generateTimetableWithAI(req.body)
    res.json(result)
  } catch (error) {
    console.error("Error generating timetable:", error)
    res.status(500).json({ error: "Failed to generate timetable" })
  }
})


timetablesRouter.post("/:id/optimize", async (req, res) => {
  try {
    const timetable = await db.getTimetable(req.params.id)
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" })
    }

    const result = await optimizeTimetableWithAI(timetable)
    res.json(result)
  } catch (error) {
    console.error("Error optimizing timetable:", error)
    res.status(500).json({ error: "Failed to optimize timetable" })
  }
})

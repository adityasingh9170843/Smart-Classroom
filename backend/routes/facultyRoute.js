import { Router } from "express";
import Faculty from "../models/Faculty";

export const facultyRouter = Router();


facultyRouter.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find(); 
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
});


facultyRouter.get("/:id", async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).json({ error: "Faculty member not found" });
    }
    res.json(facultyMember);
  } catch (error) {
    console.error("Error fetching faculty member:", error);
    res.status(500).json({ error: "Failed to fetch faculty member" });
  }
});


facultyRouter.post("/", async (req, res) => {
  try {
    const facultyMember = new Faculty(req.body);
    await facultyMember.save(); 
    res.status(201).json(facultyMember);
  } catch (error) {
    console.error("Error creating faculty member:", error);
    res.status(500).json({ error: "Failed to create faculty member" });
  }
});


facultyRouter.put("/:id", async (req, res) => {
  try {
    const facultyMember = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });
    if (!facultyMember) {
      return res.status(404).json({ error: "Faculty member not found" });
    }
    res.json(facultyMember);
  } catch (error) {
    console.error("Error updating faculty member:", error);
    res.status(500).json({ error: "Failed to update faculty member" });
  }
});


facultyRouter.delete("/:id", async (req, res) => {
  try {
    const facultyMember = await Faculty.findByIdAndDelete(req.params.id);
    if (!facultyMember) {
      return res.status(404).json({ error: "Faculty member not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting faculty member:", error);
    res.status(500).json({ error: "Failed to delete faculty member" });
  }
});

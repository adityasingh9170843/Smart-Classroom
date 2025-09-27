import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true },
    duration: { type: Number, required: true },
    type: {
      type: String,
      enum: ["lecture", "lab", "seminar", "tutorial"],
      required: true,
    },
    capacity: { type: Number, required: true },
    requirements: {
      roomType: { type: String, required: true },
      equipment: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

export default Course;

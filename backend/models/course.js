import mongoose from "mongoose"
const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    description: { type: String },
    prerequisites: [{ type: String }],
  },
  { timestamps: true }
)

const Course = mongoose.model("Course", CourseSchema)

export default Course
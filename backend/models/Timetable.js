import mongoose from "mongoose";

const ScheduleEntrySchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    facultyId: { type: String, required: true },
    roomId: { type: String, required: true },
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const TimetableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: Number, required: true },
    department: { type: String, required: true },
    schedule: [ScheduleEntrySchema],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    conflicts: [
      {
        type: { type: String, required: true },
        message: { type: String, required: true },
        entries: [{ type: String }],
      },
    ],
    metadata: {
      totalHours: { type: Number, default: 0 },
      utilizationRate: { type: Number, default: 0 },
      conflictCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", TimetableSchema);
export default Timetable;

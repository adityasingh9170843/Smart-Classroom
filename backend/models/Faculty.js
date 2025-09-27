import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false } 
);

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    specialization: [{ type: String }],
    availability: {
      monday: [TimeSlotSchema],
      tuesday: [TimeSlotSchema],
      wednesday: [TimeSlotSchema],
      thursday: [TimeSlotSchema],
      friday: [TimeSlotSchema],
      saturday: [TimeSlotSchema],
      sunday: [TimeSlotSchema],
    },
    maxHoursPerWeek: { type: Number, required: true },
    preferences: {
      preferredTimeSlots: [{ type: String }],
      avoidTimeSlots: [{ type: String }],
    },
  },
  {
    timestamps: true, 
  }
);

const Faculty = mongoose.model("Faculty", FacultySchema);

export default Faculty;

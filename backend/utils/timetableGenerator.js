// backend/controllers/timetableGenerator.js
import { GoogleGenAI } from "@google/genai";
import Course from '../models/course.js';
import Faculty from '../models/Faculty.js';
import Room from '../models/Room.js';
import Timetable from '../models/Timetable.js';
import Notification from '../models/Notification.js';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

// Initialize AI client
let genAI;
try {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set in environment variables.');
  }
  genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  console.log('Google AI (Gemini) initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google AI:', error.message);
}

// --- Configuration ---
const WEEKS = 13;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:15', end: '12:15' },
  { start: '14:15', end: '15:15' },
  { start: '15:15', end: '16:15' },
  { start: '16:30', end: '17:30' },
];
const BREAK_SLOT = { start: '12:15', end: '13:15' };

/**
 * Calculates the number of weekly 1-hour sessions a course requires.
 */
function getWeeklySessions(course) {
  if (course.totalHours && Number(course.totalHours) > 0) {
    return Math.ceil(Number(course.totalHours) / WEEKS);
  }
  return Number(course.hoursPerWeek) || 3;
}

/**
 * Cleans and parses the JSON response from the AI.
 */
function parseAIResponse(text) {
  if (!text || typeof text !== 'string') return [];
  const clean = text.replace(/```(?:json)?\n?/gi, '').replace(/```\n?/g, '');
  try {
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse AI JSON response:', e);
    return [];
  }
}

/**
 * Generates a timetable using only the Gemini AI.
 * request: { department, semester, academicYear }
 */
export async function generateTimetableWithAI(request) {
  console.log('=== STARTING AI TIMETABLE GENERATION ===');
  console.log('Request:', request);

  if (!genAI) {
    throw new Error('AI client is not initialized. Check GOOGLE_API_KEY.');
  }

  try {
    const { department, semester, academicYear } = request;
    if (!department || !semester || !academicYear) {
      throw new Error('Department, semester, and academic year are required.');
    }

    // 1. Fetch all necessary data from the database
    console.log('Fetching DB data...');
    const allCourses = await Course.find({});
    const allFaculty = await Faculty.find({});
    const allRooms = await Room.find({});

    // Filter data for the specific request
    const relevantCourses = allCourses.filter(c =>
      (c.department || '').toLowerCase() === department.toLowerCase() &&
      Number(c.semester) === Number(semester)
    );

    if (relevantCourses.length === 0) {
      throw new Error(`No courses found for ${department}, Semester ${semester}. Please check your database.`);
    }

    const relevantFaculty = allFaculty.filter(f => (f.department || '').toLowerCase() === department.toLowerCase());

    // 2. Engineer the detailed prompt for Gemini
     const prompt = `
      You are an expert university timetable scheduler. Your task is to generate a complete, conflict-free weekly timetable.

      **Input Data:**
      - Department: "${department}"
      - Semester: ${semester}
      - Available Days: ${JSON.stringify(DAYS)}
      - Available Time Slots: ${JSON.stringify(TIME_SLOTS)}
      - Mandatory Daily Break (DO NOT schedule classes here): ${BREAK_SLOT.start}-${BREAK_SLOT.end}

      - Courses to Schedule (with required weekly hours):
        ${relevantCourses.map(c => `- Course Name: "${c.name}", ID: "${c._id}", Weekly Sessions: ${getWeeklySessions(c)}`).join('\n        ')}

      - Available Faculty (with their IDs and Specializations):
        ${relevantFaculty.map(f => `- Faculty Name: "${f.name}", ID: "${f._id}", Specializations: ${JSON.stringify(f.specialization || [])}`).join('\n        ')}

      - Available Rooms (with their IDs):
        ${allRooms.map(r => `- Room Name: "${r.name}", ID: "${r._id}"`).join('\n        ')}

      **Strict Rules You Must Follow:**
      1.  **Match Specializations:** You MUST assign a faculty member to a course ONLY if the course name or subject matter aligns with one of their listed specializations. This is a critical requirement.
      2.  **Assign One Faculty Per Course:** Each course must be assigned to exactly ONE faculty member for all its weekly sessions.
      3.  **Schedule All Sessions:** Ensure every course is scheduled for its required number of weekly sessions.
      4.  **No Conflicts:** A faculty member or a room cannot be in two places at once. Each time slot for a specific resource can only be used once.
      5.  **Use Provided IDs:** You MUST use the exact 'courseId', 'facultyId', and 'roomId' strings provided in the data above.
      6.  **Strictly Adhere to Format:** Return ONLY a valid JSON array of schedule entry objects. Do not include any other text, markdown, or explanations.

      **Output JSON Object Structure:**
      {
        "courseId": "string",
        "facultyId": "string",
        "roomId": "string",
        "day": "string (e.g., 'Monday')",
        "startTime": "string (e.g., '09:00')",
        "endTime": "string (e.g., '10:00')"
      }

      Generate the full timetable now.
    `;

    // 3. Call the Gemini API with the corrected model name
    console.log('Sending request to Gemini AI...');
    
    // ===== FIXED CODE =====
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    
    // Extract the text from the response correctly
    const responseText = result.text;
    
    // If the above doesn't work, try this alternative approach:
    // const responseText = result.candidates[0].content.parts[0].text;
    
    console.log('AI Response received:', responseText ? 'Success' : 'Empty response');
    
    const schedule = parseAIResponse(responseText);

    if (schedule.length === 0) {
      console.error("AI Response Text:", responseText);
      throw new Error('AI failed to generate a valid schedule. The response was empty or invalid JSON.');
    }
    console.log(`AI generated ${schedule.length} schedule entries.`);

    // 4. Enrich and Save the Timetable
    const enrichedSchedule = schedule.map(entry => {
      const course = relevantCourses.find(c => String(c._id) === entry.courseId);
      const faculty = relevantFaculty.find(f => String(f._id) === entry.facultyId);
      const room = allRooms.find(r => String(r._id) === entry.roomId);
      return {
        ...entry,
        courseName: course ? course.name : 'Unknown',
        facultyName: faculty ? faculty.name : 'Unknown',
        roomName: room ? room.name : 'Unknown',
        timeSlot: `${entry.startTime}-${entry.endTime}`
      };
    });

    const totalHours = enrichedSchedule.length;
    const availableSlots = DAYS.length * TIME_SLOTS.length;
    const utilizationRate = Math.round((totalHours / availableSlots) * 100);

    const timetableData = {
      name: `${department} - Semester ${semester} ${academicYear}`,
      department,
      semester: String(semester),
      year: parseInt(academicYear),
      schedule: enrichedSchedule,
      conflicts: [], // AI is expected to return a conflict-free schedule
      status: 'draft',
      metadata: {
        totalHours,
        utilizationRate,
        conflictCount: 0
      }
    };

    const timetable = new Timetable(timetableData);
    const created = await timetable.save();
    console.log(`Timetable saved successfully! ID: ${created._id}`);

    // Create a success notification
    await new Notification({
      title: 'AI Timetable Generated',
      message: `Generated timetable "${created.name}" with ${totalHours} entries.`,
      type: 'success',
    }).save();

    return created;

  } catch (err) {
    console.error('Error in generateTimetableWithAI:', err);
    // Create an error notification
    await new Notification({
      title: 'Timetable Generation Failed',
      message: err.message || 'An unknown error occurred.',
      type: 'error',
    }).save();
    throw err; // Re-throw the error to be caught by the route handler
  }
}
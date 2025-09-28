

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Pencil,
  Sparkles,
  ArrowLeft,
  Download,
  Share,
  Settings,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Clock,
  User,
  MapPin,
  Calendar as CalendarIconLucide,
  LayoutDashboard,
  BookOpen,
  Users as UsersIcon,
  Home as HomeIcon,
  Bell,
} from "lucide-react";

// Axios configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:15-12:15",
  "12:15-13:15",
  "14:15-15:15",
  "15:15-16:15",
  "16:30-17:30",
];

// TimetableGrid Component (kept functionality identical)
function TimetableGrid({ timetable, courses, faculty, rooms }) {
  const getEntry = (day, slot) => {
    if (!timetable || !timetable.schedule) return null;
    return (
      timetable.schedule.find(
        (e) =>
          e.day.toLowerCase() === day.toLowerCase() &&
          `${e.startTime}-${e.endTime}` === slot
      ) || null
    );
  };

  const findCourse = (id) => courses.find((c) => c._id === id) || null;
  const findFaculty = (id) => faculty.find((f) => f._id === id) || null;
  const findRoom = (id) => rooms.find((r) => r._id === id) || null;

  const typeColor = (t) => {
    switch (t) {
      case "lecture":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "lab":
        return "bg-green-100 text-green-800 border-green-200";
      case "tutorial":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "exam":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{timetable.name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {timetable.department} • Semester {timetable.semester} • {timetable.year}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant={timetable.status === "published" ? "default" : "secondary"}>
              {timetable.status}
            </Badge>
            {timetable.conflicts && timetable.conflicts.length > 0 && (
              <Badge variant="destructive">{timetable.conflicts.length} conflicts</Badge>
            )}
            <Badge variant="outline">
              {timetable.metadata?.utilizationRate || 0}% utilized
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[900px]">
            <div className="font-semibold text-center p-2 bg-muted rounded">Time</div>
            {DAYS.map((d) => (
              <div key={d} className="font-semibold text-center p-2 bg-muted rounded">
                {d}
              </div>
            ))}

            {TIME_SLOTS.map((slot) => (
              <div key={slot} className="contents">
                <div className="text-sm text-center p-2 bg-muted/50 rounded flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {slot}
                </div>

                {DAYS.map((day) => {
                  const entry = getEntry(day, slot);
                  if (!entry) {
                    return (
                      <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                        <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200" />
                      </div>
                    );
                  }

                  const course = findCourse(entry.courseId);
                  const prof = findFaculty(entry.facultyId);
                  const room = findRoom(entry.roomId);

                  return (
                    <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                      <div className={`p-2 rounded-lg border text-xs h-full ${typeColor(entry.type || "lecture")}`}>
                        <div className="font-semibold leading-tight mb-1 line-clamp-2">
                          {course ? `${course.name} (${course.code})` : entry.courseId}
                        </div>
                        <div className="space-y-1 text-xs opacity-90">
                          <div className="flex items-center gap-1 truncate">
                            <User className="h-3 w-3" />
                            <span className="truncate">{prof ? prof.name : entry.facultyId}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{room ? room.name : entry.roomId}</span>
                          </div>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {course.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts area */}
        {timetable.conflicts && timetable.conflicts.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflicts Detected
            </h4>
            {timetable.conflicts.map((c, i) => (
              <div key={i} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-destructive">{(c.type || "CONFLICT").replace('_', ' ')}</span>
                  <Badge variant="destructive" className="text-xs">High</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Component (functionality left intact; layout/styling updated to include sidebar)
export default function TimetablePage() {
  const [timetables, setTimetables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  // sidebar state
  const [activeNavItem, setActiveNavItem] = useState("timetables");

  // Form state for generation
  const [form, setForm] = useState({
    department: "Computer Science",
    semester: "5",
    academicYear: new Date().getFullYear(),
    constraintsText: "",
  });

  useEffect(() => {
    fetchTimetables();
    fetchSupportingData();
  }, []);

  // API Functions using Axios (kept unchanged)
  async function fetchTimetables() {
    setLoadingList(true);
    setError(null);
    try {
      const response = await api.get('/timetables');
      const data = response.data;
      setTimetables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching timetables:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to load timetables";
      setError(`Failed to load timetables: ${errorMessage}. Please check your backend connection.`);
      setTimetables([]);
    } finally {
      setLoadingList(false);
    }
  }

  async function fetchSupportingData() {
    try {
      const [coursesRes, facultyRes, roomsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/faculty'),
        api.get('/rooms')
      ]);
      console.log(coursesRes.data, facultyRes.data, roomsRes.data);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : []);
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);

    } catch (err) {
      console.error("Error fetching supporting data:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to load courses, faculty, or rooms data: ${errorMessage}`);
    }
  }

  async function viewTimetable(id) {
    setLoadingDetail(true);
    setSelected(null);
    setError(null);
    try {
      const response = await api.get(`/timetables/${id}`);
      setSelected(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      if (err.response?.status === 404) {
        setError("Timetable not found.");
      } else {
        setError(`Failed to load timetable details: ${errorMessage}`);
      }
    } finally {
      setLoadingDetail(false);
    }
  }

  async function generateTimetable(e) {
    e.preventDefault();
    if (!form.department || !form.semester) {
      setError("Please fill in department and semester");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Parse constraints
      let constraints = {};
      if (form.constraintsText.trim()) {
        try {
          constraints = JSON.parse(form.constraintsText);
        } catch {
          constraints = { notes: form.constraintsText };
        }
      }

      const payload = {
        department: form.department,
        semester: parseInt(form.semester),
        academicYear: parseInt(form.academicYear),
        constraints,
      };

      const response = await api.post('/timetables/generate', payload);
      const newTimetable = response.data;
      console.log(newTimetable);

      // Refresh the timetables list
      await fetchTimetables();

      // Select the new timetable if it has an ID
      if (newTimetable._id) {
        await viewTimetable(newTimetable._id);
      }

      setError(null);
      alert("Timetable generated successfully!");

    } catch (err) {
      console.error("Error generating timetable:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to generate timetable: ${errorMessage}`);
    } finally {
      setGenerating(false);
    }
  }

  async function optimizeSelected() {
    if (!selected) return;

    setOptimizing(true);
    setError(null);

    try {
      const response = await api.post(`/timetables/${selected._id}/optimize`);
      const result = response.data;

      // Refresh the timetable details
      await viewTimetable(selected._id);

      if (result.suggestions && result.suggestions.length > 0) {
        alert("Optimization complete!\n\nSuggestions:\n• " + result.suggestions.join("\n• "));
      } else {
        alert("Optimization completed successfully!");
      }

    } catch (err) {
      console.error("Error optimizing timetable:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      setError(`Optimization failed: ${errorMessage}`);
    } finally {
      setOptimizing(false);
    }
  }

  async function togglePublish(timetable) {
    setError(null);
    try {
      const newStatus = timetable.status === "published" ? "draft" : "published";
      const updatedData = { ...timetable, status: newStatus };

      const response = await api.put(`/timetables/${timetable._id}`, updatedData);

      // Refresh data
      await fetchTimetables();
      if (selected && selected._id === timetable._id) {
        await viewTimetable(timetable._id);
      }

    } catch (err) {
      console.error("Error updating timetable:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to change timetable status: ${errorMessage}`);
    }
  }

  async function deleteTimetable(timetable) {
    if (!confirm(`Delete timetable "${timetable.name}"? This cannot be undone.`)) return;

    setError(null);
    try {
      await api.delete(`/timetables/${timetable._id}`);

      // Refresh data
      await fetchTimetables();
      if (selected && selected._id === timetable._id) {
        setSelected(null);
      }

      alert("Timetable deleted successfully");

    } catch (err) {
      console.error("Error deleting timetable:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      if (err.response?.status === 404) {
        setError("Timetable not found.");
      } else {
        setError(`Failed to delete timetable: ${errorMessage}`);
      }
    }
  }

  // Export functionality
  function exportTimetable() {
    if (!selected) return;

    const dataStr = JSON.stringify(selected, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selected.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: UsersIcon, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: HomeIcon, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: CalendarIconLucide, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg relative">
        <div className="p-6 space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <CalendarIconLucide className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Scheduler</h2>
                <p className="text-xs text-slate-500">Smart Classroom</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNavItem === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveNavItem(item.id)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-700"
                      } group-hover:scale-110`}
                    />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? "text-white" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Timetable Generator</h1>
                <p className="text-slate-600 mt-2">Generate, optimize and manage academic timetables with AI assistance</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Generation Form */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate New Timetable
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">AI Powered</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={generateTimetable} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                        <Input
                          value={form.department}
                          onChange={(e) => setForm({...form, department: e.target.value})}
                          placeholder="e.g., Computer Science"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
                        <Select value={form.semester} onValueChange={(value) => setForm({...form, semester: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6,7,8].map(sem => (
                              <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Academic Year</label>
                        <Input
                          type="number"
                          value={form.academicYear}
                          onChange={(e) => setForm({...form, academicYear: e.target.value})}
                          min="2020"
                          max="2030"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Constraints (Optional JSON or Notes)</label>
                      <Textarea
                        value={form.constraintsText}
                        onChange={(e) => setForm({...form, constraintsText: e.target.value})}
                        placeholder='e.g., {"avoidFriday": true} or "No classes after 4 PM"'
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                        disabled={generating}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "Generate Timetable"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setForm({ department: "Computer Science", semester: "5", academicYear: new Date().getFullYear(), constraintsText: "" })}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Timetable List */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Existing Timetables ({timetables.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingList ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p>Loading timetables...</p>
                    </div>
                  ) : timetables.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No timetables found. Generate your first timetable above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timetables.map((t) => (
                        <div key={t._id} className="flex items-center justify-between gap-3 p-4 rounded-lg bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">{t.name}</div>
                            <div className="text-sm text-slate-600">{t.department} • Semester {t.semester} • {t.year}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={t.status === "published" ? "default" : "secondary"}>{t.status}</Badge>
                              <Badge variant="outline" className="text-xs">{t.metadata?.totalHours || 0} hours</Badge>
                              {t.conflicts && t.conflicts.length > 0 && (
                                <Badge variant="destructive" className="text-xs">{t.conflicts.length} conflicts</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => viewTimetable(t._id)}>View</Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => togglePublish(t)}
                            >
                              {t.status === "published" ? "Unpublish" : "Publish"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteTimetable(t)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Detail View */}
            <div className="w-[720px] max-w-full space-y-4">
              {loadingDetail ? (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading timetable details...</p>
                  </CardContent>
                </Card>
              ) : !selected ? (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Timetable Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <div className="text-slate-500">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No Timetable Selected</p>
                      <p className="text-sm">Select a timetable from the list to view details, grid, and management options.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Header with actions */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-800">{selected.name}</h2>
                            <Badge variant={selected.status === "published" ? "default" : "secondary"}>{selected.status}</Badge>
                          </div>
                          <div className="text-slate-600 space-y-1">
                            <div className="flex items-center gap-4">
                              <span>{selected.department} • Semester {selected.semester} • {selected.year}</span>
                            </div>
                            <div className="text-sm">Created: {new Date(selected.createdAt).toLocaleDateString()} • Updated: {new Date(selected.updatedAt).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={exportTimetable}><Download className="h-4 w-4 mr-1" /> Export</Button>
                            <Button variant="outline" size="sm" onClick={() => alert("Share link: " + window.location.href + "?tt=" + selected._id)}><Share className="h-4 w-4 mr-1" /> Share</Button>
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                            size="sm" 
                            onClick={optimizeSelected} 
                            disabled={optimizing}
                          >
                            <Sparkles className="h-4 w-4 mr-1" /> 
                            {optimizing ? "Optimizing..." : "AI Optimize"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-700">{selected.metadata?.totalHours || 0}</div>
                        <div className="text-sm text-blue-600">Total Hours</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">{selected.metadata?.utilizationRate || 0}%</div>
                        <div className="text-sm text-green-600">Utilization</div>
                      </CardContent>
                    </Card>
                    <Card className={`bg-gradient-to-br ${selected.conflicts?.length > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-emerald-50 to-emerald-100 border-emerald-200'}`}>
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${selected.conflicts?.length > 0 ? 'text-red-700' : 'text-emerald-700'}`}>{selected.conflicts?.length || 0}</div>
                        <div className={`text-sm ${selected.conflicts?.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Conflicts</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Timetable Grid */}
                  <TimetableGrid timetable={selected} courses={courses} faculty={faculty} rooms={rooms} />

                  {/* Quick Actions */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          className="w-full"
                          variant={selected.status === "published" ? "secondary" : "default"}
                          onClick={() => togglePublish(selected)}
                        >
                          {selected.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => deleteTimetable(selected)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>

                      {selected.conflicts && selected.conflicts.length > 0 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-800">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Attention Required</span>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">This timetable has {selected.conflicts.length} conflict{selected.conflicts.length !== 1 ? 's' : ''} that need resolution.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Course Summary */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Course Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selected.schedule && (() => {
                          // Group by course
                          const courseGroups = {};
                          selected.schedule.forEach(entry => {
                            if (!courseGroups[entry.courseId]) {
                              courseGroups[entry.courseId] = [];
                            }
                            courseGroups[entry.courseId].push(entry);
                          });

                          return Object.entries(courseGroups).map(([courseId, entries]) => {
                            const course = courses.find(c => c._id === courseId);
                            const sessionsCount = entries.length;
                            const types = [...new Set(entries.map(e => e.type))];

                            return (
                              <div key={courseId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                  <div className="font-medium">{course ? `${course.name} (${course.code})` : courseId}</div>
                                  <div className="text-sm text-slate-600">{sessionsCount} session{sessionsCount !== 1 ? 's' : ''} • {types.join(', ')}</div>
                                </div>
                                <div className="flex gap-1">
                                  {types.map(type => (
                                    <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Loading states overlays (kept identical) */}
          {generating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-96 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Generating Timetable</h3>
                  <p className="text-slate-600">AI is creating an optimized schedule...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {optimizing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-96 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Optimizing Timetable</h3>
                  <p className="text-slate-600">AI is analyzing and improving your schedule...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Calendar icon component for the empty state (renamed to avoid conflict with lucide import)
function CalendarIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

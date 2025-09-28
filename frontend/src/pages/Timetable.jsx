import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  Sparkles,
  Download,
  Share,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar as CalendarIconLucide,
  LayoutDashboard,
  BookOpen,
  Users as UsersIcon,
  Home as HomeIcon,
  Bell,
} from "lucide-react"

// Axios configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:15-12:15",
  "12:15-13:15",
  "14:15-15:15",
  "15:15-16:15",
  "16:30-17:30",
]

function TimetableGrid({ timetable, courses, faculty, rooms }) {
  const getEntry = (day, slot) => {
    if (!timetable || !timetable.schedule) return null
    return (
      timetable.schedule.find(
        (e) => e.day.toLowerCase() === day.toLowerCase() && `${e.startTime}-${e.endTime}` === slot,
      ) || null
    )
  }

  const findCourse = (id) => courses.find((c) => c._id === id) || null
  const findFaculty = (id) => faculty.find((f) => f._id === id) || null
  const findRoom = (id) => rooms.find((r) => r._id === id) || null

  const typeColor = (t) => {
    switch (t) {
      case "lecture":
        return "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-200 border border-cyan-500/30"
      case "lab":
        return "bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-200 border border-emerald-500/30"
      case "tutorial":
        return "bg-gradient-to-br from-purple-500/20 to-violet-600/20 text-purple-200 border border-purple-500/30"
      case "exam":
        return "bg-gradient-to-br from-red-500/20 to-rose-600/20 text-red-200 border border-red-500/30"
      default:
        return "bg-gradient-to-br from-slate-600/20 to-gray-700/20 text-slate-200 border border-slate-500/30"
    }
  }

  return (
    <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
      <CardHeader className="border-b border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-cyan-100">{timetable.name}</CardTitle>
            <div className="text-sm text-slate-400">
              {timetable.department} • Semester {timetable.semester} • {timetable.year}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              className={
                timetable.status === "published"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                  : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
              }
            >
              {timetable.status}
            </Badge>
            {timetable.conflicts && timetable.conflicts.length > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0">
                {timetable.conflicts.length} conflicts
              </Badge>
            )}
            <Badge className="bg-slate-700/50 text-slate-300 border border-slate-600/50">
              {timetable.metadata?.utilizationRate || 0}% utilized
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-3 min-w-[900px]">
            <div className="font-semibold text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-xl text-cyan-200 border border-slate-600/50">
              Time
            </div>
            {DAYS.map((d) => (
              <div
                key={d}
                className="font-semibold text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-xl text-cyan-200 border border-slate-600/50"
              >
                {d}
              </div>
            ))}

            {TIME_SLOTS.map((slot) => (
              <div key={slot} className="contents">
                <div className="text-sm text-center p-3 bg-slate-800/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 border border-slate-700/50">
                  <Clock className="h-3 w-3 mr-1" />
                  {slot}
                </div>

                {DAYS.map((day) => {
                  const entry = getEntry(day, slot)
                  if (!entry) {
                    return (
                      <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                        <div className="h-full bg-slate-800/20 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300" />
                      </div>
                    )
                  }

                  const course = findCourse(entry.courseId)
                  const prof = findFaculty(entry.facultyId)
                  const room = findRoom(entry.roomId)

                  return (
                    <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                      <div
                        className={`p-3 rounded-xl text-xs h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm ${typeColor(
                          course?.type || "lecture",
                        )}`}
                      >
                        <div className="font-semibold leading-tight mb-2 line-clamp-2 text-base">
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
                            <Badge variant="outline" className="text-xs px-1 py-0  text-white backdrop-blur-sm">
                              {course?.type || entry.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {timetable.conflicts && timetable.conflicts.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflicts Detected
            </h4>
            {timetable.conflicts.map((c, i) => (
              <div key={i} className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-red-400">{(c.type || "CONFLICT").replace("_", " ")}</span>
                  <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 text-xs">High</Badge>
                </div>
                <p className="text-sm text-red-300">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TimetablePage() {
  const [timetables, setTimetables] = useState([])
  const [selected, setSelected] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)
  const [activeNavItem, setActiveNavItem] = useState("timetables")
  const [form, setForm] = useState({
    department: "Computer Science",
    semester: "5",
    academicYear: new Date().getFullYear(),
    constraintsText: "",
  })

  useEffect(() => {
    fetchTimetables()
    fetchSupportingData()
  }, [])

  // All async data fetching and handler functions remain the same...
  async function fetchTimetables() {
    setLoadingList(true)
    setError(null)
    try {
      const response = await api.get("/timetables")
      const data = response.data
      setTimetables(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching timetables:", err)
      const errorMessage = err.response?.data?.error || err.message || "Failed to load timetables"
      setError(`Failed to load timetables: ${errorMessage}. Please check your backend connection.`)
      setTimetables([])
    } finally {
      setLoadingList(false)
    }
  }

  async function fetchSupportingData() {
    try {
      const [coursesRes, facultyRes, roomsRes] = await Promise.all([
        api.get("/courses"),
        api.get("/faculty"),
        api.get("/rooms"),
      ])
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : [])
      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : [])
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : [])
    } catch (err) {
      console.error("Error fetching supporting data:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(`Failed to load courses, faculty, or rooms data: ${errorMessage}`)
    }
  }

  async function viewTimetable(id) {
    setLoadingDetail(true)
    setSelected(null)
    setError(null)
    try {
      const response = await api.get(`/timetables/${id}`)
      setSelected(response.data)
    } catch (err) {
      console.error("Error fetching timetable:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      if (err.response?.status === 404) {
        setError("Timetable not found.")
      } else {
        setError(`Failed to load timetable details: ${errorMessage}`)
      }
    } finally {
      setLoadingDetail(false)
    }
  }

  async function generateTimetable(e) {
    e.preventDefault()
    if (!form.department || !form.semester) {
      setError("Please fill in department and semester")
      return
    }
    setGenerating(true)
    setError(null)
    try {
      let constraints = {}
      if (form.constraintsText.trim()) {
        try {
          constraints = JSON.parse(form.constraintsText)
        } catch {
          constraints = { notes: form.constraintsText }
        }
      }
      const payload = {
        department: form.department,
        semester: Number.parseInt(form.semester),
        academicYear: Number.parseInt(form.academicYear),
        constraints,
      }
      const response = await api.post("/timetables/generate", payload)
      const newTimetable = response.data
      await fetchTimetables()
      if (newTimetable._id) {
        await viewTimetable(newTimetable._id)
      }
      setError(null)
      alert("Timetable generated successfully!")
    } catch (err) {
      console.error("Error generating timetable:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(`Failed to generate timetable: ${errorMessage}`)
    } finally {
      setGenerating(false)
    }
  }

  async function optimizeSelected() {
    if (!selected) return
    setOptimizing(true)
    setError(null)
    try {
      const response = await api.post(`/timetables/${selected._id}/optimize`)
      const result = response.data
      await viewTimetable(selected._id)
      if (result.suggestions && result.suggestions.length > 0) {
        alert("Optimization complete!\n\nSuggestions:\n• " + result.suggestions.join("\n• "))
      } else {
        alert("Optimization completed successfully!")
      }
    } catch (err) {
      console.error("Error optimizing timetable:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(`Optimization failed: ${errorMessage}`)
    } finally {
      setOptimizing(false)
    }
  }

  async function togglePublish(timetable) {
    setError(null)
    try {
      const newStatus = timetable.status === "published" ? "draft" : "published"
      const updatedData = { ...timetable, status: newStatus }
      await api.put(`/timetables/${timetable._id}`, updatedData)
      await fetchTimetables()
      if (selected && selected._id === timetable._id) {
        await viewTimetable(timetable._id)
      }
    } catch (err) {
      console.error("Error updating timetable:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(`Failed to change timetable status: ${errorMessage}`)
    }
  }

  async function deleteTimetable(timetable) {
    if (!confirm(`Delete timetable "${timetable.name}"? This cannot be undone.`)) return
    setError(null)
    try {
      await api.delete(`/timetables/${timetable._id}`)
      await fetchTimetables()
      if (selected && selected._id === timetable._id) {
        setSelected(null)
      }
      alert("Timetable deleted successfully")
    } catch (err) {
      console.error("Error deleting timetable:", err)
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      if (err.response?.status === 404) {
        setError("Timetable not found.")
      } else {
        setError(`Failed to delete timetable: ${errorMessage}`)
      }
    }
  }

  function exportTimetable() {
    if (!selected) return
    const dataStr = JSON.stringify(selected, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${selected.name.replace(/\s+/g, "_")}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: UsersIcon, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: HomeIcon, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: CalendarIconLucide, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <aside className="relative z-10 w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <CalendarIconLucide className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-100">Scheduler</h2>
              <p className="text-xs text-slate-400">Smart Classroom</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNavItem === item.id
              return (
                <Link key={item.id} to={item.path} onClick={() => setActiveNavItem(item.id)}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-100 shadow-lg shadow-cyan-600/20 border border-cyan-500/30 backdrop-blur-sm"
                        : "text-slate-300 hover:bg-slate-700/30 hover:text-cyan-200 backdrop-blur-sm border border-transparent hover:border-slate-600/30"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"
                      } group-hover:scale-110`}
                    />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? "text-cyan-100" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 relative z-10 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                  Timetable Generator
                </h1>
                <p className="text-cyan-200 text-lg">
                  Generate, optimize and manage academic timetables with AI assistance
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
                <CardHeader className="">
                  <div className="flex items-center text-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sparkles className="h-5 w-5  text-cyan-300" />
                      Generate New Timetable
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg">
                      AI Powered
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={generateTimetable} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Department</label>
                        <Input
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          placeholder="e.g., Computer Science"
                          required
                          className="bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Semester</label>
                        <Select value={form.semester} onValueChange={(value) => setForm({ ...form, semester: value })}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 text-slate-200">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()} className="hover:bg-slate-700/50 focus:bg-slate-700/50">
                                {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">Academic Year</label>
                        <Input
                          type="number"
                          value={form.academicYear}
                          onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                          min="2020"
                          max="2030"
                          className="bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cyan-200 mb-2">
                        Constraints (Optional JSON or Notes)
                      </label>
                      <Textarea
                        value={form.constraintsText}
                        onChange={(e) => setForm({ ...form, constraintsText: e.target.value })}
                        placeholder='e.g., {"avoidFriday": true} or "No classes after 4 PM"'
                        rows={3}
                        className="bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 hover:shadow-xl hover:shadow-cyan-600/30 transition-all duration-300 hover:scale-105 border border-cyan-500/30 backdrop-blur-sm"
                        disabled={generating}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "Generate Timetable"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setForm({
                            department: "Computer Science",
                            semester: "5",
                            academicYear: new Date().getFullYear(),
                            constraintsText: "",
                          })
                        }
                        className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm transition-all duration-300"
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
                <CardHeader className="border-b border-slate-700/50 p-6">
                  <CardTitle className="text-cyan-100">Existing Timetables ({timetables.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingList ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-cyan-200">Loading timetables...</p>
                    </div>
                  ) : timetables.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No timetables found. Generate your first timetable above!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timetables.map((t) => (
                        <div
                          key={t._id}
                          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/30"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-white">{t.name}</div>
                            <div className="text-sm text-slate-400">
                              {t.department} • Semester {t.semester} • {t.year}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={
                                  t.status === "published"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                                    : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                                }
                              >
                                {t.status}
                              </Badge>
                              <Badge className="bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs">
                                {t.metadata?.totalHours || 0} hours
                              </Badge>
                              {t.conflicts && t.conflicts.length > 0 && (
                                <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 text-xs">
                                  {t.conflicts.length} conflicts
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => viewTimetable(t._id)}
                              className="text-cyan-300 hover:text-white hover:bg-cyan-500/20"
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublish(t)}
                              className="bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50"
                            >
                              {t.status === "published" ? "Unpublish" : "Publish"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteTimetable(t)}
                              className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 border-0"
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

            <div className="w-[720px] max-w-full space-y-4">
              {loadingDetail ? (
                <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                  <CardContent className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-cyan-200">Loading timetable details...</p>
                  </CardContent>
                </Card>
              ) : !selected ? (
                <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-cyan-100">Timetable Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <div className="text-slate-500">
                      <CalendarIconLucide className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2 text-slate-300">No Timetable Selected</p>
                      <p className="text-sm">
                        Select a timetable from the list to view details, grid, and management options.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <TimetableGrid timetable={selected} courses={courses} faculty={faculty} rooms={rooms} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  Plus,
} from "lucide-react"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptors remain the same
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
  (response) => response,
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

// TimetableGrid Component (Redesigned for Light Theme)
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
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "lab":
        return "bg-green-100 text-green-800 border-green-200"
      case "tutorial":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "exam":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
      <CardHeader className="p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">{timetable.name}</CardTitle>
            <div className="text-sm text-slate-600">
              {timetable.department} • Semester {timetable.semester} • {timetable.year}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              variant={timetable.status === "published" ? "default" : "secondary"}
              className={
                timetable.status === "published"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }
            >
              {timetable.status}
            </Badge>
            {timetable.conflicts && timetable.conflicts.length > 0 && (
              <Badge variant="destructive">{timetable.conflicts.length} conflicts</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-2 min-w-[900px]">
            <div className="font-semibold text-center p-2 bg-slate-100 rounded text-slate-700">Time</div>
            {DAYS.map((d) => (
              <div key={d} className="font-semibold text-center p-2 bg-slate-100 rounded text-slate-700">
                {d}
              </div>
            ))}

            {TIME_SLOTS.map((slot) => (
              <div key={slot} className="contents">
                <div className="text-sm text-center p-2 bg-slate-50 rounded flex items-center justify-center text-slate-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {slot}
                </div>

                {DAYS.map((day) => {
                  const entry = getEntry(day, slot)
                  if (!entry) {
                    return (
                      <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                        <div className="h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-200" />
                      </div>
                    )
                  }

                  const course = findCourse(entry.courseId)
                  const prof = findFaculty(entry.facultyId)
                  const room = findRoom(entry.roomId)

                  return (
                    <div key={`${day}-${slot}`} className="min-h-[80px] p-1">
                      <div className={`p-2 rounded-lg border text-xs h-full ${typeColor(course?.type || "lecture")}`}>
                        <div className="font-semibold leading-tight mb-1 line-clamp-2">
                          {course ? `${course.name} (${course.code})` : "Unknown Course"}
                        </div>
                        <div className="space-y-1 text-xs opacity-90">
                          <div className="flex items-center gap-1 truncate">
                            <User className="h-3 w-3" />
                            <span className="truncate">{prof ? prof.name : "Unknown Faculty"}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{room ? room.name : "Unknown Room"}</span>
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
            <h4 className="font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflicts Detected
            </h4>
            {timetable.conflicts.map((c, i) => (
              <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-800">{(c.type || "CONFLICT").replace("_", " ")}</div>
                <p className="text-sm text-slate-600">{c.message}</p>
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

  // All your async functions (fetchTimetables, generateTimetable, etc.) remain the same

  useEffect(() => {
    fetchTimetables()
    fetchSupportingData()
  }, [])

  async function fetchTimetables() {
    setLoadingList(true)
    setError(null)
    try {
      const response = await api.get("/timetables")
      setTimetables(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to load timetables"
      setError(`Failed to load timetables: ${errorMessage}. Check backend.`)
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
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(`Failed to load supporting data: ${errorMessage}`)
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
        const errorMessage = err.response?.data?.error || err.message || "Unknown error"
        setError(err.response?.status === 404 ? "Timetable not found." : `Failed to load details: ${errorMessage}`)
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
      await fetchTimetables()
      if (response.data?._id) {
        await viewTimetable(response.data._id)
      }
      alert("Timetable generated successfully!")
    } catch (err) {
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
      await viewTimetable(selected._id)
      const suggestions = response.data?.suggestions || []
      alert(suggestions.length > 0 ? `Optimization complete!\n\nSuggestions:\n• ${suggestions.join("\n• ")}` : "Optimization completed successfully!")
    } catch (err) {
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
        await api.put(`/timetables/${timetable._id}`, { ...timetable, status: newStatus })
        await fetchTimetables()
        if (selected?._id === timetable._id) {
            await viewTimetable(timetable._id)
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || "Unknown error"
        setError(`Failed to change status: ${errorMessage}`)
    }
  }

  async function deleteTimetable(timetable) {
    if (!confirm(`Delete timetable "${timetable.name}"? This is irreversible.`)) return
    setError(null)
    try {
      await api.delete(`/timetables/${timetable._id}`)
      await fetchTimetables()
      if (selected?._id === timetable._id) {
        setSelected(null)
      }
      alert("Timetable deleted successfully")
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Unknown error"
      setError(err.response?.status === 404 ? "Timetable not found." : `Failed to delete: ${errorMessage}`)
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <CalendarIconLucide className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Scheduler</h2>
              <p className="text-xs text-slate-500">Smart Classroom</p>
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
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                      } group-hover:scale-110`}
                    />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? "text-white" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">Timetables</h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Generate, optimize and manage academic timetables with AI assistance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportTimetable}
              disabled={!selected}
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
            >
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button
              onClick={optimizeSelected}
              disabled={!selected || optimizing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" /> {optimizing ? "Optimizing..." : "AI Optimize"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              <CardHeader className="border-b border-slate-200/50 p-6">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Generate New Timetable
                </CardTitle>
                <CardDescription>Provide details to generate a new schedule.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={generateTimetable} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-medium text-slate-700">Department</Label>
                      <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required className="mt-1"/>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-700">Semester</Label>
                      <Select value={form.semester} onValueChange={(value) => setForm({ ...form, semester: value })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (<SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>))}
                          </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-medium text-slate-700">Year</Label>
                      <Input type="number" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} min="2020" max="2030" className="mt-1"/>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium text-slate-700">Constraints (Optional)</Label>
                    <Textarea value={form.constraintsText} onChange={(e) => setForm({ ...form, constraintsText: e.target.value })} placeholder='e.g., {"avoidFriday": true}' rows={2} className="mt-1"/>
                  </div>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" disabled={generating}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {generating ? "Generating..." : "Generate"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              <CardHeader className="border-b border-slate-200/50 p-6">
                <CardTitle className="text-xl text-slate-800">Existing Timetables</CardTitle>
                <CardDescription>{timetables.length} schedules found</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loadingList ? <p>Loading...</p> : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {timetables.map((t) => (
                      <div key={t._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                        <div>
                          <p className="font-semibold text-slate-800">{t.name}</p>
                          <p className="text-sm text-slate-500">{t.department} • Sem {t.semester}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => viewTimetable(t._id)}>View</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteTimetable(t)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            {loadingDetail ? <p>Loading Details...</p> : !selected ? (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardContent className="text-center py-20">
                  <div className="text-slate-500">
                    <CalendarIconLucide className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Timetable Selected</p>
                    <p className="text-sm">Select a schedule from the list to see the full grid.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <TimetableGrid timetable={selected} courses={courses} faculty={faculty} rooms={rooms} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
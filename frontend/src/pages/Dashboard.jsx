

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, AlertTriangle, Plus, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [timetables, setTimetables] = useState([])
  const [notifications, setNotifications] = useState([])

   useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultyRes, roomsRes, timetablesRes, notificationsRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/courses"),
            axios.get("http://localhost:5000/api/faculty"),
            axios.get("http://localhost:5000/api/rooms"),
            axios.get("http://localhost:5000/api/timetables"),
            axios.get("http://localhost:5000/api/notifications"),
          ])

        setCourses(coursesRes.data)
        console.log("acbc",facultyRes.data)
        setFaculty(facultyRes.data)
        setRooms(roomsRes.data)
        setTimetables(timetablesRes.data)
        setNotifications(notificationsRes.data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 p-6 space-y-6">
          <div className="h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse w-64 rounded-lg backdrop-blur-sm border border-blue-500/20" />
          <div className="h-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse w-96 rounded-lg backdrop-blur-sm border border-blue-500/20" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse rounded-xl backdrop-blur-sm border border-slate-700/50 shadow-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = {
    totalCourses: courses.length,
    totalFaculty: faculty.length,
    totalRooms: rooms.length,
    totalTimetables: timetables.length,
    activeConflicts: timetables.reduce((acc, t) => acc + (t.conflicts?.length || 0), 0),
    completedSchedules: timetables.filter((t) => t.status === "published").length,
    utilizationRate: timetables.length
      ? Math.round((timetables.filter((t) => t.schedule?.length).length / timetables.length) * 100)
      : 0,
    pendingTasks: notifications.filter((n) => !n.isRead).length,
  }

  const recentTimetables = timetables.slice(0, 3)
  const recentNotifications = notifications.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-bounce" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-balance drop-shadow-2xl">
              Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome to your Smart Classroom Scheduler. Manage courses, faculty, and generate optimal timetables.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/timetables">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                <Calendar className="h-4 w-4 mr-2" />
                View Timetables
              </Button>
            </Link>
            <Link to="/timetables/generate">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-300 text-sm font-medium">Total Courses</h2>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {stats.totalCourses}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-300 text-sm font-medium">Total Faculty</h2>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stats.totalFaculty}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-300 text-sm font-medium">Total Rooms</h2>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {stats.totalRooms}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-300 text-sm font-medium">Total Timetables</h2>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {stats.totalTimetables}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-100 text-xl">Recent Timetables</CardTitle>
                    <CardDescription className="text-slate-400">Latest generated schedules</CardDescription>
                  </div>
                  <Link to="/timetables">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 backdrop-blur-sm"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {recentTimetables.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <Calendar className="h-16 w-16 text-slate-600 mx-auto" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-200">No Timetables Yet</h3>
                    <p className="text-slate-400 mb-6">Create your first timetable to get started.</p>
                    <Link to="/timetables/generate">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0">
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Timetable
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTimetables.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-200">{t.name}</h4>
                            <Badge
                              variant={t.status === "published" ? "default" : "secondary"}
                              className={
                                t.status === "published"
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0"
                                  : "bg-slate-700 text-slate-300 border-slate-600"
                              }
                            >
                              {t.status}
                            </Badge>
                            {t.conflicts?.length > 0 && (
                              <Badge
                                variant="destructive"
                                className="text-xs bg-gradient-to-r from-red-600 to-pink-600 text-white border-0"
                              >
                                {t.conflicts.length} conflicts
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">
                            {t.department} • Semester {t.semester} • {t.schedule?.length || 0} classes
                          </p>
                        </div>
                        <Link to={`/timetables/${t._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500"
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-slate-100">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link to="/courses">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-slate-800/30 to-slate-900/30 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </Link>
                <Link to="/faculty">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-slate-800/30 to-slate-900/30 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Faculty
                  </Button>
                </Link>
                <Link to="/rooms">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-slate-800/30 to-slate-900/30 border-slate-700/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </Link>
                <Link to="/timetables/generate">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Timetable
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-100">Notifications</CardTitle>
                    <CardDescription className="text-slate-400">Recent alerts</CardDescription>
                  </div>
                  <Link to="/notifications">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 backdrop-blur-sm"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {recentNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentNotifications.map((n) => (
                      <div
                        key={n._id}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div
                          className={`p-2 rounded-full backdrop-blur-sm ${
                            n.type === "error"
                              ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30"
                              : n.type === "warning"
                                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                                : n.type === "success"
                                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                                  : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                          }`}
                        >
                          {["error", "warning"].includes(n.type) ? (
                            <AlertTriangle
                              className={`h-4 w-4 ${n.type === "error" ? "text-red-400" : "text-yellow-400"}`}
                            />
                          ) : (
                            <TrendingUp
                              className={`h-4 w-4 ${n.type === "success" ? "text-green-400" : "text-blue-400"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 text-balance">{n.title}</p>
                          <p className="text-xs text-slate-400 text-pretty line-clamp-2 mt-1">{n.message}</p>
                        </div>
                        {!n.isRead && (
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex-shrink-0 mt-2 animate-pulse shadow-lg shadow-blue-400/50" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

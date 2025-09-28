"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  Plus,
  Sparkles,
  Users,
  BookOpen,
  Home,
  CheckCircle,
  Bell,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Chatbot } from "@/components/Chatbot"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [timetables, setTimetables] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activeNavItem, setActiveNavItem] = useState("dashboard")

  // --- State for Chatbot ---
  const [isChatOpen, setIsChatOpen] = useState(false)
  // -------------------------

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultyRes, roomsRes, timetablesRes, notificationsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/courses"),
          axios.get("http://localhost:5000/api/faculty"),
          axios.get("http://localhost:5000/api/rooms"),
          axios.get("http://localhost:5000/api/timetables"),
          axios.get("http://localhost:5000/api/notifications"),
        ])

        setCourses(coursesRes.data)
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

  // --- Loading State with enhanced animations ---
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Sidebar Loading */}
        <div className="w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl relative z-10">
          <div className="p-6 space-y-6">
            <div className="h-8 bg-slate-700/50 animate-pulse rounded-xl w-32" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-700/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Loading */}
        <div className="flex-1 p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-12 bg-slate-700/50 animate-pulse rounded-xl w-80" />
            <div className="h-6 bg-slate-700/30 animate-pulse rounded-lg w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-800/50 animate-pulse rounded-2xl shadow-sm" />
              ))}
            </div>
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

  // --- Prepare simplified context for the chatbot ---
  const chatContext = {
    timetables: timetables.map((tt) => ({
      name: tt.name,
      department: tt.department,
      semester: tt.semester,
      status: tt.status,
      schedule:
        tt.schedule?.map((s) => ({
          day: s.day,
          time: s.timeSlot,
          course: courses.find((c) => c._id === s.courseId)?.name,
          faculty: faculty.find((f) => f._id === s.facultyId)?.name,
          room: rooms.find((r) => r._id === s.roomId)?.name,
        })) || [],
    })),
    totalCourses: courses.length,
    totalFaculty: faculty.length,
  }
  // ----------------------------------------------------

  const recentTimetables = timetables.slice(0, 3)
  const recentNotifications = notifications.slice(0, 3)

  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Faculty",
      value: stats.totalFaculty,
      icon: Users,
      color: "from-emerald-400 to-teal-400",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Home,
      color: "from-violet-400 to-purple-400",
      bgColor: "from-violet-500/10 to-purple-500/10",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
      borderColor: "border-violet-500/20",
    },
    {
      title: "Total Timetables",
      value: stats.totalTimetables,
      icon: Calendar,
      color: "from-amber-400 to-orange-400",
      bgColor: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Active Conflicts",
      value: stats.activeConflicts,
      icon: AlertTriangle,
      color: "from-red-400 to-pink-400",
      bgColor: "from-red-500/10 to-pink-500/10",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      borderColor: "border-red-500/20",
    },
    {
      title: "Completed Schedules",
      value: stats.completedSchedules,
      icon: CheckCircle,
      color: "from-green-400 to-emerald-400",
      bgColor: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: Bell,
      color: "from-orange-400 to-red-400",
      bgColor: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-bounce delay-700"></div>
      </div>

      <div className="w-64 bg-slate-800/30 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl relative z-10">
        <div className="p-6 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
             
              <div>
                <h2 className="text-lg font-bold text-white">Smart Scheduler</h2>
                <p className="text-xs text-slate-400">Smart Classroom</p>
              </div>
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
                        ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg shadow-blue-500/10 border border-blue-500/30"
                        : "text-slate-300 hover:bg-slate-700/30 hover:text-white hover:border hover:border-slate-600/50"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"} group-hover:scale-110`}
                    />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? "text-white" : ""}`}>
                      {item.label}
                    </span>
                    {item.id === "notifications" && stats.pendingTasks > 0 && (
                      <div className="ml-auto">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                            isActive ? "bg-white/20 text-white" : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {stats.pendingTasks}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6"></div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Welcome to your Smart Classroom Scheduler. Manage courses, faculty, and generate optimal timetables with
                ease.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/timetables">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 px-6 py-3 border border-blue-400/30">
                  <Calendar className="h-5 w-5 mr-2" />
                  View Timetables
                </Button>
              </Link>
              <Link to="/timetables/generate">
                <Button
                  variant="outline"
                  className="border-slate-600/50 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-700/40 text-slate-200 hover:border-slate-500/50 shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate New
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className={`bg-slate-800/30 backdrop-blur-xl border ${stat.borderColor} shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:scale-105`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm border border-white/10`}>
                        <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                        <p
                          className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${stat.bgColor} opacity-60`} />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Card className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                <CardHeader className="border-b border-slate-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-white">Recent Timetables</CardTitle>
                      <CardDescription className="text-slate-400">
                        Latest generated schedules and their status
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600/50 bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 hover:border-slate-500/50 transition-all duration-300"
                    >
                      <Link to="/timetables">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {recentTimetables.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-slate-700/30 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
                        <Calendar className="h-12 w-12 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">No Timetables Yet</h3>
                      <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Create your first timetable to get started with scheduling your classes and resources.
                      </p>
                      <Link to="/timetables/generate">
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                          <Plus className="h-5 w-5 mr-2" />
                          Generate Timetable
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTimetables.map((t) => (
                        <div
                          key={t._id}
                          className="flex items-center justify-between p-5 bg-slate-700/20 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-white text-lg">{t.name}</h4>
                              <Badge
                                variant={t.status === "published" ? "default" : "secondary"}
                                className={
                                  t.status === "published"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-slate-600/30 text-slate-300 border-slate-500/30"
                                }
                              >
                                {t.status}
                              </Badge>
                              {t.conflicts?.length > 0 && (
                                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                                  {t.conflicts.length} conflicts
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">
                              {t.department} • Semester {t.semester} • {t.schedule?.length || 0} classes scheduled
                            </p>
                          </div>
                          <Link to={`/timetables/`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600/50 bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 hover:border-slate-500/50 transition-all duration-300"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                <CardHeader className="border-b border-slate-700/50 p-6">
                  <CardTitle className="text-xl font-semibold text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">Frequently used operations</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex flex-col">
                  <Link to="/courses">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-slate-700/20 hover:bg-blue-500/10 border-slate-600/50 text-slate-200 hover:border-blue-500/30 hover:text-blue-400 transition-all duration-300 h-12 backdrop-blur-sm"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Course
                    </Button>
                  </Link>
                  <Link to="/faculty">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-slate-700/20 hover:bg-emerald-500/10 border-slate-600/50 text-slate-200 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300 h-12 backdrop-blur-sm"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Faculty
                    </Button>
                  </Link>
                  <Link to="/rooms">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-slate-700/20 hover:bg-violet-500/10 border-slate-600/50 text-slate-200 hover:border-violet-500/30 hover:text-violet-400 transition-all duration-300 h-12 backdrop-blur-sm"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Room
                    </Button>
                  </Link>
                  <Link to="/timetables/generate">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 h-12">
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate Timetable
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                <CardHeader className="border-b border-slate-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-white">Notifications</CardTitle>
                      <CardDescription className="text-slate-400">Recent system alerts</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600/50 bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 hover:border-slate-500/50 transition-all duration-300"
                    >
                      <Link to="/notifications">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {recentNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentNotifications.map((n) => (
                        <div
                          key={n._id}
                          className="flex items-start gap-4 p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 transition-all duration-300 backdrop-blur-sm"
                        >
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              n.type === "error"
                                ? "bg-red-500/20 border border-red-500/30"
                                : n.type === "warning"
                                  ? "bg-amber-500/20 border border-amber-500/30"
                                  : n.type === "success"
                                    ? "bg-green-500/20 border border-green-500/30"
                                    : "bg-blue-500/20 border border-blue-500/30"
                            }`}
                          >
                            {["error", "warning"].includes(n.type) ? (
                              <AlertTriangle
                                className={`h-4 w-4 ${n.type === "error" ? "text-red-400" : "text-amber-400"}`}
                              />
                            ) : (
                              <TrendingUp
                                className={`h-4 w-4 ${n.type === "success" ? "text-green-400" : "text-blue-400"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white mb-1">{n.title}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2 animate-pulse" />
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

      <div className="fixed bottom-8 right-8 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 border border-blue-400/30 animate-pulse"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} context={chatContext} />
    </div>
  )
}

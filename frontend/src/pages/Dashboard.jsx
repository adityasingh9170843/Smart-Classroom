import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, AlertTriangle, Plus, Sparkles, Users, BookOpen, Home, CheckCircle, Clock, Target, Bell, LayoutDashboard, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"
import { Chatbot } from "@/components/Chatbot"; // Import the new Chatbot component

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [timetables, setTimetables] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activeNavItem, setActiveNavItem] = useState('dashboard')

  // --- State for Chatbot ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  // -------------------------

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, path: '/courses' },
    { id: 'faculty', label: 'Faculty', icon: Users, path: '/faculty' },
    { id: 'rooms', label: 'Rooms', icon: Home, path: '/rooms' },
    { id: 'timetables', label: 'Timetables', icon: Calendar, path: '/timetables' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  ]

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

  // --- Loading State (No Changes) ---
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Sidebar Loading */}
        <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg">
          <div className="p-6 space-y-6">
            <div className="h-8 bg-slate-200/50 animate-pulse rounded-xl w-32" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-200/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Loading */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-12 bg-slate-200/50 animate-pulse rounded-xl w-80" />
            <div className="h-6 bg-slate-200/30 animate-pulse rounded-lg w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-white/80 animate-pulse rounded-2xl shadow-sm" />
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
    timetables: timetables.map(tt => ({
        name: tt.name,
        department: tt.department,
        semester: tt.semester,
        status: tt.status,
        schedule: tt.schedule?.map(s => ({
            day: s.day,
            time: s.timeSlot,
            course: courses.find(c => c._id === s.courseId)?.name,
            faculty: faculty.find(f => f._id === s.facultyId)?.name,
            room: rooms.find(r => r._id === s.roomId)?.name,
        })) || []
    })),
    totalCourses: courses.length,
    totalFaculty: faculty.length,
  };
  // ----------------------------------------------------

  const recentTimetables = timetables.slice(0, 3)
  const recentNotifications = notifications.slice(0, 3)

  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Faculty",
      value: stats.totalFaculty,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Home,
      color: "from-violet-500 to-violet-600",
      bgColor: "from-violet-50 to-violet-100/50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600"
    },
    {
      title: "Total Timetables",
      value: stats.totalTimetables,
      icon: Calendar,
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-50 to-amber-100/50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      title: "Active Conflicts",
      value: stats.activeConflicts,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100/50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      title: "Completed Schedules",
      value: stats.completedSchedules,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100/50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100/50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* --- Sidebar (No Changes) --- */}
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg">
        <div className="p-6 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Scheduler</h2>
                <p className="text-xs text-slate-500">Smart Classroom</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNavItem === item.id
              return (
                <Link 
                  key={item.id} 
                  to={item.path}
                  onClick={() => setActiveNavItem(item.id)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'} group-hover:scale-110`} />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                    {item.id === 'notifications' && stats.pendingTasks > 0 && (
                      <div className="ml-auto">
                        <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                        }`}>
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
        <div className="absolute bottom-6 left-6 right-6">
          
        </div>
      </div>

      {/* --- Main Content (No Changes) --- */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Welcome to your Smart Classroom Scheduler. Manage courses, faculty, and generate optimal timetables with ease.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/timetables">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
                  <Calendar className="h-5 w-5 mr-2" />
                  View Timetables
                </Button>
              </Link>
              <Link to="/timetables/generate">
                <Button
                  variant="outline"
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400 shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate New
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                        <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${stat.bgColor} opacity-50`} />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Timetables */}
            <div className="xl:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader className="border-b border-slate-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-slate-800">Recent Timetables</CardTitle>
                      <CardDescription className="text-slate-600">Latest generated schedules and their status</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400 transition-all duration-300"
                    >
                      <Link to="/timetables">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {recentTimetables.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-slate-800">No Timetables Yet</h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">Create your first timetable to get started with scheduling your classes and resources.</p>
                      <Link to="/timetables/generate">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
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
                          className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-200/50 rounded-xl hover:bg-slate-100/50 hover:border-slate-300/50 transition-all duration-300"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-slate-800 text-lg">{t.name}</h4>
                              <Badge
                                variant={t.status === "published" ? "default" : "secondary"}
                                className={
                                  t.status === "published"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-slate-100 text-slate-700 border-slate-300"
                                }
                              >
                                {t.status}
                              </Badge>
                              {t.conflicts?.length > 0 && (
                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                  {t.conflicts.length} conflicts
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">
                              {t.department} • Semester {t.semester} • {t.schedule?.length || 0} classes scheduled
                            </p>
                          </div>
                          <Link to={`/timetables/`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400 transition-all duration-300"
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
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader className="border-b border-slate-200/50 p-6">
                  <CardTitle className="text-xl font-semibold text-slate-800">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-600">Frequently used operations</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex flex-col">
                  <Link to="/courses">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-blue-50 border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 h-12"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Course
                    </Button>
                  </Link>
                  <Link to="/faculty">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-emerald-50 border-slate-300 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300 h-12"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Faculty
                    </Button>
                  </Link>
                  <Link to="/rooms">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-violet-50 border-slate-300 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all duration-300 h-12"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Add Room
                    </Button>
                  </Link>
                  <Link to="/timetables/generate">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12">
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate Timetable
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader className="border-b border-slate-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-slate-800">Notifications</CardTitle>
                      <CardDescription className="text-slate-600">Recent system alerts</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400 transition-all duration-300"
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
                          className="flex items-start gap-4 p-4 bg-slate-50/50 border border-slate-200/50 rounded-xl hover:bg-slate-100/50 transition-all duration-300"
                        >
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              n.type === "error"
                                ? "bg-red-100 border border-red-200"
                                : n.type === "warning"
                                  ? "bg-amber-100 border border-amber-200"
                                  : n.type === "success"
                                    ? "bg-green-100 border border-green-200"
                                    : "bg-blue-100 border border-blue-200"
                            }`}
                          >
                            {["error", "warning"].includes(n.type) ? (
                              <AlertTriangle
                                className={`h-4 w-4 ${n.type === "error" ? "text-red-600" : "text-amber-600"}`}
                              />
                            ) : (
                              <TrendingUp
                                className={`h-4 w-4 ${n.type === "success" ? "text-green-600" : "text-blue-600"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 mb-1">{n.title}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
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
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
        >
            <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        context={chatContext} 
      />
      {/* ================================ */}

    </div>
  )
}
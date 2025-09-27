import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, AlertTriangle, Plus, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [timetables, setTimetables] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

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
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse w-64 rounded" />
        <div className="h-4 bg-muted animate-pulse w-96 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
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
      ? Math.round(timetables.filter((t) => t.schedule?.length).length / timetables.length * 100)
      : 0,
    pendingTasks: notifications.filter((n) => !n.isRead).length,
  }

  const recentTimetables = timetables.slice(0, 3)
  const recentNotifications = notifications.slice(0, 3)

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Smart Classroom Scheduler. Manage courses, faculty, and generate optimal timetables.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/timetables">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              View Timetables
            </Button>
          </Link>
          <Link to="/timetables/generate">
            <Button variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <h2>Total Courses</h2>
          <p className="text-xl font-bold">{stats.totalCourses}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2>Total Faculty</h2>
          <p className="text-xl font-bold">{stats.totalFaculty}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2>Total Rooms</h2>
          <p className="text-xl font-bold">{stats.totalRooms}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2>Total Timetables</h2>
          <p className="text-xl font-bold">{stats.totalTimetables}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Timetables */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Timetables</CardTitle>
                  <CardDescription>Latest generated schedules</CardDescription>
                </div>
                <Link to="/timetables">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTimetables.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Timetables Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first timetable to get started.</p>
                  <Link to="/timetables/generate">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Timetable
                    </Button>
                  </Link>
                </div>
              ) : (
                recentTimetables.map(t => (
                  <div key={t._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{t.name}</h4>
                        <Badge variant={t.status === "published" ? "default" : "secondary"}>{t.status}</Badge>
                        {t.conflicts?.length > 0 && <Badge variant="destructive" className="text-xs">{t.conflicts.length} conflicts</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t.department} • Semester {t.semester} • {t.schedule?.length || 0} classes
                      </p>
                    </div>
                    <Link to={`/timetables/${t._id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/courses"><Button variant="outline" className="w-full justify-start bg-transparent"><Plus className="h-4 w-4 mr-2"/>Add Course</Button></Link>
              <Link to="/faculty"><Button variant="outline" className="w-full justify-start bg-transparent"><Plus className="h-4 w-4 mr-2"/>Add Faculty</Button></Link>
              <Link to="/rooms"><Button variant="outline" className="w-full justify-start bg-transparent"><Plus className="h-4 w-4 mr-2"/>Add Room</Button></Link>
              <Link to="/timetables/generate"><Button className="w-full justify-start"><Sparkles className="h-4 w-4 mr-2"/>Generate Timetable</Button></Link>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Recent alerts</CardDescription>
                </div>
                <Link to="/notifications"><Button variant="outline" size="sm">View All</Button></Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentNotifications.length === 0 ? (
                <div className="text-center py-4"><p className="text-sm text-muted-foreground">No notifications yet</p></div>
              ) : (
                recentNotifications.map(n => (
                  <div key={n._id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded-full ${
                      n.type === "error" ? "bg-red-100" :
                      n.type === "warning" ? "bg-yellow-100" :
                      n.type === "success" ? "bg-green-100" : "bg-blue-100"
                    }`}>
                      {["error","warning"].includes(n.type) ? <AlertTriangle className={`h-3 w-3 ${n.type==="error"?"text-red-600":"text-yellow-600"}`} /> : <TrendingUp className={`h-3 w-3 ${n.type==="success"?"text-green-600":"text-blue-600"}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-balance">{n.title}</p>
                      <p className="text-xs text-muted-foreground text-pretty line-clamp-2">{n.message}</p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"/>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

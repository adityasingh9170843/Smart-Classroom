import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Users,
  Calendar,
  LayoutDashboard,
  BookOpen,
  Home,
  Bell,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Check,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("notifications")
  const [notificationToDelete, setNotificationToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "low",
  })

  const resetForm = () => {
    setFormData({ title: "", message: "", type: "info", priority: "low" })
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/notifications")
      setNotifications(Array.isArray(res.data) ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleSubmitNotification = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await axios.post("http://localhost:5000/api/notifications", formData)
      resetForm()
      setShowForm(false)
      fetchNotifications()
    } catch (error) {
      console.error("Error creating notification:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const confirmDeleteNotification = async () => {
    if (!notificationToDelete) return
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationToDelete._id}`)
      setNotifications((prev) => prev.filter((n) => n._id !== notificationToDelete._id))
    } catch (error) {
      console.error("Error deleting notification:", error)
    } finally {
      setNotificationToDelete(null) // Close the confirmation modal
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id)
    try {
      await Promise.all(unreadIds.map((id) => axios.put(`http://localhost:5000/api/notifications/${id}/read`)))
      fetchNotifications()
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getNotificationColor = (type, isRead) => {
    if (isRead) return "bg-slate-800/40 border-slate-700/50"
    switch (type) {
      case "error":
        return "bg-red-500/10 border-red-400/30 border-l-4 border-l-red-400"
      case "warning":
        return "bg-yellow-500/10 border-yellow-400/30 border-l-4 border-l-yellow-400"
      case "success":
        return "bg-green-500/10 border-green-400/30 border-l-4 border-l-green-400"
      case "info":
      default:
        return "bg-blue-500/10 border-blue-400/30 border-l-4 border-l-blue-400"
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500/20 to-rose-600/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-gradient-to-r from-yellow-500/20 to-amber-600/20 text-yellow-300 border-yellow-500/30"
      case "low":
      default:
        return "bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 border-slate-500/30"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Calendar className="w-5 h-5 text-white" />
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
                      className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-400"} group-hover:scale-110`}
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

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent leading-tight">
              Notifications
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Manage system-wide alerts, warnings, and informational messages for all users.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 hover:shadow-xl hover:shadow-cyan-600/30 transition-all duration-300 px-6 py-3 flex items-center gap-2 border border-cyan-500/30 backdrop-blur-sm hover:scale-105"
          >
            <Plus className="h-5 w-5" /> Add Notification
          </Button>
        </div>

        {showForm && (
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
            <CardHeader className="border-b border-slate-700/50 p-6">
              <CardTitle className="text-xl font-semibold text-cyan-100">Create New Notification</CardTitle>
              <CardDescription className="text-slate-400">This will be broadcasted to users.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitNotification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 text-slate-200">
                        <SelectItem value="info" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Info</SelectItem>
                        <SelectItem value="success" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Success</SelectItem>
                        <SelectItem value="warning" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Warning</SelectItem>
                        <SelectItem value="error" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 text-slate-200">
                        <SelectItem value="low" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Low</SelectItem>
                        <SelectItem value="medium" className="hover:bg-slate-700/50 focus:bg-slate-700/50">Medium</SelectItem>
                        <SelectItem value="high" className="hover:bg-slate-700/50 focus:bg-slate-700/50">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300 font-medium">Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70" />
                </div>
                <div>
                  <Label className="text-slate-300 font-medium">Message</Label>
                  <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={formLoading} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 transition-all duration-300 border border-cyan-500/30 backdrop-blur-sm">{formLoading ? "Sending..." : "Send Notification"}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm transition-all duration-300">Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
          <CardHeader className="border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-100">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30 backdrop-blur-sm">
                    <Bell className="h-5 w-5 text-cyan-300" />
                  </div>
                  Notification Feed
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {notifications.length} total notifications. {unreadCount} unread.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0} className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm transition-all duration-300">
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? <p className="text-center text-slate-400 py-10">Loading notifications...</p> : notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-2 text-sm font-medium text-slate-300">All caught up!</h3>
                <p className="mt-1 text-sm text-slate-500">There are no new notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n._id} className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-all duration-300 backdrop-blur-sm ${getNotificationColor(n.type, n.isRead)}`}>
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 flex-shrink-0">{getNotificationIcon(n.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-semibold ${n.isRead ? "text-slate-400" : "text-slate-100"}`}>{n.title}</p>
                          <Badge variant="outline" className={`${getPriorityBadgeClass(n.priority)} capitalize`}>{n.priority}</Badge>
                        </div>
                        <p className="text-sm text-slate-400">{n.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!n.isRead && (
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleMarkAsRead(n._id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setNotificationToDelete(n)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {notificationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Confirm Deletion
              </CardTitle>
              <CardDescription className="text-slate-400">
                Are you sure you want to delete this notification? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <p className="font-bold text-slate-200">{notificationToDelete.title}</p>
                <p className="text-slate-400 mt-1">{notificationToDelete.message}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 bg-slate-900/50 p-4 rounded-b-lg">
              <Button variant="outline" onClick={() => setNotificationToDelete(null)} className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm transition-all duration-300">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteNotification}
                className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 border-0"
              >
                Delete Notification
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
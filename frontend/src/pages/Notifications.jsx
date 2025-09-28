import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("notifications");
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "low",
  });
  
  const resetForm = () => {
    setFormData({ title: "", message: "", type: "info", priority: "low" });
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const handleSubmitNotification = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post("http://localhost:5000/api/notifications", formData);
      resetForm();
      setShowForm(false);
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      setFormLoading(false);
    }
  };
  
  const confirmDeleteNotification = async () => {
    if (!notificationToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationToDelete._id}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationToDelete._id));
    } catch (error) {
        console.error("Error deleting notification:", error);
    } finally {
        setNotificationToDelete(null); // Close the confirmation modal
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
        console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
      try {
        await Promise.all(unreadIds.map(id => axios.put(`http://localhost:5000/api/notifications/${id}/read`)));
        fetchNotifications();
      } catch(error) {
        console.error("Error marking all as read:", error);
      }
  };
  
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "error": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "info":
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) return "bg-slate-50 border-slate-200";
    switch (type) {
      case "error": return "bg-red-50 border-red-300 border-l-4";
      case "warning": return "bg-yellow-50 border-yellow-300 border-l-4";
      case "success": return "bg-green-50 border-green-300 border-l-4";
      case "info":
      default: return "bg-blue-50 border-blue-300 border-l-4";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Scheduler</h2>
              <p className="text-xs text-slate-500">Smart Classroom</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNavItem === item.id;
              return (
                <Link key={item.id} to={item.path} onClick={() => setActiveNavItem(item.id)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${isActive ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}>
                    <IconComponent className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"} group-hover:scale-110`} />
                    <span className={`font-medium transition-colors duration-300 ${isActive ? "text-white" : ""}`}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-xl border border-slate-200/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Admin User</p>
            <p className="text-xs text-slate-500">System Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">Notifications</h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Manage system-wide alerts, warnings, and informational messages for all users.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add Notification
          </Button>
        </div>

        {/* Add Notification Form */}
        {showForm && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader className="border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-semibold text-slate-800">Create New Notification</CardTitle>
              <CardDescription className="text-slate-600">This will be broadcasted to users.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitNotification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                     <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={formLoading}>{formLoading ? "Sending..." : "Send Notification"}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="border-b border-slate-200/50 p-6">
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      Notification Feed
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {notifications.length} total notifications. {unreadCount} unread.
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                    Mark All as Read
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-6">
             {loading ? <p>Loading notifications...</p> : notifications.length === 0 ? (
                <div className="text-center py-10">
                    <Bell className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-medium text-slate-800">All caught up!</h3>
                    <p className="mt-1 text-sm text-slate-500">There are no new notifications.</p>
                </div>
             ) : (
                <div className="space-y-4">
                    {notifications.map(n => (
                        <div key={n._id} className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-all duration-300 ${getNotificationColor(n.type, n.isRead)}`}>
                            <div className="flex items-start gap-4 flex-1">
                                <div className="mt-1">{getNotificationIcon(n.type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className={`font-semibold ${n.isRead ? "text-slate-600" : "text-slate-800"}`}>{n.title}</p>
                                      <Badge variant="outline" className={`${getPriorityBadgeClass(n.priority)} capitalize`}>{n.priority}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">{n.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {!n.isRead && (
                                     <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleMarkAsRead(n._id)}>
                                        <Check className="h-4 w-4" />
                                     </Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-red-600" onClick={() => setNotificationToDelete(n)}>
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

      {/* Delete Confirmation Modal */}
      {notificationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Confirm Deletion
                    </CardTitle>
                    <CardDescription>
                        Are you sure you want to delete this notification? This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-medium bg-slate-100 p-3 rounded-md border">
                        <p className="font-bold text-slate-700">{notificationToDelete.title}</p>
                        <p className="text-slate-500 mt-1">{notificationToDelete.message}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-slate-50 p-4 rounded-b-lg">
                    <Button variant="outline" onClick={() => setNotificationToDelete(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={confirmDeleteNotification}
                    >
                        Delete Notification
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )}
    </div>
  );
}

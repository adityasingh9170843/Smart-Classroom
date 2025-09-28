

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacultyForm } from "@/components/Faculty-Form";
import { DataTable } from "@/components/Data-table";
import {
  Plus,
  Users,
  Mail,
  Clock,
  Calendar,
  LayoutDashboard,
  BookOpen,
  Home,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("faculty");
  const [editingFaculty, setEditingFaculty] = useState(null);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/faculty");
      setFaculty(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleCreateFaculty = async (data) => {
    setFormLoading(true);
    try {
      if (editingFaculty) {
        await axios.put(`http://localhost:5000/api/faculty/${editingFaculty._id}`, data);
      } else {
        await axios.post("http://localhost:5000/api/faculty", data);
      }
      setShowForm(false);
      setEditingFaculty(null);
      fetchFaculty();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (facultyMember) => {
    try {
      await axios.delete(`http://localhost:5000/api/faculty/${facultyMember._id}`);
      if (editingFaculty && editingFaculty._id === facultyMember._id) {
        setEditingFaculty(null);
        setShowForm(false);
      }
      fetchFaculty();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (f) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-800">{f.name}</div>
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Mail className="h-3 w-3 text-slate-400" /> {f.email}
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department", render: (f) => <div className="text-slate-700">{f.department}</div> },
    { key: "designation", label: "Designation", render: (f) => <div className="text-slate-700">{f.designation || "N/A"}</div> },
    {
      key: "specialization",
      label: "Specialization",
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.specialization?.slice(0, 2).map((s) => (
            <Badge key={s} className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">{s}</Badge>
          ))}
          {f.specialization?.length > 2 && <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200">+{f.specialization.length - 2}</Badge>}
        </div>
      ),
    },
    {
      key: "maxHoursPerWeek",
      label: "Max Hours/Week",
      render: (f) => (
        <div className="flex items-center gap-2 text-slate-700">
          <Clock className="h-3 w-3 text-slate-400" /> {f.maxHoursPerWeek}h
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (f) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-slate-300 bg-white hover:bg-blue-50 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
            onClick={() => { setEditingFaculty(f); setShowForm(true); }}>
            Edit
          </Button>
          <Button size="sm" variant="outline" className="border-red-300 bg-white hover:bg-red-50 text-red-600 hover:border-red-400 hover:text-red-700 transition-all duration-300"
            onClick={() => handleDelete(f)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading faculty...</div>;

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
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">Faculty</h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">Manage faculty members and their information. Add, edit, and organize teaching staff.</p>
          </div>
          <Button
            onClick={() => { setEditingFaculty(null); setShowForm(!showForm); }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add Faculty
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader className="border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-semibold text-slate-800">{editingFaculty ? "Edit Faculty" : "Add New Faculty"}</CardTitle>
              <CardDescription className="text-slate-600">Fill in the faculty details below</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FacultyForm
                initialData={editingFaculty}
                onSubmit={handleCreateFaculty}
                loading={formLoading}
              />
            </CardContent>
          </Card>
        )}

        {/* Faculty List */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="border-b border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                  <div className="p-2 bg-blue-100 rounded-xl"><Users className="h-5 w-5 text-blue-600" /></div>
                  All Faculty
                </CardTitle>
                <CardDescription className="text-slate-600">{faculty.length} faculty members registered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white/60 rounded-xl border border-slate-200/50 overflow-hidden">
              <DataTable data={faculty} columns={columns} searchKey="name" loading={loading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

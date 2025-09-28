"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FacultyForm } from "@/components/Faculty-Form"
import { DataTable } from "@/components/Data-table"
import { Plus, Users, Mail, Clock, Calendar, LayoutDashboard, BookOpen, Home, Bell } from "lucide-react"
import { Link } from "react-router-dom"

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("faculty")
  const [editingFaculty, setEditingFaculty] = useState(null)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    {
      id: "timetables",
      label: "Timetables",
      icon: Calendar,
      path: "/timetables",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
  ]

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/faculty")
      setFaculty(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error(error)
      setFaculty([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const handleCreateFaculty = async (data) => {
    setFormLoading(true)
    try {
      if (editingFaculty) {
        await axios.put(`http://localhost:5000/api/faculty/${editingFaculty._id}`, data)
      } else {
        await axios.post("http://localhost:5000/api/faculty", data)
      }
      setShowForm(false)
      setEditingFaculty(null)
      fetchFaculty()
    } catch (error) {
      console.error(error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (facultyMember) => {
    try {
      await axios.delete(`http://localhost:5000/api/faculty/${facultyMember._id}`)
      if (editingFaculty && editingFaculty._id === facultyMember._id) {
        setEditingFaculty(null)
        setShowForm(false)
      }
      fetchFaculty()
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (f) => (
        <div className="space-y-1">
          <div className="font-medium text-cyan-100">{f.name}</div>
          <div className="text-sm text-slate-300 flex items-center gap-2">
            <Mail className="h-3 w-3 text-cyan-400" /> {f.email}
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (f) => <div className="text-slate-200">{f.department}</div>,
    },
    {
      key: "designation",
      label: "Designation",
      render: (f) => <div className="text-slate-200">{f.designation || "N/A"}</div>,
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.specialization?.slice(0, 2).map((s) => (
            <Badge
              key={s}
              className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-emerald-400/30 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300"
            >
              {s}
            </Badge>
          ))}
          {f.specialization?.length > 2 && (
            <Badge className="bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 border border-slate-500/30 hover:from-slate-600/30 hover:to-slate-700/30 transition-all duration-300">
              +{f.specialization.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "maxHoursPerWeek",
      label: "Max Hours/Week",
      render: (f) => (
        <div className="flex items-center gap-2 text-slate-200">
          <Clock className="h-3 w-3 text-cyan-400" /> {f.maxHoursPerWeek}h
        </div>
      ),
    },
    {
      key: "availability",
      label: "Availability",
      render: (f) => (
        <div className="flex flex-col gap-1 text-sm">
          {Object.entries(f.availability || {}).map(([day, slots]) =>
            slots.length ? (
              <div key={day} className="text-slate-300">
                <span className="text-cyan-300 font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>{" "}
                {slots.map((s) => `${s.start}-${s.end}`).join(", ")}
              </div>
            ) : null,
          )}
        </div>
      ),
    },
    {
      key: "preferences",
      label: "Preferences",
      render: (f) => (
        <div className="flex flex-col gap-1 text-sm">
          {f.preferences?.preferredTimeSlots?.length > 0 && (
            <div className="text-slate-300">
              <span className="text-green-300 font-medium">Preferred:</span>{" "}
              {f.preferences.preferredTimeSlots.join(", ")}
            </div>
          )}
          {f.preferences?.avoidTimeSlots?.length > 0 && (
            <div className="text-slate-300">
              <span className="text-red-300 font-medium">Avoid:</span> {f.preferences.avoidTimeSlots.join(", ")}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (f) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:border-cyan-300 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm"
            onClick={() => {
              setEditingFaculty(f)
              setShowForm(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-400/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:border-red-300 hover:text-red-200 transition-all duration-300 backdrop-blur-sm"
            onClick={() => handleDelete(f)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-8 text-center text-slate-300 flex items-center justify-center min-h-screen">
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
            <p className="text-xl">Loading faculty...</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Sidebar */}
      <div className="relative z-10 w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl p-6 flex flex-col justify-between">
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-auto p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent leading-tight">
              Faculty
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Manage faculty members and their information. Add, edit, and organize teaching staff.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingFaculty(null)
              setShowForm(!showForm)
            }}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 hover:shadow-xl hover:shadow-cyan-600/30 transition-all duration-300 px-6 py-3 flex items-center gap-2 border border-cyan-500/30 backdrop-blur-sm hover:scale-105"
          >
            <Plus className="h-5 w-5" /> Add Faculty
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
            <CardHeader className="border-b border-slate-700/50 p-6">
              <CardTitle className="text-xl font-semibold text-cyan-100">
                {editingFaculty ? "Edit Faculty" : "Add New Faculty"}
              </CardTitle>
              <CardDescription className="text-slate-300">Fill in the faculty details below</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FacultyForm initialData={editingFaculty} onSubmit={handleCreateFaculty} loading={formLoading} />
            </CardContent>
          </Card>
        )}

        {/* Faculty List */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
          <CardHeader className="border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-100">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30 backdrop-blur-sm">
                    <Users className="h-5 w-5 text-cyan-300" />
                  </div>
                  All Faculty
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {faculty.length} faculty members registered
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
              <DataTable data={faculty} columns={columns} searchKey="name" loading={loading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

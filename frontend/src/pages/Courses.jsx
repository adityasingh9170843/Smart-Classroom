

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CourseForm } from "@/components/CourseForm"
import { DataTable } from "@/components/Data-table"
import { Plus, BookOpen, Users, Calendar, LayoutDashboard, Home, Bell } from "lucide-react"
import { Link } from "react-router-dom"

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("courses")
  const [editingCourse, setEditingCourse] = useState(null)

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

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/courses/")
      setCourses(res.data)
    } catch (err) {
      console.error("Failed to fetch courses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // Create a new course
  const handleCreateCourse = async (courseData) => {
    try {
      setFormLoading(true)
      await axios.post("http://localhost:5000/api/courses/", courseData)
      setShowForm(false)
      setEditingCourse(null)
      fetchCourses()
    } catch (error) {
      console.error("Failed to create course:", error)
    } finally {
      setFormLoading(false)
    }
  }

  // Update a course
  const handleUpdateCourse = async (id, courseData) => {
    try {
      setFormLoading(true)
      await axios.put(`http://localhost:5000/api/courses/${id}`, courseData)
      setEditingCourse(null)
      setShowForm(false)
      fetchCourses()
    } catch (error) {
      console.error("Failed to update course:", error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete a course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`)
      // if deleting the currently editing course, clear form
      if (editingCourse && editingCourse._id === id) {
        setEditingCourse(null)
        setShowForm(false)
      }
      fetchCourses()
    } catch (error) {
      console.error("Failed to delete course:", error)
    }
  }

  // DataTable columns (note: key for semester is "semester")
  const columns = [
    {
      key: "code",
      label: "Course Code",
      sortable: true,
      render: (course) => (
        <div className="font-mono font-semibold text-cyan-100 bg-slate-800/50 px-3 py-1 rounded-lg border border-cyan-500/20">
          {course.code}
        </div>
      ),
    },
    {
      key: "name",
      label: "Course Name",
      sortable: true,
      render: (course) => <div className="font-medium text-slate-100">{course.name}</div>,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
      render: (course) => <div className="text-slate-300">{course.department}</div>,
    },
    {
      key: "credits",
      label: "Credits",
      render: (course) => (
        <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 backdrop-blur-sm">
          {course.credits}
        </Badge>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (course) => (
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 hover:from-emerald-500/30 hover:to-teal-500/30 backdrop-blur-sm">
          {course.type}
        </Badge>
      ),
    },
    {
      key: "hoursPerWeek",
      label: "Hours per Week",
      render: (course) => (
        <Badge className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30 hover:from-violet-500/30 hover:to-purple-500/30 backdrop-blur-sm">
          {course.hoursPerWeek}
        </Badge>
      ),
    },
    {
      key: "semester",
      label: "Semester",
      render: (course) => (
        <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30 backdrop-blur-sm">
          Sem {course.semester}
        </Badge>
      ),
    },
    {
      key: "year",
      label: "Year",
      render: (course) => (
        <Badge className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30 hover:from-pink-500/30 hover:to-rose-500/30 backdrop-blur-sm">
          {course.year}
        </Badge>
      ),
    },
    {
      key: "prerequisites",
      label: "Prerequisites",
      render: (course) => (
        <div className="flex flex-wrap gap-1 max-w-32">
          {course.prerequisites?.length > 0 ? (
            course.prerequisites.map((prereq, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-slate-800/30 text-slate-300 border-slate-600/50 backdrop-blur-sm"
              >
                {prereq}
              </Badge>
            ))
          ) : (
            <span className="text-slate-500 text-sm">None</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (course) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 bg-slate-800/50 hover:bg-cyan-500/10 text-cyan-300 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm"
            onClick={() => {
              setEditingCourse(course)
              setShowForm(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/30 bg-slate-800/50 hover:bg-red-500/10 text-red-400 hover:border-red-400/50 hover:text-red-300 transition-all duration-300 backdrop-blur-sm"
            onClick={() => handleDeleteCourse(course._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Sidebar Loading */}
        <div className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl relative z-10">
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
            <div className="h-96 bg-slate-800/50 animate-pulse rounded-2xl shadow-sm backdrop-blur-sm" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/60 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping delay-1000"></div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl relative z-10">
        <div className="p-6 space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">Scheduler</h2>
                <p className="text-xs text-cyan-400">Smart Classroom</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNavItem === item.id
              return (
                <Link key={item.id} to={item.path} onClick={() => setActiveNavItem(item.id)}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-100 shadow-lg shadow-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 hover:border-slate-700/50 border border-transparent backdrop-blur-sm"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? "text-cyan-300 drop-shadow-sm" : "text-slate-400 group-hover:text-slate-200"
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
      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent leading-tight">
                Courses
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Manage academic courses and their details. Add, edit, and organize course information efficiently.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingCourse(null)
                setShowForm(!showForm)
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 px-6 py-3 border border-cyan-500/20 backdrop-blur-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Add/Edit Course Form */}
          {showForm && (
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-cyan-500/5">
              <CardHeader className="border-b border-slate-700/50 p-6">
                <CardTitle className="text-xl font-semibold text-slate-100">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </CardTitle>
                <CardDescription className="text-slate-400">Fill in the course details below</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CourseForm
                  initialData={editingCourse}
                  onSubmit={(data) => {
                    if (editingCourse) {
                      handleUpdateCourse(editingCourse._id, data)
                    } else {
                      handleCreateCourse(data)
                    }
                  }}
                  loading={formLoading}
                />
              </CardContent>
            </Card>
          )}

          {/* Courses List */}
          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-cyan-500/5">
            <CardHeader className="border-b border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-100">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                      <BookOpen className="h-5 w-5 text-cyan-300" />
                    </div>
                    All Courses
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {courses.length} courses registered in the system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-slate-900/30 rounded-xl border border-slate-700/30 overflow-hidden backdrop-blur-sm">
                <DataTable data={courses} columns={columns} searchKey="name" loading={loading} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

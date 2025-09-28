"use client";

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
import { CourseForm } from "@/components/CourseForm";
import { DataTable } from "@/components/Data-table";
import {
  Plus,
  BookOpen,
  Users,
  Calendar,
  LayoutDashboard,
  Home,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("courses");
  const [editingCourse, setEditingCourse] = useState(null); // <-- added

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
  ];

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Create a new course
  const handleCreateCourse = async (courseData) => {
    try {
      setFormLoading(true);
      await axios.post("http://localhost:5000/api/courses/", courseData);
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // Update a course
  const handleUpdateCourse = async (id, courseData) => {
    try {
      setFormLoading(true);
      await axios.put(`http://localhost:5000/api/courses/${id}`, courseData);
      setEditingCourse(null);
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error("Failed to update course:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      // if deleting the currently editing course, clear form
      if (editingCourse && editingCourse._id === id) {
        setEditingCourse(null);
        setShowForm(false);
      }
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  // DataTable columns (note: key for semester is "semester")
  const columns = [
  {
    key: "code",
    label: "Course Code",
    sortable: true,
    render: (course) => (
      <div className="font-mono font-semibold text-slate-800">
        {course.code}
      </div>
    ),
  },
  {
    key: "name",
    label: "Course Name",
    sortable: true,
    render: (course) => (
      <div className="font-medium text-slate-800">{course.name}</div>
    ),
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (course) => <div className="text-slate-700">{course.department}</div>,
  },
  {
    key: "credits",
    label: "Credits",
    render: (course) => (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
        {course.credits}
      </Badge>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (course) => (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
        {course.type}
      </Badge>
    ),
  },
  {
    key: "hoursPerWeek",
    label: "Hours per Week",
    render: (course) => (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
        {course.hoursPerWeek}
      </Badge>
    ),
  },
  {
    key: "semester",
    label: "Semester",
    render: (course) => (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
        Sem {course.semester}
      </Badge>
    ),
  },
  {
    key: "year", // New column
    label: "Year",
    render: (course) => (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
        {course.year}
      </Badge>
    ),
  },
  {
    key: "prerequisites", // New column
    label: "Prerequisites",
    render: (course) => (
      <div className="flex flex-wrap gap-1 max-w-32">
        {course.prerequisites?.length > 0 ? (
          course.prerequisites.map((prereq, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {prereq}
            </Badge>
          ))
        ) : (
          <span className="text-slate-400 text-sm">None</span>
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
          className="border-slate-300 bg-white hover:bg-blue-50 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
          onClick={() => {
            setEditingCourse(course);
            setShowForm(true);
          }}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 bg-white hover:bg-red-50 text-red-600 hover:border-red-400 hover:text-red-700 transition-all duration-300"
          onClick={() => handleDeleteCourse(course._id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Sidebar Loading */}
        <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg">
          <div className="p-6 space-y-6">
            <div className="h-8 bg-slate-200/50 animate-pulse rounded-xl w-32" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-200/30 animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Loading */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-12 bg-slate-200/50 animate-pulse rounded-xl w-80" />
            <div className="h-6 bg-slate-200/30 animate-pulse rounded-lg w-96" />
            <div className="h-96 bg-white/80 animate-pulse rounded-2xl shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-lg">
        <div className="p-6 space-y-8">
          {/* Logo/Brand */}
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

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNavItem === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveNavItem(item.id)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-700"
                      } group-hover:scale-110`}
                    />
                    <span
                      className={`font-medium transition-colors duration-300 ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Courses
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Manage academic courses and their details. Add, edit, and
                organize course information efficiently.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingCourse(null); // clear editing (add mode)
                setShowForm(!showForm);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Add/Edit Course Form */}
          {showForm && (
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              <CardHeader className="border-b border-slate-200/50 p-6">
                <CardTitle className="text-xl font-semibold text-slate-800">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Fill in the course details below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CourseForm
                  initialData={editingCourse}
                  onSubmit={(data) => {
                    if (editingCourse) {
                      handleUpdateCourse(editingCourse._id, data);
                    } else {
                      handleCreateCourse(data);
                    }
                  }}
                  loading={formLoading}
                />
              </CardContent>
            </Card>
          )}

          {/* Courses List */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader className="border-b border-slate-200/50 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    All Courses
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {courses.length} courses registered in the system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white/60 rounded-xl border border-slate-200/50 overflow-hidden">
                <DataTable
                  data={courses}
                  columns={columns}
                  searchKey="name"
                  loading={loading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/Data-table"
import { Plus, Building, Users, Calendar, LayoutDashboard, BookOpen, Home, Bell, Edit, X, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export default function RoomPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("rooms")
  const [editingRoom, setEditingRoom] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: "",
    capacity: "",
    type: "",
    equipment: "",
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  })

  // Time slot state for availability
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "monday",
    start: "",
    end: "",
  })

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ]

  const roomTypes = [
    { value: "lecture_hall", label: "Lecture Hall" },
    { value: "lab", label: "Laboratory" },
    { value: "seminar_room", label: "Seminar Room" },
    { value: "auditorium", label: "Auditorium" },
  ]

  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      building: "",
      floor: "",
      capacity: "",
      type: "",
      equipment: "",
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    })
    setEditingRoom(null)
  }

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/rooms")
      setRooms(res.data)
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Load room data for editing
  const handleEditRoom = (room) => {
    setFormData({
      name: room.name || "",
      building: room.building || "",
      floor: room.floor?.toString() || "",
      capacity: room.capacity?.toString() || "",
      type: room.type || "",
      equipment: room.equipment?.join(", ") || "",
      availability: room.availability || {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    })
    setEditingRoom(room)
    setShowForm(true)
  }

  // Create or update room
  const handleSubmitRoom = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
        equipment: formData.equipment
          ? formData.equipment
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
      }

      if (editingRoom) {
        await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, payload)
      } else {
        await axios.post("http://localhost:5000/api/rooms", payload)
      }

      resetForm()
      setShowForm(false)
      fetchRooms()
    } catch (error) {
      console.error("Error saving room:", error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete room
  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return

    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`)
      if (editingRoom && editingRoom._id === id) {
        resetForm()
        setShowForm(false)
      }
      fetchRooms()
    } catch (error) {
      console.error("Error deleting room:", error)
    }
  }

  // Add time slot to availability
  const addTimeSlot = () => {
    if (!newTimeSlot.start || !newTimeSlot.end) return

    const timeSlot = {
      start: newTimeSlot.start,
      end: newTimeSlot.end,
    }

    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [newTimeSlot.day]: [...prev.availability[newTimeSlot.day], timeSlot],
      },
    }))

    setNewTimeSlot({ day: newTimeSlot.day, start: "", end: "" })
  }

  // Remove time slot from availability
  const removeTimeSlot = (day, index) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index),
      },
    }))
  }

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Room Details",
      render: (room) => (
        <div className="space-y-1">
          <div className="font-medium text-cyan-100">{room.name}</div>
          <div className="text-sm text-slate-400">
            {room.building}, Floor {room.floor}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (room) => (
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300">
          {room.type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (room) => (
        <div className="flex items-center gap-2 text-slate-300">
          <Users className="h-3 w-3 text-cyan-400" />
          {room.capacity}
        </div>
      ),
    },
    {
      key: "equipment",
      label: "Equipment",
      render: (room) => (
        <div className="flex flex-wrap gap-1 max-w-32">
          {room.equipment?.slice(0, 2).map((eq, index) => (
            <Badge
              key={index}
              className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 text-xs"
            >
              {eq}
            </Badge>
          ))}
          {room.equipment?.length > 2 && (
            <Badge className="bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30 hover:from-slate-500/30 hover:to-slate-600/30 transition-all duration-300 text-xs">
              +{room.equipment.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "availability",
      label: "Available Days",
      render: (room) => {
        const availableDays = room.availability
          ? Object.keys(room.availability).filter((day) => room.availability[day]?.length > 0)
          : []

        return (
          <div className="flex flex-wrap gap-1">
            {availableDays.length > 0 ? (
              availableDays.slice(0, 3).map((day) => (
                <Badge
                  key={day}
                  className="bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-300 border-violet-500/30 hover:from-violet-500/30 hover:to-violet-600/30 transition-all duration-300 text-xs capitalize"
                >
                  {day.slice(0, 3)}
                </Badge>
              ))
            ) : (
              <span className="text-slate-500 text-sm">Not set</span>
            )}
            {availableDays.length > 3 && (
              <Badge className="bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30 hover:from-slate-500/30 hover:to-slate-600/30 transition-all duration-300 text-xs">
                +{availableDays.length - 3}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (room) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/30 hover:to-cyan-600/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            onClick={() => handleEditRoom(room)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            onClick={() => handleDeleteRoom(room._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-cyan-300 text-lg">Loading rooms...</div>
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
      {/* </CHANGE> */}

      {/* Sidebar */}
      <div className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-cyan-500/20 shadow-2xl shadow-cyan-500/10 p-6 flex flex-col justify-between relative z-10">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-100 shadow-lg shadow-cyan-500/25 border border-cyan-500/30" : "text-slate-300 hover:bg-slate-800/50 hover:text-cyan-200 border border-transparent hover:border-slate-700/50"} backdrop-blur-sm`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"} group-hover:scale-110`}
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
      {/* </CHANGE> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 space-y-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent leading-tight">
              Rooms
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Manage classrooms, labs, and other facilities. Add, organize, and track room information with availability
              schedules.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 px-6 py-3 flex items-center gap-2 hover:scale-105 border border-cyan-500/30"
          >
            <Plus className="h-5 w-5" /> Add Room
          </Button>
        </div>

        {/* Add/Edit Room Form */}
        {showForm && (
          <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <CardHeader className="border-b border-cyan-500/20 p-6">
              <CardTitle className="text-xl font-semibold text-cyan-100">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Fill in the room details and set availability schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitRoom} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Room Name *</Label>
                    <Input
                      className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                      placeholder="e.g., Room A101"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Building *</Label>
                    <Input
                      className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                      placeholder="e.g., Main Building"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Floor *</Label>
                    <Input
                      className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                      type="number"
                      min="0"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Capacity *</Label>
                    <Input
                      className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Room Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 text-slate-200">
                        {roomTypes.map((type) => (
                          <SelectItem
                            key={type.value}
                            value={type.value}
                            className="hover:bg-slate-700/50 focus:bg-slate-700/50"
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300 font-medium">Equipment (comma separated)</Label>
                  <Textarea
                    className="mt-1 bg-slate-800/50 border-slate-600/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70"
                    placeholder="e.g., Projector, Whiteboard, Sound System"
                    rows={2}
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  />
                </div>

                {/* Availability Section */}
                <div>
                  <Label className="text-slate-300 font-medium mb-3 block">Availability Schedule</Label>

                  {/* Add Time Slot */}
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600/30 mb-4 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <Label className="text-sm text-slate-400">Day</Label>
                        <Select
                          value={newTimeSlot.day}
                          onValueChange={(value) => setNewTimeSlot({ ...newTimeSlot, day: value })}
                        >
                          <SelectTrigger className="text-sm bg-slate-800/50 border-slate-600/50 text-slate-200 backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 text-slate-200">
                            {weekDays.map((day) => (
                              <SelectItem
                                key={day}
                                value={day}
                                className="capitalize hover:bg-slate-700/50 focus:bg-slate-700/50"
                              >
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-slate-400">Start Time</Label>
                        <Input
                          type="time"
                          className="text-sm bg-slate-800/50 border-slate-600/50 text-slate-200 backdrop-blur-sm"
                          value={newTimeSlot.start}
                          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-400">End Time</Label>
                        <Input
                          type="time"
                          className="text-sm bg-slate-800/50 border-slate-600/50 text-slate-200 backdrop-blur-sm"
                          value={newTimeSlot.end}
                          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end: e.target.value })}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addTimeSlot}
                        className="flex items-center gap-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm transition-all duration-300"
                      >
                        <Plus className="h-3 w-3" /> Add Slot
                      </Button>
                    </div>
                  </div>

                  {/* Current Availability */}
                  <div className="space-y-3">
                    {weekDays.map(
                      (day) =>
                        formData.availability[day]?.length > 0 && (
                          <div
                            key={day}
                            className="border border-slate-600/30 rounded-lg p-3 bg-slate-800/20 backdrop-blur-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-300 capitalize">{day}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.availability[day].map((slot, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-md px-3 py-1 backdrop-blur-sm"
                                >
                                  <Clock className="h-3 w-3 text-blue-400" />
                                  <span className="text-sm text-blue-300">
                                    {slot.start} - {slot.end}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeTimeSlot(day, index)}
                                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 border border-cyan-500/30"
                  >
                    {formLoading ? "Saving..." : editingRoom ? "Update Room" : "Save Room"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setShowForm(false)
                    }}
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Rooms List */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <CardHeader className="border-b border-cyan-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-100">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                    <Building className="h-5 w-5 text-cyan-400" />
                  </div>
                  All Rooms
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {rooms.length} rooms available in the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-800/20 rounded-xl border border-slate-600/30 overflow-hidden backdrop-blur-sm">
              <DataTable data={rooms} columns={columns} searchKey="name" loading={loading} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* </CHANGE> */}
    </div>
  )
}

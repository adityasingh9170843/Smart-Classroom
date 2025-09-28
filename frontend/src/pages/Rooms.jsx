import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/data-table";
import { 
  Plus, 
  Building, 
  Users, 
  Calendar, 
  LayoutDashboard, 
  BookOpen, 
  Home, 
  Bell,
  Edit,
  X,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("rooms");
  const [editingRoom, setEditingRoom] = useState(null);
  
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
      sunday: []
    }
  });

  // Time slot state for availability
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "monday",
    start: "",
    end: ""
  });

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
    { id: "faculty", label: "Faculty", icon: Users, path: "/faculty" },
    { id: "rooms", label: "Rooms", icon: Home, path: "/rooms" },
    { id: "timetables", label: "Timetables", icon: Calendar, path: "/timetables" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  const roomTypes = [
    { value: "lecture_hall", label: "Lecture Hall" },
    { value: "lab", label: "Laboratory" },
    { value: "seminar_room", label: "Seminar Room" },
    { value: "auditorium", label: "Auditorium" }
  ];

  const weekDays = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ];

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
        sunday: []
      }
    });
    setEditingRoom(null);
  };

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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
        sunday: []
      }
    });
    setEditingRoom(room);
    setShowForm(true);
  };

  // Create or update room
  const handleSubmitRoom = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
        equipment: formData.equipment
          ? formData.equipment.split(",").map((e) => e.trim()).filter(e => e)
          : [],
      };

      if (editingRoom) {
        await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/rooms", payload);
      }
      
      resetForm();
      setShowForm(false);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete room
  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      if (editingRoom && editingRoom._id === id) {
        resetForm();
        setShowForm(false);
      }
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Add time slot to availability
  const addTimeSlot = () => {
    if (!newTimeSlot.start || !newTimeSlot.end) return;
    
    const timeSlot = {
      start: newTimeSlot.start,
      end: newTimeSlot.end
    };
    
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [newTimeSlot.day]: [...prev.availability[newTimeSlot.day], timeSlot]
      }
    }));
    
    setNewTimeSlot({ day: newTimeSlot.day, start: "", end: "" });
  };

  // Remove time slot from availability
  const removeTimeSlot = (day, index) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index)
      }
    }));
  };

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Room Details",
      render: (room) => (
        <div className="space-y-1">
          <div className="font-medium text-slate-800">{room.name}</div>
          <div className="text-sm text-slate-600">
            {room.building}, Floor {room.floor}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (room) => (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
          {room.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (room) => (
        <div className="flex items-center gap-2 text-slate-700">
          <Users className="h-3 w-3 text-slate-400" />
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
            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 text-xs">
              {eq}
            </Badge>
          ))}
          {room.equipment?.length > 2 && (
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 text-xs">
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
        const availableDays = room.availability ? Object.keys(room.availability).filter(day => 
          room.availability[day]?.length > 0
        ) : [];
        
        return (
          <div className="flex flex-wrap gap-1">
            {availableDays.length > 0 ? (
              availableDays.slice(0, 3).map(day => (
                <Badge key={day} variant="outline" className="text-xs capitalize">
                  {day.slice(0, 3)}
                </Badge>
              ))
            ) : (
              <span className="text-slate-400 text-sm">Not set</span>
            )}
            {availableDays.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{availableDays.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (room) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-300 bg-white hover:bg-blue-50 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
            onClick={() => handleEditRoom(room)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-300 bg-white hover:bg-red-50 text-red-600 hover:border-red-400 hover:text-red-700 transition-all duration-300"
            onClick={() => handleDeleteRoom(room._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading rooms...</div>;

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
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">Rooms</h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Manage classrooms, labs, and other facilities. Add, organize, and track room information with availability schedules.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add Room
          </Button>
        </div>

        {/* Add/Edit Room Form */}
        {showForm && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader className="border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-semibold text-slate-800">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </CardTitle>
              <CardDescription className="text-slate-600">
                Fill in the room details and set availability schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitRoom} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Room Name *</Label>
                    <Input
                      className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Room A101"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Building *</Label>
                    <Input
                      className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Main Building"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Floor *</Label>
                    <Input
                      className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      type="number"
                      min="0"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Capacity *</Label>
                    <Input
                      className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Room Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="mt-1 border-slate-300 focus:border-blue-500">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700 font-medium">Equipment (comma separated)</Label>
                  <Textarea
                    className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Projector, Whiteboard, Sound System"
                    rows={2}
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  />
                </div>

                {/* Availability Section */}
                <div>
                  <Label className="text-slate-700 font-medium mb-3 block">Availability Schedule</Label>
                  
                  {/* Add Time Slot */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <Label className="text-sm text-slate-600">Day</Label>
                        <Select
                          value={newTimeSlot.day}
                          onValueChange={(value) => setNewTimeSlot({ ...newTimeSlot, day: value })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {weekDays.map((day) => (
                              <SelectItem key={day} value={day} className="capitalize">
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-slate-600">Start Time</Label>
                        <Input
                          type="time"
                          className="text-sm"
                          value={newTimeSlot.start}
                          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-slate-600">End Time</Label>
                        <Input
                          type="time"
                          className="text-sm"
                          value={newTimeSlot.end}
                          onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end: e.target.value })}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTimeSlot}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Slot
                      </Button>
                    </div>
                  </div>

                  {/* Current Availability */}
                  <div className="space-y-3">
                    {weekDays.map(day => (
                      formData.availability[day]?.length > 0 && (
                        <div key={day} className="border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-700 capitalize">{day}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.availability[day].map((slot, index) => (
                              <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1">
                                <Clock className="h-3 w-3 text-blue-600" />
                                <span className="text-sm text-blue-700">{slot.start} - {slot.end}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTimeSlot(day, index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {formLoading ? "Saving..." : editingRoom ? "Update Room" : "Save Room"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Rooms List */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader className="border-b border-slate-200/50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  All Rooms
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {rooms.length} rooms available in the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white/60 rounded-xl border border-slate-200/50 overflow-hidden">
              <DataTable data={rooms} columns={columns} searchKey="name" loading={loading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
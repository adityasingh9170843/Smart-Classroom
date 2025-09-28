import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function FacultyForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    department: initialData?.department || "",
    specialization: initialData?.specialization || [],
    maxHoursPerWeek: initialData?.maxHoursPerWeek || 20,
    availability: initialData?.availability || daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {}),
    preferences: initialData?.preferences || { preferredTimeSlots: [], avoidTimeSlots: [] }
  })

  const [specializationInput, setSpecializationInput] = useState("")
  const [timeSlotInput, setTimeSlotInput] = useState({ day: "", start: "", end: "" })
  const [preferredInput, setPreferredInput] = useState("")
  const [avoidInput, setAvoidInput] = useState("")

  // Reset form when initialData changes (Edit case)
  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      department: initialData?.department || "",
      specialization: initialData?.specialization || [],
      maxHoursPerWeek: initialData?.maxHoursPerWeek || 20,
      availability: initialData?.availability || daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {}),
      preferences: initialData?.preferences || { preferredTimeSlots: [], avoidTimeSlots: [] }
    })
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addSpecialization = () => {
    const spec = specializationInput.trim()
    if (spec && !formData.specialization.includes(spec)) {
      setFormData((prev) => ({ ...prev, specialization: [...prev.specialization, spec] }))
      setSpecializationInput("")
    }
  }

  const removeSpecialization = (spec) => {
    setFormData((prev) => ({ ...prev, specialization: prev.specialization.filter((s) => s !== spec) }))
  }

  const addTimeSlot = () => {
    const { day, start, end } = timeSlotInput
    if (!day || !start || !end) return
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], { start, end }]
      }
    }))
    setTimeSlotInput({ day: "", start: "", end: "" })
  }

  const removeTimeSlot = (day, index) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((_, i) => i !== index)
      }
    }))
  }

  const addPreference = (type, value) => {
    if (!value.trim()) return
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: [...prev.preferences[type], value.trim()]
      }
    }))
    type === "preferredTimeSlots" ? setPreferredInput("") : setAvoidInput("")
  }

  const removePreference = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: prev.preferences[type].filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?._id ? "Edit Faculty" : "Add New Faculty"}</CardTitle>
        <CardDescription>Fill in faculty details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div>
            <Label>Department</Label>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
          </div>

          <div>
            <Label>Max Hours/Week</Label>
            <Input type="number" value={formData.maxHoursPerWeek} onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: Number(e.target.value) })} min={1} max={40} required />
          </div>

          {/* Specialization */}
          <div>
            <Label>Specialization</Label>
            <div className="flex gap-2">
              <Input value={specializationInput} onChange={(e) => setSpecializationInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())} />
              <Button type="button" onClick={addSpecialization} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialization.map((spec) => (
                <Badge key={spec} className="flex items-center gap-1">{spec}<X onClick={() => removeSpecialization(spec)} className="h-3 w-3 cursor-pointer" /></Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label>Availability</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <select value={timeSlotInput.day} onChange={(e) => setTimeSlotInput({ ...timeSlotInput, day: e.target.value })} className="border p-2 rounded">
                <option value="">Select Day</option>
                {daysOfWeek.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
              <Input type="time" value={timeSlotInput.start} onChange={(e) => setTimeSlotInput({ ...timeSlotInput, start: e.target.value })} />
              <Input type="time" value={timeSlotInput.end} onChange={(e) => setTimeSlotInput({ ...timeSlotInput, end: e.target.value })} />
              <Button type="button" onClick={addTimeSlot} variant="outline">Add</Button>
            </div>
            {daysOfWeek.map((day) => (
              <div key={day} className="mt-1 flex gap-2 flex-wrap">
                {formData.availability[day]?.map((slot, idx) => (
                  <Badge key={idx} className="flex items-center gap-1">
                    {day.charAt(0).toUpperCase() + day.slice(1)}: {slot.start}-{slot.end} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTimeSlot(day, idx)} />
                  </Badge>
                ))}
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div>
            <Label>Preferred Time Slots</Label>
            <div className="flex gap-2">
              <Input value={preferredInput} onChange={(e) => setPreferredInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreference("preferredTimeSlots", preferredInput))} />
              <Button type="button" onClick={() => addPreference("preferredTimeSlots", preferredInput)} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.preferences.preferredTimeSlots.map((slot, idx) => (
                <Badge key={idx} className="flex items-center gap-1">{slot}<X className="h-3 w-3 cursor-pointer" onClick={() => removePreference("preferredTimeSlots", idx)} /></Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Avoid Time Slots</Label>
            <div className="flex gap-2">
              <Input value={avoidInput} onChange={(e) => setAvoidInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreference("avoidTimeSlots", avoidInput))} />
              <Button type="button" onClick={() => addPreference("avoidTimeSlots", avoidInput)} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.preferences.avoidTimeSlots.map((slot, idx) => (
                <Badge key={idx} className="flex items-center gap-1">{slot}<X className="h-3 w-3 cursor-pointer" onClick={() => removePreference("avoidTimeSlots", idx)} /></Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save Faculty"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

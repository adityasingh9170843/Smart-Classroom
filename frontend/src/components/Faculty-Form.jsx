

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function FacultyForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    specialization: [],
    maxHoursPerWeek: 20,
  })
  const [specializationInput, setSpecializationInput] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
    
    setFormData({
      name: "",
      email: "",
      department: "",
      specialization: [],
      maxHoursPerWeek: 20,
    })
    setSpecializationInput("")
  }

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specialization.includes(specializationInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, specializationInput.trim()],
      }))
      setSpecializationInput("")
    }
  }

  const removeSpecialization = (specialization) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== specialization),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Faculty</CardTitle>
        <CardDescription>Add a new faculty member to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Dr. Sarah Johnson"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., sarah.johnson@university.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxHours">Maximum Hours Per Week</Label>
            <Input
              id="maxHours"
              type="number"
              value={formData.maxHoursPerWeek}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxHoursPerWeek: Number(e.target.value) }))}
              min="1"
              max="40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Specialization Areas</Label>
            <div className="flex gap-2">
              <Input
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                placeholder="e.g., Machine Learning"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization} variant="outline">
                Add
              </Button>
            </div>
            {formData.specialization.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialization.map((spec) => (
                  <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialization(spec)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Faculty"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

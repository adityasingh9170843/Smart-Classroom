"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function CourseForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: 3,
    department: "",
    semester: 1,
    year: new Date().getFullYear(),
    description: "",
    prerequisites: [],
  })
  const [prerequisiteInput, setPrerequisiteInput] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(formData)
    // Reset form
    setFormData({
      name: "",
      code: "",
      credits: 3,
      department: "",
      semester: 1,
      year: new Date().getFullYear(),
      description: "",
      prerequisites: [],
    })
    setPrerequisiteInput("")
  }

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }))
      setPrerequisiteInput("")
    }
  }

  const removePrerequisite = (prerequisite) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prerequisite),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Course</CardTitle>
        <CardDescription>Create a new course for the academic schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Data Structures and Algorithms"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., CS201"
                required
              />
            </div>
          </div>

          {/* Credits, Semester, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Select
                value={formData.credits.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, credits: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((c) => (
                    <SelectItem key={c} value={c.toString()}>
                      {c} Credit{c > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Business"].map(
                  (dep) => (
                    <SelectItem key={dep} value={dep}>
                      {dep}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the course content and objectives"
              rows={3}
            />
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <div className="flex gap-2">
              <Input
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                placeholder="e.g., CS101"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
              />
              <Button type="button" onClick={addPrerequisite} variant="outline">
                Add
              </Button>
            </div>
            {formData.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.prerequisites.map((pre) => (
                  <Badge key={pre} variant="secondary" className="flex items-center gap-1">
                    {pre}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removePrerequisite(pre)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

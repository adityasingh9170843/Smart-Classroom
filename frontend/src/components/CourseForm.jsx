

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function CourseForm({ initialData = null, onSubmit, loading }) {
  const defaultData = {
    code: "",
    name: "",
    department: "",
    credits: 3,
    semester: 1,
    year: new Date().getFullYear(),
    description: "",
    prerequisites: [],
    type: "lecture",
    hoursPerWeek: 3,
  }

  const [formData, setFormData] = useState(defaultData)
  const [prerequisiteInput, setPrerequisiteInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        name: initialData.name || "",
        department: initialData.department || "",
        credits: initialData.credits ?? 3,
        semester: initialData.semester ?? 1,
        year: initialData.year ?? new Date().getFullYear(),
        description: initialData.description || "",
        prerequisites: initialData.prerequisites || [],
        type: initialData.type || "lecture",
        hoursPerWeek: initialData.hoursPerWeek ?? 3,
      })
    } else {
      setFormData(defaultData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "credits" || name === "semester" || name === "year" || name === "hoursPerWeek" ? Number(value) : value,
    }))
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPrerequisite()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-cyan-900/20 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-blue-500/10 rounded-2xl" />

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Code */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Course Code *</label>
              <div className="relative">
                <Input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., CS101"
                  required
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Department *</label>
              <div className="relative">
                <Input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  required
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Course Name */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Course Name *</label>
            <div className="relative">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Introduction to Programming"
                required
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Credits */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Credits *</label>
              <div className="relative">
                <Input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Semester */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Semester *</label>
              <div className="relative">
                <Input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  min="1"
                  max="8"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Academic Year *</label>
              <div className="relative">
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="2020"
                  max="2030"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Hours per week */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Hours / Week *</label>
              <div className="relative">
                <Input
                  type="number"
                  name="hoursPerWeek"
                  value={formData.hoursPerWeek}
                  onChange={handleChange}
                  required
                  min="1"
                  max="40"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Type *</label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                required
              >
                <option value="lecture" className="bg-slate-800 text-white">
                  Lecture
                </option>
                <option value="lab" className="bg-slate-800 text-white">
                  Lab
                </option>
                <option value="tutorial" className="bg-slate-800 text-white">
                  Seminar
                </option>
              </select>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Description</label>
            <div className="relative">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description..."
                rows={4}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15 resize-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-200 mb-2 tracking-wide">Prerequisites</label>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter prerequisite course code"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-white/15"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPrerequisite}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 px-6 rounded-xl"
                >
                  Add
                </Button>
              </div>

              {formData.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.prerequisites.map((prerequisite, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-100 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
                    >
                      {prerequisite}
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prerequisite)}
                        className="ml-1 hover:bg-red-400/20 rounded-full p-1 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 rounded-xl font-semibold tracking-wide hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : initialData ? (
                "Update Course"
              ) : (
                "Add Course"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  };

  const [formData, setFormData] = useState(defaultData);
  const [prerequisiteInput, setPrerequisiteInput] = useState("");

  // Prefill form when editing — reset to defaults when initialData is null
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
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "credits" || name === "semester" || name === "year" 
        ? Number(value) 
        : value
    }));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (prerequisite) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prerequisite)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPrerequisite();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Course Code *
          </label>
          <Input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., CS101"
            required
            className="w-full"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Department *
          </label>
          <Input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
            required
            className="w-full"
          />
        </div>
      </div>

      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Course Name *
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Introduction to Programming"
          required
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Credits */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Credits *
          </label>
          <Input
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            required
            min="1"
            max="10"
            className="w-full"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Semester *
          </label>
          <Input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            min="1"
            max="8"
            className="w-full"
          />
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Academic Year *
          </label>
          <Input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="2020"
            max="2030"
            className="w-full"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter course description..."
          rows={4}
          className="w-full"
        />
      </div>

      {/* Prerequisites */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Prerequisites
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              value={prerequisiteInput}
              onChange={(e) => setPrerequisiteInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter prerequisite course code"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addPrerequisite}
              className="px-4"
            >
              Add
            </Button>
          </div>
          
          {formData.prerequisites.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.prerequisites.map((prerequisite, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {prerequisite}
                  <button
                    type="button"
                    onClick={() => removePrerequisite(prerequisite)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Saving..." : initialData ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </form>
  );
}
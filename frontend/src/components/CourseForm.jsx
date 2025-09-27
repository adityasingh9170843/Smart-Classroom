import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CourseForm({ initialData = null, onSubmit, loading }) {
  const defaultData = {
    code: "",
    name: "",
    department: "",
    credits: 3,
    semester: 1,
  };

  const [formData, setFormData] = useState(defaultData);

  // Prefill form when editing — reset to defaults when initialData is null
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        name: initialData.name || "",
        department: initialData.department || "",
        credits: initialData.credits ?? 3,
        semester: initialData.semester ?? 1,
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "credits" || name === "semester" ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Course Code */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Credits */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
        <input
          type="number"
          name="credits"
          value={formData.credits}
          onChange={handleChange}
          required
          min="1"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Semester */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
        <input
          type="number"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          min="1"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        {loading ? "Saving..." : initialData ? "Update Course" : "Add Course"}
      </Button>
    </form>
  );
}

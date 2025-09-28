
import Dashboard from "./pages/Dashboard"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CoursesPage from "./pages/Courses"
import FacultyPage from "./pages/Faculty"
import RoomPage from "./pages/Rooms"
import TimetablePage from "./pages/Timetable"
function App() {
 

  return (
    
   <Router>
   <Routes>
   <Route path="/" element={<Dashboard />} />
   <Route path="/courses" element={<CoursesPage />} />
   <Route path="/faculty" element={<FacultyPage />} />
   <Route path="/rooms" element={<RoomPage />} />
   <Route path="/timetables" element={<TimetablePage />} />
   </Routes>
   </Router>  
    
  )
}

export default App

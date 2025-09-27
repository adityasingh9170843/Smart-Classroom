
import Dashboard from "./pages/Dashboard"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CoursesPage from "./pages/Courses"
function App() {
 

  return (
    
   <Router>
   <Routes>
   <Route path="/" element={<Dashboard />} />
   <Route path="/courses" element={<CoursesPage />} />
   </Routes>
   </Router>  
    
  )
}

export default App

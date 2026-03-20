// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DonationPage from './pages/DonationPage'
import ProgramsPage from './pages/ProgramsPage'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/programs" element={<ProgramsPage />} />



      </Routes>
    </BrowserRouter>
  )
}

export default App
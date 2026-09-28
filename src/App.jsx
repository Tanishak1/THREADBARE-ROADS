import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Explore from './pages/Explore'
import CityDetail from './pages/CityDetail'
import HotelBooking from './pages/HotelBooking'
import Transport from './pages/Transport'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import NotFound from './pages/NotFound'
import AIPlannerForm from './components/AIPlannerForm'
import VendorRegistration from './components/VendorRegistration'
import VendorRegistrationPage from './components/VendorRegistrationPage'
import VendorLogin from './components/VendorLogin'
import VendorDashboard from './components/VendorDashboard'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/city/:cityId" element={<CityDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/plan" element={<AIPlannerForm />} />
            <Route path="/vendor" element={<VendorLogin />} />
            <Route path="/talk" element={<VendorRegistration mode="talk" />} />
            <Route path="/vendor/register" element={<VendorRegistrationPage />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route
              path="/stay"
              element={
                <ProtectedRoute>
                  <HotelBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/move"
              element={
                <ProtectedRoute>
                  <Transport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

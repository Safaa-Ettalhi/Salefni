import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Simulation from './pages/Simulation'
import Application from './pages/Application'
import Admin from './pages/admin/Admin'
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail'
import Layout from './components/layout/Layout'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/application/:simulationId" element={<Application />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App

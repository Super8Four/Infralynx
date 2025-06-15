import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Racks from './pages/Racks'
import Sites from './pages/Sites'
import IPManagement from './pages/IPManagement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="app-container">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-wrapper">
          <Sidebar isOpen={sidebarOpen} />
          <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Container fluid>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/racks" element={<Racks />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/ip-management" element={<IPManagement />} />
              </Routes>
            </Container>
          </main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

export default App

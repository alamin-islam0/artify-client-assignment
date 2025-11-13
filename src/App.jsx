import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/NavBar'

function App() {

  return (
    <div className="min-h-screen">
      <header>
        <Navbar/>
      </header>
      <Outlet/>
    </div>
)}

export default App

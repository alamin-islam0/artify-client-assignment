import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/NavBar'
import Footer from './components/Footer'

function App() {

  return (
    <div className="min-h-screen">
      <header>
        <Navbar/>
      </header>
      <Outlet/>
      <footer>
        <Footer/>
      </footer>
    </div>
)}

export default App

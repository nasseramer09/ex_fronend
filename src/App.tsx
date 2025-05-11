import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  

  return (
    <>
    <Routes>

    <Route path='/' element={<Login/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/home' element = {<Home/>}/>
    <Route path='/dashboard' element = {<Dashboard/>}/>
    </Routes>
    </>
  )
}

export default App

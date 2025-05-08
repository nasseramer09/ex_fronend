import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  

  return (
    <>
    <Routes>

    <Route path='/' element={<Login/>}/>
    <Route path='/login' element={<Login/>}/>
    </Routes>
    </>
  )
}

export default App

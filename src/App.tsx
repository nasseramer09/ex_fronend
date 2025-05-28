import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import EditTask from './components/EditTask'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element = {<Home/>}/>
      <Route path='/dashboard' element = {<Dashboard/>}/>
      <Route path='/adminPanel' element = {<AdminPanel/>}/>
      <Route path='/tasks/:taskId/edit' element = {<EditTask/>}/>
    </Routes>
    </>
  )
}

export default App

import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import EditTask from './components/EditTask';
import PrivateRoute from './components/PrivateRoutes';
import UserDetail from './components/UserDetails';
import Calendar from './pages/Calendar';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route path='/home' element={<Home />} />
                    <Route path='/calendar' element={<Calendar />} />
                </Route>

                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                    <Route path='/adminPanel' element={<AdminPanel />} />
                    <Route path='/tasks/:taskId/edit' element={<EditTask />} />
                    
                    <Route path='/admin/users/:userId' element={<UserDetail />} />
                </Route>

                <Route path="*" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
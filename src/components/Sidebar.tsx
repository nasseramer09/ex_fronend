import "./styles/sidebar.css"
import logo from "../assets/logo.png"
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';


interface SideBarProps{
    isOpen : boolean;
    onClose: ()=> void;
    isSmallScreen:boolean;
}

    const Sidebar: React.FC<SideBarProps> = ({isOpen, onClose, isSmallScreen})=>{
    const navigate  = useNavigate();
    const { userRole } = useAuth();

    const handleLogout = ()=>{ localStorage.removeItem("access_token"); navigate("/login") }
    
    const handleNavigation = (path: string) => {
        navigate(path);
        if (isSmallScreen) {
            onClose();
        }
    };

    return (
        <> 
        {isOpen && isSmallScreen &&(
            <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left:0,
                width:"100vw",
                height:"100vh",
                backgroundColor: "rgba(0,0,0.3)",
                zIndex:10

            }}
            />
        )}
        <div className={`sidebar ${isOpen ? "open":""}`}>

            <div className="sidebar-header">
                <div className="logo">
                  <img src={logo} alt="Maham logo"
                   className="logo-img" /> MAHAM 
                </div>

                {isOpen &&(
                    <button className="close-button" onClick={onClose}> 
                        {isSmallScreen ? <span aria-hidden="true"> X </span> : <FaTimes size={24} color="white" />}
                    </button>
                )}
            </div>
                <ul className="nav-links">
                    <li> <Link to="/home" onClick={() => handleNavigation('/home')}> Home  </Link> </li>
                    <li> <Link to="/calendar" onClick={() => handleNavigation('/calendar')}> Kalender  </Link> </li>
                    <li> <Link to="/adminPanel" onClick={() => handleNavigation('/adminPanel')}> Admin Panel  </Link> </li>

                    {userRole === 'admin' && (
                        <>
                            <li> <Link to="/admin/users" onClick={() => handleNavigation('/admin/users')}> Användare </Link> </li>
                        </>
                    )}
                </ul>

            <div className="logout-div">
                <button className="loggaut" onClick={handleLogout}> Logga ut </button>
            </div>
</div>
       </>
    );
}

export default Sidebar
import "./styles/sidebar.css"
import logo from "../assets/logo.png"
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


interface SideBarProps{
    isOpen : boolean;
    onClose: ()=> void;
    isSmallScreen:boolean;
}

const Sidebar: React.FC<SideBarProps> = ({isOpen, onClose, isSmallScreen})=>{
    
    const navigate  = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/login")
    }


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
                    <li> <a href="/home"> Home </a> </li>
                    <li> <a href="/dashboard"> Dashboard</a> </li>
                    <li> <a href="#"> Planera uppdrag</a> </li>
                    <li> <a href="#"> Kalender</a> </li>
                    <li> <a href="/adminPanel"> Admin Panel</a> </li>
                </ul>
            

            

            <div className="logout-div">
                <button className="loggaut" onClick={handleLogout}> Logga ut </button>
            </div>
</div>
       </>
    );
}

export default Sidebar
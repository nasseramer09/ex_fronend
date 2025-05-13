import { FaUserCircle } from "react-icons/fa";
import "./styles/sidebar.css"

interface SideBarProps {
    isOpen: boolean;
    onClose: ()=> void;
}
const Sidebar: React.FC<SideBarProps> = ({ isOpen, onClose })=>{

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-right">
                            <div className="profile">
                                <FaUserCircle size={30} color="white" />
                            </div>
                        </div>
                        
            <button className="close-button" onClick={onClose}>
            <span aria-hidden="true"> X </span> </button>

            <ul className="sidebar-nav">
                <li> <a href="/home"> Home </a> </li>
                    <li> <a href="/dashboard"> Dashboard</a> </li>
                    <li> <a href="#"> Planera uppdrag</a> </li>
                    <li> <a href="#"> Kalender</a> </li>
                    <li> <a href="#"> Admin panel</a> </li>
            </ul>


                        
            
                        <div className="logout-div">
                            <button className="loggaut"> Logga ut </button>
                        </div>
        </div>

        
    );
}

export default Sidebar;
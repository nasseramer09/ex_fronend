import "./styles/navbar.css"
import logo from "../assets/logo.png"
import { FaUserCircle } from "react-icons/fa";



export default function Navbar(){
    return (

        <div className="navbar">
            <div className="navbar-left">
                <div className="logo">
                <img src={logo} alt="Maham logo" className="logo-img" /> MAHAM </div>
            </div>

            <div className="navbar-center">
                <ul className="nav-links">
                    <li> <a href="/home"> Home </a> </li>
                    <li> <a href="/dashboard"> Dashboard</a> </li>
                    <li> <a href="#"> Planera uppdrag</a> </li>
                    <li> <a href="#"> Kalender</a> </li>
                    <li> <a href="#"> Admin panel</a> </li>
                </ul>
            </div>

            <div className="navbar-right">
                <div className="profile">
                    <FaUserCircle size={30} color="white" />
                </div>
            </div>

            <div className="logout-div">
                <button className="loggaut"> Logga ut </button>
            </div>

        </div>
    );
}
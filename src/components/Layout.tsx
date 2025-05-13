import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./styles/layout.css"
import Sidebar from "./Sidebar";
import {FaBars} from 'react-icons/fa'

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [isSidebarOpen, setisSidebarOpen] = useState(false);
    const [isSmalScreen, setisSmalScreen] = useState(window.innerWidth < 768);
    
    const toggleSidebar = () => {
        setisSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        setisSidebarOpen(false);
    };

    useEffect(()=>{
        const handleResize = () => {
            setisSmalScreen(window.innerWidth < 768);

            if (!isSmalScreen){
                setisSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return() =>{
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (

        <div className="layout-container">

            {isSmalScreen ? (

                <>
                <div className="small-screen-header">
                    <button className="hamburger-menu" onClick={toggleSidebar}>
                        <FaBars size={24} color = "#fff" />
                    </button>
                    {<h1> MAHAM </h1>}
                </div>
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                </>
            ):(
                <Navbar />
            )}

            <div className="content-wrapper" style={{marginLeft: isSmalScreen && isSidebarOpen ? '300px':'0'}}>
             <main className="main-content">
                {children}
             </main>
            </div>
            
        </div>
    );
}

export default Layout
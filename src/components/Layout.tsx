import { useEffect, useState } from "react";
import "./styles/layout.css"
import Sidebar from './Sidebar'
import {FaBars} from 'react-icons/fa'

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [isSidebarOpen, setisSidebarOpen] = useState(false);
    const [isSmalScreen, setisSmalScreen] = useState(window.innerWidth < 400);
    
    const toggleSidebar = () => { setisSidebarOpen(!isSidebarOpen);};
    
    const closeSidebar = () => { setisSidebarOpen(false);};

    useEffect(()=>{
        const handleResize = () => {
            const isSmall = window.innerWidth < 768;
            setisSmalScreen(isSmall);
        };

        window.addEventListener('resize', handleResize);

        return() =>{
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (

        <div className="layout-container">

                <div className="header-bar">
                    <div className="navbar">
                        <button className="menu-button" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                    </div>
                    <Sidebar isOpen={isSidebarOpen} 
                             onClose={closeSidebar}
                             isSmallScreen={isSmalScreen}/>
                </div> 

            <div className="content-wrapper" 
            style={{marginLeft: !isSmalScreen && isSidebarOpen ? "300px" : '0', 
                transition:"margin-left 0.3s ease",
                filter: isSmalScreen && isSidebarOpen ? "blur(2px)": "none",
                pointerEvents: isSmalScreen && isSidebarOpen ? "none" : "auto"
            }}>
             
             <main className="main-content">
                {children}
             </main>
            </div>
            
        </div>
    );
}

export default Layout
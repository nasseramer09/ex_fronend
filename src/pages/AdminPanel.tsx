import { useState } from "react";
import Layout from "../components/Layout";
import Tasks from "../components/Tasks";
import Users from "../components/Users";
import "./styles/admin_panel.css";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState("tasks");
    const renderTab = () => {
        switch (activeTab) {
            case "tasks":
                return <Tasks />;
            case "users":
                return <Users />;
            default:
                return <Tasks />;
        }
    };

    return (
        <Layout>
            <div className="dashboard-container">
                <div className="tab-buttons">
                    <button
                        className={`tablink ${activeTab === "tasks" ? "active" : ""}`}
                        onClick={() => setActiveTab("tasks")}
                    >Uppdrag</button>

                    <button className={`tablink ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => setActiveTab("users")} >
                        Användare
                    </button>
                </div>
                <div className="tabcontent">
                    {renderTab()}
                </div>
            </div>
        </Layout>
    );
}
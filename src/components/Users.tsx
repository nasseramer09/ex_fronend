import { useState } from "react";
import "./styles/tasks.css";
import { FaPlus } from "react-icons/fa";
import GetUsers from "./GetUsers";
import CreateAccount from "./CreateAccount";

export default function Users() {
    const [activeTab, setActiveTab] = useState("viewUsers");

    const renderTab = () => {
        switch (activeTab) {
            case "viewUsers":
                return <GetUsers />;
            case "createAccount":
                return <CreateAccount />;
            default:
                return <GetUsers />;
        }
    };

    return (
        <>
            <div className="buttonWrapper">
                <div className="taskTab-buttons">
                    <button
                        className={`tablink ${activeTab === "viewUsers" ? "active" : ""}`}
                        onClick={() => setActiveTab("viewUsers")}
                    >
                        Se Användare
                    </button>
                </div>

                <div className="taskTab-buttons">
                    <button
                        className={`tablink ${activeTab === "createAccount" ? "active" : ""}`}
                        onClick={() => setActiveTab("createAccount")}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>

            <div className="taskTabContent">
                {renderTab()}
            </div>
        </>
    );
}
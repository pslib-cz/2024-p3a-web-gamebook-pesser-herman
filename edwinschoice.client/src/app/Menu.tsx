import React from "react";
import { useNavigate } from "react-router-dom";

const Menu: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome to the Game</h2>
            <button onClick={() => navigate("/locname1")} style={{ fontSize: "20px", padding: "10px" }}>
                Start navigating locations???
            </button>
        </div>
    );
};

export default Menu;
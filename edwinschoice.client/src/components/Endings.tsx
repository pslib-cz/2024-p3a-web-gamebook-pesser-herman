import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL; // API base URL

interface Ending {
    endingsId: number;
    endingName: string;
    endingDescription: string;
    endingImagePath: string;
    locationsId: number;
}

const Ending: React.FC = () => {
    const [endings, setEndings] = useState<Ending[]>([]);
    const [reachedLocations, setReachedLocations] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEndings();
        checkReachedLocations();
    }, []);

    // Fetch all endings from the API
    const fetchEndings = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/Endings`);
            if (!response.ok) throw new Error("Failed to fetch endings");

            const data: Ending[] = await response.json();
            setEndings(data);
        } catch (error) {
            console.error("Error fetching endings:", error);
        }
    };

    // Check local storage for reached locations
    const checkReachedLocations = () => {
        const savedLocations = localStorage.getItem("reachedLocations");
        if (savedLocations) {
            setReachedLocations(JSON.parse(savedLocations));
        }
    };

    return (
        <div className="ending-container">
            <h1>Endings</h1>
            <div className="endings-grid">
                {endings.map((ending) => {
                    const isUnlocked = reachedLocations.includes(ending.locationsId);
                    return (
                        <div key={ending.endingsId} className="ending-card">
                            <img
                                src={`${apiUrl}/endings/${isUnlocked ? ending.endingImagePath : "lock.png"}`}
                                alt={ending.endingName}
                                className="ending-image"
                            />
                            <h2>{ending.endingName}</h2>
                            <p>{isUnlocked ? ending.endingDescription : "Locked Ending"}</p>
                        </div>
                    );
                })}
            </div>
            <button onClick={() => navigate("/")}>Back to Menu</button>
        </div>
    );
};

export default Ending;
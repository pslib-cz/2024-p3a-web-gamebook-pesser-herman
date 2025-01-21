import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

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
    const location = useLocation();

    useEffect(() => {
        fetchEndings();
        checkReachedLocations();
    }, []);


    useEffect(() => {
        const savedLocations = localStorage.getItem("reachedLocations");
        const parsedLocations = savedLocations ? JSON.parse(savedLocations) : [];
        console.log("Loaded reachedLocations:", parsedLocations);
        setReachedLocations(parsedLocations);
    }, [location]);

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

    const checkReachedLocations = () => {
        const savedLocations = localStorage.getItem("reachedLocations");
        if (savedLocations) {
            setReachedLocations(JSON.parse(savedLocations));
        }
    };

    return (
        <div className="ending-container">
            <h1>Konce</h1>
            <div className="endings-grid">
                {endings.map((ending) => {
                    const isUnlocked = reachedLocations.includes(ending.locationsId);
                    return (
                        <div key={ending.endingsId} className="ending-card">
                            <img
                                src={`${apiUrl}${isUnlocked
                                    ? (ending.endingImagePath.startsWith("/")
                                        ? ending.endingImagePath
                                        : "/endings/" + ending.endingImagePath)
                                    : "/endings/lock.png"
                                    }`}
                                alt={ending.endingName}
                                className="ending-image"
                            />
                            <h2>{ending.endingName}</h2>
                            <p>{ending.endingDescription}</p>
                        </div>
                    );
                })}
            </div>
            <button onClick={() => navigate("/")}>Zpìt do menu.</button>
        </div>
    );
};

export default Ending;
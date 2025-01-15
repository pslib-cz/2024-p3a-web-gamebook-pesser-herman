import React, { useEffect, useState } from "react";
import { usePlayer } from "./PlayerComponent";
import './Endings.css';

interface Ending {
    endingsId: number;
    endingName: string;
    endingDescription: string;
    endingImagePath: string;
    locationsId: number;
}

const apiUrl = import.meta.env.VITE_API_URL;

const Endings: React.FC = () => {
    const [endings, setEndings] = useState<Ending[]>([]);
    const { isItemInInventory } = usePlayer(); 

    useEffect(() => {
        fetch(`${apiUrl}/api/Endings`)
            .then((response) => response.json())
            .then(setEndings)
            .catch(console.error);
    }, []);

    const hasVisitedLocation = (locationId: number): boolean => {
        return isItemInInventory(locationId); 
    };

    return (
        <div className="endings-container">
            <h1>Endings</h1>
            <div className="endings-grid">
                {endings.map((ending) => (
                    <div key={ending.endingsId} className="ending-card">
                        <img
                            src={
                                hasVisitedLocation(ending.locationsId)
                                    ? `${apiUrl}${ending.endingImagePath}`
                                    : `${apiUrl}/endings/lock.png`
                            }
                            alt={ending.endingName}
                            className="ending-image"
                        />
                        <h2>{hasVisitedLocation(ending.locationsId) ? ending.endingName : "Locked Ending"}</h2>
                        {hasVisitedLocation(ending.locationsId) && (
                            <p>{ending.endingDescription}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Endings;
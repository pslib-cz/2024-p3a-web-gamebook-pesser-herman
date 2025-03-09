import React, { useEffect, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Endings.css';

const apiUrl = import.meta.env.VITE_API_URL;

interface Ending {
    endingsId: number;
    endingName: string;
    endingDescription: string;
    endingImagePath: string;
    locationsId: number;
}

interface State {
    endings: Ending[];
    reachedLocations: number[];
}

const initialState: State = {
    endings: [],
    reachedLocations: []
};

type Action =
    | { type: "SET_ENDINGS"; payload: Ending[] }
    | { type: "SET_REACHED_LOCATIONS"; payload: number[] };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_ENDINGS":
            return { ...state, endings: action.payload };
        case "SET_REACHED_LOCATIONS":
            return { ...state, reachedLocations: action.payload };
        default:
            return state;
    }
};

const Ending: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchEndings = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/Endings`);
                if (!response.ok) throw new Error("Failed to fetch endings");

                const data: Ending[] = await response.json();
                dispatch({ type: "SET_ENDINGS", payload: data });
            } catch (error) {
                console.error("Error fetching endings:", error);
            }
        };

        fetchEndings();
    }, []);

    useEffect(() => {
        const savedLocations = localStorage.getItem("reachedLocations");
        const parsedLocations = savedLocations ? JSON.parse(savedLocations) : [];
        dispatch({ type: "SET_REACHED_LOCATIONS", payload: parsedLocations });
    }, [location]);

    return (
        <div className="ending-container" style={{ backgroundImage: `url(${apiUrl}/images/endings_background.webp)` }}>
            <h1>Konce</h1>
            <div className="endings-grid">
                {state.endings.map((ending) => {
                    const isUnlocked = state.reachedLocations.includes(ending.locationsId);
                    return (
                        <div key={ending.endingsId} className="ending-card">
                            <img
                                src={`${apiUrl}${isUnlocked
                                    ? (ending.endingImagePath.startsWith("/")
                                        ? ending.endingImagePath
                                        : "/endings/" + ending.endingImagePath)
                                    : "/endings/lock.png"
                                    }`}
                                className="ending-image"
                            />
                            <div className="ending-card-text">
                                <h2>{ending.endingName}</h2>
                                <p>{ending.endingDescription}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="back_to_menu_button" onClick={() => navigate("/")}>Back to menu.</button>
        </div>
    );
};

export default Ending;

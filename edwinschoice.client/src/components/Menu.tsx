import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInventory, initialState } from "./PlayerComponent";
import "./Menu.css";

const apiUrl = import.meta.env.VITE_API_URL;

function Menu() {
    const navigate = useNavigate();
    const { lastLocation, dispatch } = useInventory();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useEffect(() => {
        if (lastLocation !== null) {
            setHasSavedGame(true);
        }
    }, [lastLocation]);

    const handleContinue = () => {
        if (lastLocation !== null) {
            navigate(`/location/${lastLocation}`);
        }
    };

    const handleNewGame = () => {
        localStorage.removeItem("gameState");
        dispatch({ type: "LOAD_GAME", payload: initialState });
        navigate("/location/1");
    };

    return (
        <div
            className="menu_background"
            style={{ backgroundImage: `url(${apiUrl}/images/Castle_image.webp)` }}
        >
            <div className="menu_container">
                <h1 className="menu_title">Edwin's Choice</h1>
            </div>

            <button className="button" onClick={handleNewGame}>
                New Game
            </button>

            {hasSavedGame && (
                <button className="button" onClick={handleContinue}>
                    Continue
                </button>
            )}

            <Link to="/endings">
                <button className="button">Endings</button>
            </Link>
        </div>
    );
}

export default Menu;
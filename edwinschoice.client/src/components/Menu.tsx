import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Menu.css";

const apiUrl = import.meta.env.VITE_API_URL;

function Menu() {
    const navigate = useNavigate();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useEffect(() => {
        const savedGame = localStorage.getItem("gameState");
        if (savedGame) {
            setHasSavedGame(true);
        }
    }, []);

    const handleContinue = () => {
        const savedGame = localStorage.getItem("gameState");
        if (savedGame) {
            const { savedLocation } = JSON.parse(savedGame);
            if (savedLocation !== null) {
                navigate(`/location/${savedLocation}`);
            }
        }
    };

    const handleNewGame = () => {
        localStorage.removeItem("gameState"); 
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
                Nová hra
            </button>

            {hasSavedGame && (
                <button className="button" onClick={handleContinue}>
                    Pokraèovat
                </button>
            )}

            <Link to="/endings">
                <button className="button">Konce</button>
            </Link>
        </div>
    );
}

export default Menu;
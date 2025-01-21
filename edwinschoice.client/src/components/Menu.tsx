import { Link } from 'react-router-dom';
import './Menu.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Menu() {
    return (
        <div
            className="menu_background"
            style={{ backgroundImage: `url(${apiUrl}/images/Castle_image.webp)` }}
        >
            <div className="menu_container">
                <h1 className="menu_title">Edwins choice</h1>
            </div>
            <Link to="/location/1">
                <button className="play_button">Nová hra</button>
            </Link>
            <Link to="/endings">
                <button className="endings_button">Konce</button>
            </Link>
        </div>
    );
}

export default Menu;

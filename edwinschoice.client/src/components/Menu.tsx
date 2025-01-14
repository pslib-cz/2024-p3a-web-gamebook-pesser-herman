import { Link } from 'react-router-dom';
import './Menu.css';

const apiUrl = import.meta.env.VITE_API_URL;

function Menu() {
    return (
        <div
            className="menu_background"
            style={{ backgroundImage: `url(${apiUrl}/images/Castle_image.webp)` }}
        >
            <div className="menu-container">
                <h1>Edwins choice</h1>
            </div>
            <Link to="/location/1">
                <button>Nová hra</button>
            </Link>
        </div>
    );
}

export default Menu;

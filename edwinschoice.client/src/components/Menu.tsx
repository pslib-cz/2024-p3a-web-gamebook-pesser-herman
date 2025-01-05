import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <div>
            <h1>Game Menu</h1>
            <Link to="/location/1">
                <button>Go to Location 1</button>
            </Link>
        </div>
    );
}

export default Menu;
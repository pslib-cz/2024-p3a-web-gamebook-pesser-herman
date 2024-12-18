import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPlayerLocation, getPlayerLocation } from '../services/PlayerService';
import { Location, Connection } from '../types';

const Locname3: React.FC = () => {
    const [data, setData] = useState<Location | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:5173/api/locations/1')
            .then((response) => response.json())
            .then((result) => {
                setData({
                    ...result,
                    image: `data:image/png;base64,${result.image}`,
                });
                setPlayerLocation(result.LocationsId);
            })
            .catch((error) => console.error('Error fetching data:', error));

        fetch('https://localhost:5173/api/locations/1/connections')
            .then((response) => response.json())
            .then((result) => setConnections(result))
            .catch((error) => console.error('Error fetching connections:', error));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (

        <div style={{ backgroundImage: `url(${data.LocationImage})` }}>
            <h2>{data.LocationName}</h2>
            <p>{data.LocationDescription}</p>
            <p>Current Location ID: {getPlayerLocation()}</p>
            <img src={data.LocationImage} alt={data.LocationName} style={{ width: '300px' }} />
            <h3>Reachable Locations</h3>
            <ul>
                {connections.map((conn) => (
                    <li key={conn.ConnectionsId}>
                        <strong>{conn.LocationName}</strong>
                        <p>{conn.LocationDescription}</p>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => navigate('/locname1')}
                style={{ fontSize: '16px', padding: '10px', marginTop: '20px' }}
            >
                Go to 1. location
            </button>
        </div>
    );
};

export default Locname3;

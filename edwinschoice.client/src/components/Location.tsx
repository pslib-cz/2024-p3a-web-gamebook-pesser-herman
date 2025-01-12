import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Location {
    locationName: string;
    locationDescription: string;
    locationImagePath: string;
    itemReobtainable: boolean | null;
    itemId: number | null;
    item: Item | null;
}

interface Item {
    itemsId: number;
    itemName: string;
    itemImagePath: string;
}

interface Connection {
    toId: number;
    locationName: string;
    locationDescription: string;
    connectionText: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

function Location() {
    const { id } = useParams<{ id: string }>();
    const [location, setLocation] = useState<Location | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/api/Locations/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch location');
                }
                return response.json();
            })
            .then((data) => setLocation(data))
            .catch((error) => console.error('Error fetching location:', error));
        fetch(`${apiUrl}/api/Locations/${id}/connections`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch connections');
                }
                return response.json();
            })
            .then((data) => setConnections(data))
            .catch((error) => console.error('Error fetching connections:', error));
    }, [id]);

    const handleNavigate = (toId: number) => {
        navigate(`/location/${toId}`);
    };

    const handleItemClick = () => {
        if (!location || !location.item) return;

        if (!location.itemReobtainable) {
            setLocation((prev) =>
                prev ? { ...prev, item: null, itemId: null } : null
            );
        }
    };

    return (
        <div>
            {location ? (
                <div>
                    <h1>{location.locationName}</h1>
                    <p>{location.locationDescription}</p>
                    {location.locationImagePath && (
                        <img
                            src={`${apiUrl}${location.locationImagePath}`}
                            alt={location.locationName}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    )}

                    {location.item && (
                        <div>
                            <h2>Item</h2>
                            <img
                                src={`${apiUrl}${location.item.itemImagePath}`}
                                alt={location.item.itemName}
                                style={{ cursor: 'pointer', maxWidth: '100px', height: 'auto' }}
                                onClick={handleItemClick}
                            />
                            <p>{location.item.itemName}</p>
                        </div>
                    )}

                    <h2>Connections</h2>
                    <ul>
                        {connections.map((connection) => (
                            <li key={connection.toId}>
                                <button onClick={() => handleNavigate(connection.toId)}>
                                    {connection.connectionText}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Location;
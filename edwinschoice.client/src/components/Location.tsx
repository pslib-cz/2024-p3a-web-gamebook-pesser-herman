import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
interface Location {
    locationName: string;
    locationDescription: string;
}
interface Connection {
    toId: number;
    locationName: string;
    locationDescription: string;
}
function Location() {
    const { id } = useParams<{ id: string }>();
    const [location, setLocation] = useState<Location | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);

    useEffect(() => {
        fetch(`/api/Locations/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch location');
                }
                return response.json();
            })
            .then((data) => setLocation(data))
            .catch((error) => console.error('Error fetching location:', error));
        fetch(`/api/Locations/${id}/connections`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch connections');
                }
                return response.json();
            })
            .then((data) => setConnections(data))
            .catch((error) => console.error('Error fetching connections:', error));
    }, [id]);
    return (
        <div>
            {location ? (
                <div>
                    <h1>{location.locationName}</h1>
                    <p>{location.locationDescription}</p>

                    <h2>Connections</h2>
                    <ul>
                        {connections.map((connection) => (
                            <li key={connection.toId}>
                                <Link to={`/location/${connection.toId}`}>
                                    {connection.locationName}
                                </Link>
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
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "./PlayerComponent";

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
    itemDescription: string;
    itemImagePath: string;
    isConsumable: boolean;
    forStory: boolean;
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
    const { addItemToInventory } = useInventory();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/api/Locations/${id}`)
            .then((response) => response.json())
            .then(setLocation)
            .catch(console.error);

        fetch(`${apiUrl}/api/Locations/${id}/connections`)
            .then((response) => response.json())
            .then(setConnections)
            .catch(console.error);
    }, [id]);

    const handleNavigate = (toId: number) => {
        navigate(`/location/${toId}`);
    };

    const handleItemClick = () => {
        if (!location || !location.item) return;

        addItemToInventory(location.item);

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
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    )}
                    {location.item && (
                        <div>
                            <h2>Pøedmìt</h2>
                            <img
                                src={`${apiUrl}${location.item.itemImagePath}`}
                                alt={location.item.itemName}
                                style={{ cursor: "pointer", maxWidth: "100px", height: "auto" }}
                                onClick={handleItemClick}
                            />
                            <p>{location.item.itemName}</p>
                        </div>
                    )}
                    <h2>Spojení</h2>
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
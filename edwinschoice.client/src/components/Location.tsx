import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "./PlayerComponent";
import './Location.css';

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
    const {
        inventory,
        playerStats,
        addItemToInventory,
        handleUseItem,
        equipItem,
    } = useInventory();
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
        <div className="the_location">
            {location ? (
                <div
                    className="location-background"
                    style={{ backgroundImage: `url(${apiUrl}${location.locationImagePath})`, height: '100vh' }}
                >
                    <div className="player-stats">
                        <h1>Inventory</h1>
                        <p>Health: {playerStats.health}</p>
                        <p>Attack: {playerStats.attack}</p>
                        <p>Defense: {playerStats.defense}</p>

                        <ul>
                            {Object.values(inventory).map(({ item, count }) => (
                                <li key={item.itemsId}>
                                    <img
                                        src={`${apiUrl}${item.itemImagePath}`}
                                        alt={item.itemName}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                    {item.itemName} (x{count})
                                    {item.itemDescription}
                                    {item.isConsumable && !item.forStory && (
                                        <button onClick={() => handleUseItem(item)}>Use</button>
                                    )}
                                    {!item.isConsumable && !item.forStory && (
                                        <button onClick={() => equipItem(item)}>Equip</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <h1>{location.locationName}</h1>
                    

                    {location.item && (
                        <div>
                            <h2>Item</h2>
                            <img
                                src={`${apiUrl}${location.item.itemImagePath}`}
                                alt={location.item.itemName}
                                style={{ cursor: "pointer", maxWidth: "100px", height: "auto" }}
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
                    <div>
                        <p>{location.locationDescription}</p>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Location;

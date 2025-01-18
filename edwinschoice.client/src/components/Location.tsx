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
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);


    const {
        inventory,
        playerStats,
        addItemToInventory,
        handleUseItem,
        equipItem,
        obtainedItems,
        markItemAsObtained
    } = useInventory();

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/api/Locations/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.item && !data.itemReobtainable && obtainedItems.includes(data.item.itemsId)) {
                    data.item = null;
                    data.itemId = null;
                }
                setLocation(data);
            })
            .catch(console.error);

        fetch(`${apiUrl}/api/Locations/${id}/connections`)
            .then((response) => response.json())
            .then(setConnections)
            .catch(console.error);
    }, [id, obtainedItems]);

    const handleNavigate = (toId: number) => {
        navigate(`/location/${toId}`);
    };
    const isItemEquipped = (item: Item): boolean => {
        return (
            playerStats.equippedWeapon?.itemsId === item.itemsId ||
            playerStats.equippedArmor?.itemsId === item.itemsId
        );
    };

    const handleItemClick = () => {
        if (!location || !location.item) return;

        addItemToInventory(location.item);
        markItemAsObtained(location.item.itemsId);

        if (!location.itemReobtainable) {
            setLocation((prev) =>
                prev ? { ...prev, item: null, itemId: null } : null
            );
        }
    };
    const toggleInventory = () => {
        setIsInventoryOpen((prev) => !prev);
    };

    return (
        <div className="the_location">
            {location ? (
                <div
                    className="location_background"
                    style={{
                        backgroundImage: `url(${apiUrl}${location.locationImagePath})`
                    }}
                >
                    <div className="inventory_bag"
                        onClick={toggleInventory}
                        style={{ backgroundImage: `url(${apiUrl}/items/inventory.png)` }}>
                    </div>
                    <div className={`inventory_menu ${isInventoryOpen ? "open" : ""}`}>
                        
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
                                        style={{ width: "40px", height: "auto" }}
                                    />
                                    {item.itemName} (x{count})
                                    {item.itemDescription}
                                    {item.isConsumable && !item.forStory && (
                                        <button onClick={() => handleUseItem(item)}>Use</button>
                                    )}
                                    {!item.isConsumable && !item.forStory && (
                                        isItemEquipped(item) ? (
                                            <span>Equipped</span>
                                        ) : (
                                            <button onClick={() => equipItem(item)}>Equip</button>
                                        )
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <h1 className="location_title">{location.locationName}</h1>
                    {location.item && (
                        
                        <div className="item-container">
                            <img
                                src={`${apiUrl}${location.item.itemImagePath}`}
                                alt={location.item.itemName}
                                onClick={handleItemClick}
                            />
                        </div>
                    )}                   
                    <div className="connections ">
                        {connections.map((connection) => (
                            <div key={connection.toId} onClick={() => handleNavigate(connection.toId)}>
                                
                                {"> " + connection.connectionText}
                            </div>
                        ))}
                        </div>    
                    <div className="text_box" style={{ backgroundImage: `url(${apiUrl}/images/dialog_background.webp)` }}>
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

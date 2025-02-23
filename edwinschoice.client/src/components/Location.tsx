import { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory, Item } from "./PlayerComponent";
import "./Location.css";

interface LocationData {
    locationName: string;
    locationDescription: string;
    locationImagePath: string;
    itemReobtainable: boolean | null;
    itemId: number | null;
    item: Item | null;
}

interface Connection {
    toId: number;
    locationName: string;
    locationDescription: string;
    connectionText: string;
    isBattle: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;

type State = {
    location: LocationData | null;
    connections: Connection[];
    isInventoryOpen: boolean;
};

type Action =
    | { type: "SET_LOCATION"; payload: LocationData }
    | { type: "SET_CONNECTIONS"; payload: Connection[] }
    | { type: "TOGGLE_INVENTORY" }
    | { type: "REMOVE_ITEM" };

function locationReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_LOCATION":
            return { ...state, location: action.payload };
        case "SET_CONNECTIONS":
            return { ...state, connections: action.payload };
        case "TOGGLE_INVENTORY":
            return { ...state, isInventoryOpen: !state.isInventoryOpen };
        case "REMOVE_ITEM":
            return state.location
                ? { ...state, location: { ...state.location, item: null, itemId: null } }
                : state;
        default:
            return state;
    }
}

function Location() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(locationReducer, {
        location: null,
        connections: [],
        isInventoryOpen: false
    });

    const { inventory, playerStats, obtainedItems, dispatch: inventoryDispatch, saveGame } = useInventory();

    useEffect(() => {
        if (!id) return;
        fetch(`${apiUrl}/api/Locations/${id}`)
            .then((response) => response.json())
            .then((data: LocationData) => {
                // If item is not reobtainable and is already obtained, remove it
                if (data.item && !data.itemReobtainable && obtainedItems.includes(data.item.itemsId)) {
                    data.item = null;
                    data.itemId = null;
                }
                dispatch({ type: "SET_LOCATION", payload: data });

                const storedLocations = localStorage.getItem("reachedLocations");
                const reachedLocations = storedLocations ? JSON.parse(storedLocations) : [];
                if (!reachedLocations.includes(Number(id))) {
                    reachedLocations.push(Number(id));
                    localStorage.setItem("reachedLocations", JSON.stringify(reachedLocations));
                }
            })
            .catch(console.error);

        fetch(`${apiUrl}/api/Locations/${id}/connections`)
            .then((response) => response.json())
            .then((connections: Connection[]) => {
                if (!Array.isArray(connections)) {
                    console.error("Connections are not an array:", connections);
                    return;
                }
                dispatch({ type: "SET_CONNECTIONS", payload: connections });
            })
            .catch(console.error);
    }, [id, obtainedItems]);

    const handleNavigate = (toId: number | null, isBattle: boolean) => {
        if (toId === null) return;
        saveGame(toId);
        inventoryDispatch({ type: "SAVE_LOCATION", payload: toId });
        navigate(isBattle ? `/battle/${toId}` : `/location/${toId}`);
    };

    const isItemEquipped = (item: Item): boolean => {
        return (
            playerStats.equippedWeapon?.itemsId === item.itemsId ||
            playerStats.equippedArmor?.itemsId === item.itemsId
        );
    };

    const handleItemClick = () => {
        if (!state.location || !state.location.item) return;
        inventoryDispatch({ type: "ADD_ITEM", payload: state.location.item });
        inventoryDispatch({ type: "MARK_OBTAINED", payload: state.location.item.itemsId });
        if (!state.location.itemReobtainable) {
            dispatch({ type: "REMOVE_ITEM" });
        }
    };

    const toggleInventory = () => {
        dispatch({ type: "TOGGLE_INVENTORY" });
    };

    const handleHeal = (item: Item) => {
        inventoryDispatch({
            type: "SET_PLAYER_STATS",
            payload: {
                ...playerStats,
                health: Math.min(playerStats.health + (item.health ?? 0), 100),
            },
        });
        inventoryDispatch({ type: "USE_ITEM", payload: item });
    };

    return (
        <div className="the_location">
            {state.location ? (
                <div
                    className="location_background"
                    style={{
                        backgroundImage: `url(${apiUrl}${state.location.locationImagePath})`
                    }}
                >
                    <div
                        className="inventory_bag"
                        onClick={toggleInventory}
                        style={{ backgroundImage: `url(${apiUrl}/items/inventory.png)` }}
                    ></div>

                    <div className={`inventory_menu ${state.isInventoryOpen ? "open" : ""}`}>
                        <h1>Inventáø</h1>
                        <div className="inventory_container">
                            <div className="inventory_item">
                                <div
                                    className="inventory_icon"
                                    style={{ backgroundImage: `url(${apiUrl}/items/health-removebg-preview.png)` }}
                                ></div>
                                <p>{playerStats.health}</p>
                            </div>
                            <div className="inventory_item">
                                <div
                                    className="inventory_icon"
                                    style={{ backgroundImage: `url(${apiUrl}/items/attack-removebg-preview.png)` }}
                                ></div>
                                <p>{playerStats.attack}</p>
                            </div>
                            <div className="inventory_item">
                                <div
                                    className="inventory_icon"
                                    style={{ backgroundImage: `url(${apiUrl}/items/defense-removebg-preview.png)` }}
                                ></div>
                                <p>{playerStats.defense}</p>
                            </div>
                        </div>
                        <ul>
                            {Object.values(inventory).map(({ item, count }) => (
                                <li key={item.itemsId}>
                                    <div className="holup">
                                        <img
                                            src={`${apiUrl}${item.itemImagePath}`}
                                            alt={item.itemName}
                                            style={{ width: "auto", height: "80px" }}
                                        />
                                        <div>
                                            <div className="item_name">
                                                <p>{item.itemName} (x{count})</p>
                                            </div>
                                            <p>{item.itemDescription}</p>
                                        </div>
                                    </div>
                                    {item.isConsumable && !item.forStory && (
                                        <button onClick={() => handleHeal(item)}>Použít</button>
                                    )}
                                    {!item.isConsumable && !item.forStory && (
                                        isItemEquipped(item) ? (
                                            <span>Nasazeno</span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    inventoryDispatch({ type: "EQUIP_ITEM", payload: item })
                                                }
                                            >
                                                Nasadit
                                            </button>
                                        )
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button className="back_to_menu_button" onClick={() => navigate("/")}>
                            Zpìt do menu.
                        </button>
                    </div>

                    <h1 className="location_title">{state.location.locationName}</h1>

                    {state.location.item && (
                        <div className="item-container">
                            <img
                                src={`${apiUrl}${state.location.item.itemImagePath}`}
                                alt={state.location.item.itemName}
                                onClick={handleItemClick}
                            />
                        </div>
                    )}

                    <div className="connections">
                        {Array.isArray(state.connections) &&
                            state.connections.map((connection: Connection) => (
                                <div
                                    key={connection.toId}
                                    onClick={() => handleNavigate(connection.toId, connection.isBattle)}
                                >
                                    {"> " + connection.connectionText}
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Location;
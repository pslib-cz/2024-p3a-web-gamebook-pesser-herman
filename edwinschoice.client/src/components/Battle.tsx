import React, { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "./PlayerComponent";
import './Battle.css';

const apiUrl = import.meta.env.VITE_API_URL;

interface Battle {
    battlesId: number;
    enemyName: string;
    enemyHealth: number;
    enemyAttack: number;
    enemyDefense: number;
    battleImagePath: string;
}

interface Connection {
    toId: number;
}

interface Item {
    itemsId: number;
    itemName: string;
    itemDescription: string;
    itemImagePath: string;
    isConsumable: boolean;
    health?: number;
    attack?: number;
    defense?: number;
    forStory: boolean;
}

interface State {
    battle: Battle | null;
    enemyHealth: number | null;
    connections: Connection[];
    loading: boolean;
    isInventoryOpen: boolean;
}

type Action =
    | { type: "SET_BATTLE"; payload: Battle }
    | { type: "SET_CONNECTIONS"; payload: Connection[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "TOGGLE_INVENTORY" }
    | { type: "SET_ENEMY_HEALTH"; payload: number };

const battleReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_BATTLE":
            return { ...state, battle: action.payload, enemyHealth: action.payload.enemyHealth };
        case "SET_CONNECTIONS":
            return { ...state, connections: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "TOGGLE_INVENTORY":
            return { ...state, isInventoryOpen: !state.isInventoryOpen };
        case "SET_ENEMY_HEALTH":
            return { ...state, enemyHealth: action.payload };
        default:
            return state;
    }
};

const Battle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { playerStats, setPlayerStats, inventory, handleUseItem, equipItem, saveGame } = useInventory();

    const [state, dispatch] = useReducer(battleReducer, {
        battle: null,
        enemyHealth: null,
        connections: [],
        loading: true,
        isInventoryOpen: false
    });

    useEffect(() => {
        const fetchBattle = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/Battles/${id}`);
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Battle not found: ${errorMessage}`);
                }
                const data: Battle = await response.json();
                dispatch({ type: "SET_BATTLE", payload: data });
            } catch (error) {
                console.error("Error fetching battle:", error);
                setTimeout(() => navigate("/location/0"), 2000);
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        const fetchConnections = async () => {
            const response = await fetch(`${apiUrl}/api/Battles/${id}/connections`);
            const data: Connection[] = await response.json();
            dispatch({ type: "SET_CONNECTIONS", payload: data });
        };

        fetchBattle();
        fetchConnections();
    }, [id, navigate]);

    const toggleInventory = () => {
        dispatch({ type: "TOGGLE_INVENTORY" });
    };

    const isItemEquipped = (item: Item) => {
        return (
            playerStats.equippedWeapon?.itemsId === item.itemsId ||
            playerStats.equippedArmor?.itemsId === item.itemsId
        );
    };

    const getExitLocation = (): number | null => {
        const exitConnection = state.connections.find((conn) => conn.toId !== null);
        return exitConnection ? exitConnection.toId : null;
    };

    const handleAttack = () => {
        if (!state.battle || state.enemyHealth === null) return;
        const playerDamage = Math.max(playerStats.attack - state.battle.enemyDefense, 0);
        const newEnemyHealth = state.enemyHealth - playerDamage;

        if (newEnemyHealth <= 0) {
            dispatch({ type: "SET_ENEMY_HEALTH", payload: 0 });
            const exitLocation = getExitLocation();
            if (exitLocation !== null) {
                saveGame(exitLocation);
                navigate(`/location/${exitLocation}`);
            }
            return;
        }

        dispatch({ type: "SET_ENEMY_HEALTH", payload: newEnemyHealth });

        const enemyDamage = Math.max(state.battle.enemyAttack - playerStats.defense, 0);
        const newPlayerHealth = playerStats.health - enemyDamage;

        if (newPlayerHealth <= 0) {
            setPlayerStats((prevStats) => ({ ...prevStats, health: 0 }));
            navigate("/location/0");
        } else {
            setPlayerStats((prevStats) => ({ ...prevStats, health: newPlayerHealth }));
        }
    };

    const handleHeal = (item: Item) => {
        setPlayerStats(prevStats => {
            const healedHealth = Math.min(prevStats.health + (item.health || 0), 100);
            const enemyDamage = Math.max(state.battle!.enemyAttack - prevStats.defense, 0);
            const newPlayerHealth = healedHealth - enemyDamage;

            if (newPlayerHealth <= 0) {
                navigate("/location/0");
                return { ...prevStats, health: 0 };
            }

            return { ...prevStats, health: newPlayerHealth };
        });
        handleUseItem(item);
    };

    if (state.loading) return <p>Loading battle...</p>;
    if (!state.battle) return <p>Battle not found</p>;

    return (
        <div className="battle_location">
            <div className="battle_background" style={{ backgroundImage: `url(${apiUrl}${state.battle.battleImagePath})` }}></div>
            <h1 className="Enemy">Battle: {state.battle.enemyName}</h1>
            <p className="Enemy_health">Enemy Health: {state.enemyHealth}</p>
            <button onClick={handleAttack} className="attack">Attack</button>

            <div className="inventory_bag" onClick={toggleInventory} style={{ backgroundImage: `url(${apiUrl}/items/inventory.png)` }}></div>

            <div className={`inventory_menu ${state.isInventoryOpen ? "open" : ""}`}>
                <h2 className="inventory_name">Inventáø</h2>
                <div className="inventory_container">
                    <div className="inventory_item">
                        <div className="inventory_icon" style={{ backgroundImage: `url(${apiUrl}/items/health-removebg-preview.png)` }}></div>
                        <p>{playerStats.health}</p>
                    </div>
                    <div className="inventory_item">
                        <div className="inventory_icon" style={{ backgroundImage: `url(${apiUrl}/items/attack-removebg-preview.png)` }}></div>
                        <p>{playerStats.attack}</p>
                    </div>
                    <div className="inventory_item">
                        <div className="inventory_icon" style={{ backgroundImage: `url(${apiUrl}/items/defense-removebg-preview.png)` }}></div>
                        <p>{playerStats.defense}</p>
                    </div>
                </div>

                <ul>
                    {Object.values(inventory).map(({ item, count }) => (
                        <li key={item.itemsId} className="inventory_item">
                            <img src={`${apiUrl}${item.itemImagePath}`} alt={item.itemName} className="inventory_item_img" />
                            <span>{item.itemName} (x{count})</span>
                            {item.isConsumable && !item.forStory && (
                                <button onClick={() => handleHeal(item)}>Použít</button>
                            )}
                            {!item.isConsumable && !item.forStory && (
                                isItemEquipped(item) ? <span>Nasazeno</span> : <button onClick={() => equipItem(item)}>Nasadit</button>
                            )}
                        </li>
                    ))}
                </ul>
                <button className="back_to_menu_button" onClick={() => navigate("/")}>Zpìt do menu.</button>
            </div>
        </div>
    );
};

export default Battle;

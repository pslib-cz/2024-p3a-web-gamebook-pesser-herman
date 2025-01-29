import React, { useEffect, useState } from "react";
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

const Battle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { playerStats, setPlayerStats, inventory, handleUseItem, equipItem, saveGame } = useInventory();

    const [battle, setBattle] = useState<Battle | null>(null);
    const [enemyHealth, setEnemyHealth] = useState<number | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    useEffect(() => {
        const fetchBattle = async () => {
            try {
                console.log(`Fetching battle ID: ${id}`);
                const response = await fetch(`${apiUrl}/api/Battles/${id}`);

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Battle not found: ${errorMessage}`);
                }

                const data: Battle = await response.json();
                console.log("Battle data received:", data);
                setBattle(data);
                setEnemyHealth(data.enemyHealth);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error fetching battle:", error.message);
                } else {
                    console.error("Unknown error fetching battle:", error);
                }
                setTimeout(() => navigate("/location/0"), 2000);
            } finally {
                setLoading(false);
            }
        };

        const fetchConnections = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/Battles/${id}/connections`);
                if (!response.ok) throw new Error("Failed to fetch battle connections.");

                const data: Connection[] = await response.json();
                console.log("Connections received:", data);
                setConnections(data);
            } catch (error) {
                console.error("Error fetching battle connections:", error);
            }
        };

        fetchBattle();
        fetchConnections();
    }, [id, navigate]);

    const toggleInventory = () => {
        setIsInventoryOpen((prev) => !prev);
    };

    const isItemEquipped = (item: Item) => {
        return (
            playerStats.equippedWeapon?.itemsId === item.itemsId ||
            playerStats.equippedArmor?.itemsId === item.itemsId
        );
    };

    const getExitLocation = (): number | null => {
        const exitConnection = connections.find((conn) => conn.toId !== null);
        return exitConnection ? exitConnection.toId : null;
    };

    const handleAttack = () => {
        if (!battle || enemyHealth === null) return;
        const playerDamage = Math.max(playerStats.attack - battle.enemyDefense, 0);
        const newEnemyHealth = enemyHealth - playerDamage;

        if (newEnemyHealth <= 0) {
            setEnemyHealth(0);
            const exitLocation = getExitLocation();
            if (exitLocation !== null) {
                saveGame(exitLocation);
                navigate(`/location/${exitLocation}`);
            }
            return;
        }
        setEnemyHealth(newEnemyHealth);
        const enemyDamage = Math.max(battle.enemyAttack - playerStats.defense, 0);
        const newPlayerHealth = playerStats.health - enemyDamage;

        if (newPlayerHealth <= 0) {
            setPlayerStats((prevStats) => ({ ...prevStats, health: 0 }));
            navigate("/location/0"); 
        } else {
            setPlayerStats((prevStats) => ({ ...prevStats, health: newPlayerHealth }));
        }
    };

    if (loading) return <p>Loading battle...</p>;
    if (!battle) return <p>Battle not found</p>;

    return (
        <div>
            <h1>Battle: {battle.enemyName}</h1>
            <div
                className="battle_background"
                style={{
                    backgroundImage: `url(${apiUrl}${battle.battleImagePath})`,
                }}
            ></div>
            <p>Enemy Health: {enemyHealth}</p>
            <div>
                <button onClick={handleAttack}>Attack</button>
            </div>
            <div className="inventory_bag"
                onClick={toggleInventory}
                style={{ backgroundImage: `url(${apiUrl}/items/inventory.png)` }}>
            </div>
            <div className={`inventory_menu ${isInventoryOpen ? "open" : ""}`}>

                <h1>Inventáø</h1>
                <p>Životy: {playerStats.health}</p>
                <p>Útok: {playerStats.attack}</p>
                <p>Obrana: {playerStats.defense}</p>
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
                                <button onClick={() => {
                                    setPlayerStats(prevStats => {
                                        const healedHealth = Math.min(prevStats.health + item.health!, 100);
                                        return { ...prevStats, health: healedHealth };
                                    });
                                    handleUseItem(item);
                                    const enemyDamage = Math.max(battle.enemyAttack - playerStats.defense, 0);
                                    setPlayerStats(prevStats => {
                                        const newPlayerHealth = prevStats.health - enemyDamage;
                                        if (newPlayerHealth <= 0) {
                                            navigate("/location/0"); 
                                            return { ...prevStats, health: 0 };
                                        }
                                        return { ...prevStats, health: newPlayerHealth };
                                    });
                                }}>Použít</button>
                            )}
                            {!item.isConsumable && !item.forStory && (
                                isItemEquipped(item) ? (
                                    <span>Nasazeno</span>
                                ) : (
                                    <button onClick={() => equipItem(item)}>Nasadit</button>
                                )
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
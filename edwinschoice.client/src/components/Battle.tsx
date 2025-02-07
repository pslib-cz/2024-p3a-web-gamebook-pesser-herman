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
                const response = await fetch(`${apiUrl}/api/Battles/${id}`);
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Battle not found: ${errorMessage}`);
                }
                const data: Battle = await response.json();
                setBattle(data);
                setEnemyHealth(data.enemyHealth);
            } catch (error) {
                console.error("Error fetching battle:", error);
                setTimeout(() => navigate("/location/0"), 2000);
            } finally {
                setLoading(false);
            }
        };

        const fetchConnections = async () => {
            const response = await fetch(`${apiUrl}/api/Battles/${id}/connections`);
            const data: Connection[] = await response.json();
            setConnections(data);
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
        <div className="battle_location">
            <div
                className="battle_background"
                style={{
                    backgroundImage: `url(${apiUrl}${battle.battleImagePath})`,
                }}
            ></div>
            <h1 className="Enemy">Battle: {battle.enemyName}</h1>
            <p className="Enemy_health">Enemy Health: {enemyHealth}</p>
            <div >
                <button onClick={handleAttack} className="attack">Attack</button>
            </div>
            <div className="inventory_bag" onClick={toggleInventory} style={{ backgroundImage: `url(${apiUrl}/items/inventory.png)` }}>
               
            </div>
            <div className={`inventory_menu ${isInventoryOpen ? "open" : ""}`}>
                <h2 className="inventory_name">Inventáø</h2>
                <div className="inventory_container"> <div className="inventory_item">
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
                            <img
                                src={`${apiUrl}${item.itemImagePath}`}
                                alt={item.itemName}
                                className="inventory_item_img"
                            />
                            <span>{item.itemName} (x{count})</span>
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

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
    const { playerStats, setPlayerStats, inventory, handleUseItem } = useInventory();

    const [battle, setBattle] = useState<Battle | null>(null);
    const [enemyHealth, setEnemyHealth] = useState<number | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);

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
            navigate(`/location/${exitLocation}`); 
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

    const handleHeal = (healingItem: Item) => {
        if (!healingItem.isConsumable || !healingItem.health) return;
        handleUseItem(healingItem);
        if (battle) {
            const enemyDamage = Math.max(battle.enemyAttack - playerStats.defense, 0);
            const newPlayerHealth = playerStats.health - enemyDamage;

            if (newPlayerHealth <= 0) {
                setPlayerStats((prevStats) => ({ ...prevStats, health: 0 }));
                navigate("/location/0");
            } else {
                setPlayerStats((prevStats) => ({ ...prevStats, health: newPlayerHealth }));
            }
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
                {Object.values(inventory)
                    .filter((invItem) => invItem.item.isConsumable)
                    .map((invItem, index) => (
                        <button key={`${invItem.item.itemsId}-${index}`} onClick={() => handleHeal(invItem.item)}>
                            Heal ({invItem.item.itemName})
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default Battle;
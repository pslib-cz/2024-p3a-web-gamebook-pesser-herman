import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "./PlayerComponent";

interface Battle {
    BattlesId: number;
    EnemyName: string;
    Health: number;
    Attack: number;
    Defense: number;
    BattleImagePath: string;
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBattle = async () => {
            try {
                console.log(`Fetching battle ID: ${id}`);
                const response = await fetch(`/api/Battles/${id}`);

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Battle not found: ${errorMessage}`);
                }

                const data: Battle = await response.json();
                console.log("Battle data received:", data);
                setBattle(data);
                setEnemyHealth(data.Health);
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

        fetchBattle();
    }, [id, navigate]);

    const handleAttack = () => {
        if (!battle || enemyHealth === null) return;
        const playerDamage = Math.max(playerStats.attack - battle.Defense, 0);
        const newEnemyHealth = enemyHealth - playerDamage;

        if (newEnemyHealth <= 0) {
            setEnemyHealth(0);
            navigate(`/location/${battle.BattlesId}`);
            return;
        }
        setEnemyHealth(newEnemyHealth);
        const enemyDamage = Math.max(battle.Attack - playerStats.defense, 0);
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
            const enemyDamage = Math.max(battle.Attack - playerStats.defense, 0);
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
            <h1>Battle: {battle.EnemyName}</h1>
            <img src={`/battles/${battle.BattleImagePath}`} alt={`${battle.EnemyName}`} />
            <p>Enemy Health: {enemyHealth}</p>
            <p>Your Health: {playerStats.health}</p>
            <p>Attack: {playerStats.attack}</p>
            <p>Defense: {playerStats.defense}</p>
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
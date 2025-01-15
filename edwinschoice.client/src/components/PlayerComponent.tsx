import React, { createContext, useContext, useState, ReactNode } from "react";

interface Item {
    itemsId: number;
    itemName: string;
    itemDescription: string;
    health?: number;
    attack?: number;
    defense?: number;
    isConsumable: boolean;
    forStory: boolean;
    itemImagePath: string;
}

interface InventoryItem {
    item: Item;
    count: number;
}

interface PlayerStats {
    health: number;
    attack: number;
    defense: number;
    equippedWeapon: Item | null;
    equippedArmor: Item | null;
}

interface PlayerContextType {
    inventory: { [key: number]: InventoryItem };
    playerStats: PlayerStats;
    addItemToInventory: (item: Item) => void;
    handleUseItem: (item: Item) => void;
    equipItem: (item: Item) => void;
    isItemInInventory: (itemId: number) => boolean; 
    canAccessConnection: (requiredItemId?: number | null) => boolean;
    visitedLocations: Set<number>; // To track visited locations by their IDs
    markLocationVisited: (locationId: number) => void;
    hasVisitedLocation: (locationId: number) => boolean;
}



const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerComponent");
    }
    return context;
};

const PlayerComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<{ [key: number]: InventoryItem }>({});
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        health: 100,
        attack: 10,
        defense: 5,
        equippedWeapon: null,
        equippedArmor: null,
    });

    const addItemToInventory = (item: Item) => {
        setInventory((prevInventory) => {
            const existingItem = prevInventory[item.itemsId];
            return {
                ...prevInventory,
                [item.itemsId]: existingItem
                    ? { item, count: existingItem.count + 1 }
                    : { item, count: 1 },
            };
        });
    };

    const handleUseItem = (item: Item) => {
        if (!item.isConsumable || !item.health) return;

        setPlayerStats((prevStats) => ({
            ...prevStats,
            health: Math.min(prevStats.health + item.health!, 100),
        }));

        setInventory((prevInventory) => {
            const updatedInventory = { ...prevInventory };
            const existingItem = updatedInventory[item.itemsId];
            if (!existingItem) return prevInventory;

            if (existingItem.count > 1) {
                updatedInventory[item.itemsId] = { ...existingItem, count: existingItem.count - 1 };
            } else {
                delete updatedInventory[item.itemsId];
            }

            return updatedInventory;
        });
    };

    const equipItem = (item: Item) => {
        if (item.forStory || item.isConsumable) return;

        setPlayerStats((prevStats) => {
            const updatedStats = { ...prevStats };

            if (item.attack !== undefined) {
                updatedStats.attack =
                    prevStats.attack +
                    item.attack -
                    (prevStats.equippedWeapon?.attack || 0);
                updatedStats.equippedWeapon = item;
            }

            if (item.defense !== undefined) {
                updatedStats.defense =
                    prevStats.defense +
                    item.defense -
                    (prevStats.equippedArmor?.defense || 0);
                updatedStats.equippedArmor = item;
            }

            return updatedStats;
        });
    };

    const isItemInInventory = (itemId: number): boolean => {
        return !!inventory[itemId];
    };

    const isItemEquipped = (item: Item): boolean => {
        return (
            playerStats.equippedWeapon?.itemsId === item.itemsId ||
            playerStats.equippedArmor?.itemsId === item.itemsId
        );
    };

    const canAccessConnection = (requiredItemId?: number | null): boolean => {
        console.log(`Checking access for ItemId: ${requiredItemId}`);
        if (requiredItemId === null || requiredItemId === undefined) return true;
        const hasItem = isItemInInventory(requiredItemId);
        console.log(`Item ${requiredItemId} in inventory: ${hasItem}`);
        return hasItem;
    };

    const [visitedLocations, setVisitedLocations] = useState<Set<number>>(new Set());

    const markLocationVisited = (locationId: number) => {
        setVisitedLocations((prev) => new Set(prev).add(locationId));
    };

    const hasVisitedLocation = (locationId: number): boolean => {
        return visitedLocations.has(locationId);
    };

    return (
        <PlayerContext.Provider
            value={{ inventory, playerStats, addItemToInventory, handleUseItem, equipItem, isItemInInventory, canAccessConnection, visitedLocations, markLocationVisited, hasVisitedLocation }}
        >
            <div>
                <h1>Player Stats</h1>
                <p>Health: {playerStats.health}</p>
                <p>Attack: {playerStats.attack}</p>
                <p>Defense: {playerStats.defense}</p>

                <h2>Inventory</h2>
                <ul>
                    {Object.values(inventory).map(({ item, count }) => (
                        <li key={item.itemsId}>
                            <img
                                src={`${import.meta.env.VITE_API_URL}${item.itemImagePath}`}
                                alt={item.itemName}
                                style={{ width: "50px", height: "50px" }}
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
                {children}
            </div>
        </PlayerContext.Provider>
        
    );
};

export default PlayerComponent;
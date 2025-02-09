import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface InventoryContextType {
    inventory: { [key: number]: InventoryItem };
    playerStats: PlayerStats;
    obtainedItems: number[];
    lastLocation: number | null;
    setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
    addItemToInventory: (item: Item) => void;
    handleUseItem: (item: Item) => void;
    equipItem: (item: Item) => void;
    markItemAsObtained: (itemId: number) => void;
    saveGame: (currentLocation: number) => void;

}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within a PlayerComponent");
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

    const [obtainedItems, setObtainedItems] = useState<number[]>([]);
    const [lastLocation, setLastLocation] = useState<number | null>(null);

    useEffect(() => {
        const savedGame = localStorage.getItem("gameState");
        if (savedGame) {
            const { savedStats, savedInventory, savedLocation, savedObtainedItems } = JSON.parse(savedGame);
            setPlayerStats(savedStats);
            setInventory(savedInventory);
            setLastLocation(savedLocation);
            setObtainedItems(savedObtainedItems);
        }
    }, []);

    const saveGame = (currentLocation: number) => {
        const gameState = {
            savedStats: playerStats,
            savedInventory: inventory,
            savedLocation: currentLocation,
            savedObtainedItems: obtainedItems,
        };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    };

    const markItemAsObtained = (itemId: number) => {
        setObtainedItems((prev) => [...new Set([...prev, itemId])]);
    };

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

    return (
        <InventoryContext.Provider
            value={{
                inventory, playerStats, addItemToInventory, handleUseItem, equipItem, obtainedItems, markItemAsObtained, setPlayerStats, lastLocation, saveGame
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};

export default PlayerComponent;

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export interface Item {
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

export interface InventoryItem {
    item: Item;
    count: number;
}

export interface PlayerStats {
    health: number;
    attack: number;
    defense: number;
    equippedWeapon: Item | null;
    equippedArmor: Item | null;
}

export interface State {
    inventory: { [key: number]: InventoryItem };
    playerStats: PlayerStats;
    obtainedItems: number[];
    lastLocation: number | null;
}

export type Action =
    | { type: "SET_PLAYER_STATS"; payload: PlayerStats }
    | { type: "ADD_ITEM"; payload: Item }
    | { type: "USE_ITEM"; payload: Item }
    | { type: "EQUIP_ITEM"; payload: Item }
    | { type: "MARK_OBTAINED"; payload: number }
    | { type: "SAVE_LOCATION"; payload: number }
    | { type: "LOAD_GAME"; payload: State };

export const initialState: State = {
    inventory: {},
    playerStats: {
        health: 100,
        attack: 10,
        defense: 5,
        equippedWeapon: null,
        equippedArmor: null,
    },
    obtainedItems: [],
    lastLocation: null,
};

function inventoryReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PLAYER_STATS":
            return { ...state, playerStats: action.payload };

        case "ADD_ITEM": {
            const item = action.payload;
            const existingItem = state.inventory[item.itemsId];
            return {
                ...state,
                inventory: {
                    ...state.inventory,
                    [item.itemsId]: existingItem
                        ? { item, count: existingItem.count + 1 }
                        : { item, count: 1 },
                },
            };
        }

        case "USE_ITEM": {
            const item = action.payload;
            const existingItem = state.inventory[item.itemsId];
            if (!existingItem) return state;
            const updatedInventory = { ...state.inventory };
            if (existingItem.count > 1) {
                updatedInventory[item.itemsId] = { ...existingItem, count: existingItem.count - 1 };
            } else {
                delete updatedInventory[item.itemsId];
            }
            return { ...state, inventory: updatedInventory };
        }

        case "EQUIP_ITEM": {
            const item = action.payload;
            if (item.forStory || item.isConsumable) return state;
            const updatedStats = { ...state.playerStats };

            if (item.attack !== undefined) {
                updatedStats.attack =
                    state.playerStats.attack +
                    item.attack -
                    (state.playerStats.equippedWeapon?.attack || 0);
                updatedStats.equippedWeapon = item;
            }
            if (item.defense !== undefined) {
                updatedStats.defense =
                    state.playerStats.defense +
                    item.defense -
                    (state.playerStats.equippedArmor?.defense || 0);
                updatedStats.equippedArmor = item;
            }
            return { ...state, playerStats: updatedStats };
        }

        case "MARK_OBTAINED":
            return {
                ...state,
                obtainedItems: [...new Set([...state.obtainedItems, action.payload])],
            };

        case "SAVE_LOCATION":
            return { ...state, lastLocation: action.payload };

        case "LOAD_GAME":
            return action.payload;

        default:
            return state;
    }
}

interface InventoryContextType {
    inventory: { [key: number]: InventoryItem };
    playerStats: PlayerStats;
    obtainedItems: number[];
    lastLocation: number | null;
    dispatch: React.Dispatch<Action>;
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
    const [state, dispatch] = useReducer(inventoryReducer, initialState);

    useEffect(() => {
        const savedGame = localStorage.getItem("gameState");
        if (savedGame) {
            dispatch({ type: "LOAD_GAME", payload: JSON.parse(savedGame) });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("gameState", JSON.stringify(state));
    }, [state]);

    const saveGame = (currentLocation: number) => {
        dispatch({ type: "SAVE_LOCATION", payload: currentLocation });
    };

    return (
        <InventoryContext.Provider value={{ ...state, dispatch, saveGame }}>
            {children}
        </InventoryContext.Provider>
    );
};

export default PlayerComponent;
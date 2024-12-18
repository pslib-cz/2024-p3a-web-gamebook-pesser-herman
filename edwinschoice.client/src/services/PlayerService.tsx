const PLAYER_KEY = 'player';

export const getPlayer = () => {
    const player = localStorage.getItem(PLAYER_KEY);
    return player ? JSON.parse(player) : null;
};

export const setPlayerLocation = (LocationsId: number) => {
    const player = getPlayer() || { name: 'Player1', LocationsId: null }; 
    player.LocationsId = LocationsId;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
};

export const getPlayerLocation = (): number | null => {
    const player = getPlayer();
    return player ? player.LocationsId : null;
};
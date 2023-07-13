export const playersDB: Iplayer[] = [];

export let gameIndex = 0;

export const roomsDB: {
  [id: string]: {
    id: string;
    players: IRoomPlayer[];
    ships: { [playerId: string]: any[]; };
  };
} = {};

export interface Iplayer {
  name: string;
  password: string;
  index: number;
}
export interface IRoomPlayer {
  name: string;
  index: string;
}

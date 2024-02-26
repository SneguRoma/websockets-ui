export const playersDB: Iplayer[] = [];

export const roomsDB: IroomsDB[] = [];


export interface WebSocketWithId extends WebSocket {
  wsId?: string;
}

export interface Iplayer {
  name: string;
  password: string;
  index: number;
  wsId: string;
  wins: number;
}
export interface IRoomPlayer {
  name: string;
  index: number;
  wsId?: string;
}

export interface IroomsDB {
  id: number;
  players: IRoomPlayer[];
  ships: { [playerName: string]: IShips[]; };

}

export interface IShips {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

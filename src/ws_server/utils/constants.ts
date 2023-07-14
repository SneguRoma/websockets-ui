
export const playersDB: Iplayer[] = [];

export const roomsDB: IroomsDB[] = [];

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
}

export interface IroomsDB{
  id: number;
  players: IRoomPlayer[];
  ships: { [playerId: string]: any[]; };
}

import { WebSocket } from "ws";

import { IShips, playersDB, roomsDB } from "../utils/constants";

interface IDataShips {
  ships: IShips[];
  currentPlayerIndex: number;
  gameId: number;
  ws: WebSocket;
}

const data: IDataShips[] = [];

export function handleAddShips(
  wsId: string,
  ws: WebSocket,
  gameId: number,
  ships: IShips[]
) {
  let room = roomsDB.find((item) => item.id === gameId);
  let player = playersDB.find((item) => item.wsId === wsId);

  
  if (player) {
    let playerShips = room?.ships;
    if (playerShips) playerShips[player?.name] = ships;

    console.log(`Ships player ${player.name} added`);

    data.push({ ships, currentPlayerIndex: player.index, gameId, ws });
    const filteredData = data.filter((game) => game.gameId === gameId);

    if (filteredData.length === 2) {
      sendStartGameResponse(
        filteredData[0]?.currentPlayerIndex as number,
        filteredData[0]?.ships ?? [],
        filteredData[0]?.ws as WebSocket
      );
      sendStartGameResponse(
        filteredData[1]?.currentPlayerIndex as number,
        filteredData[1]?.ships ?? [],
        filteredData[1]?.ws as WebSocket
      );
    }
  }
}

function sendStartGameResponse(
  currentPlayerIndex: number,
  ships: IShips[],
  ws: WebSocket
) {
  const dataJSON = JSON.stringify({
    ships,
    currentPlayerIndex,
  });
  const response = JSON.stringify({
    type: "start_game",
    data: dataJSON,
    id: 0,
  });

  ws.send(response);
  console.log(`Game started`);
}

import WebSocket, { WebSocketServer } from "ws";

import { playersDB } from "../utils/constants";

export function updateWinners(wss: WebSocketServer /**/ /* wsId: string */) {
  //console.log("Object.values(roomsDB)", roomsDB[0], roomsDB[1]);
  const winners = playersDB.map((player) => {
    return {
      name: player.name,
      wins: player.wins,
    };
  });

  //console.log("rooms", rooms);

  //const roomUsersJson =

  const response = JSON.stringify({
    type: "update_winners",
    data: JSON.stringify(winners),
    id: 0,
  });
  console.log("response", response, wss.address);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
  console.log(`winners updated`);
}

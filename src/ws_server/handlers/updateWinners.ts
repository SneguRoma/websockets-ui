import WebSocket, { WebSocketServer } from "ws";

import { playersDB } from "../utils/constants";

export function updateWinners(wss: WebSocketServer) {
  const winners = playersDB.map((player) => {
    return {
      name: player.name,
      wins: player.wins,
    };
  });

  const response = JSON.stringify({
    type: "update_winners",
    data: JSON.stringify(winners),
    id: 0,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
  console.log(`winners updated`);
}

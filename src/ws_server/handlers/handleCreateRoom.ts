import WebSocket, { WebSocketServer } from "ws";

import { playersDB, roomsDB } from "../utils/constants";

let roomId = 0;

export function handleCreateRoom(wsId: string, wss: WebSocketServer) {
  let player = playersDB.find((item) => item.wsId === wsId);

  roomsDB.push({
    id: roomId,
    players: [{ name: player?.name ?? "", index: player?.index ?? 10 }],
    ships: {},
  });

  updateRoomState(wss);
  console.log(`Room created: ${roomId}`);
  roomId++;
}

export function sendCreateGameResponse(
  id: number,
  roomId: number,
  wss: WebSocketServer
) {
  const dataJSON = JSON.stringify({
    idGame: roomId,
    idPlayer: id,
  });
  const response = JSON.stringify({
    type: "create_game",
    data: dataJSON,
    id: 0,
  });
  
  console.log(`Game created idGame ${roomId} idPlayer: ${id}`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}

export function updateRoomState(wss: WebSocketServer) {
  const rooms = roomsDB
    .filter((room) => room.players.length === 1)
    .map((room) => {
      return {
        roomId: room.id,
        roomUsers: [
          {
            name: room.players[0]?.name,
            index: room.players[0]?.index,
          },
        ],
      };
    });

  const response = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(rooms),
    id: 0,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });

  console.log(`Rooms updated`);
}

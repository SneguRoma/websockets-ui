import { v4 as uuidv4 } from "uuid";
import WebSocket, { WebSocketServer } from "ws";
//import { playersDB, roomsDB } from "..";
import { playersDB, roomsDB } from "../utils/constants";

export interface IRoomPlayer {
  name: string;
  password: string; 
}

export function handleCreateRoom(wsId: string, wss: WebSocketServer) {
  const roomId = uuidv4();
  console.log(`playersDB ${playersDB[0]?.name}`, 'wsId',wsId);
  roomsDB[roomId] = {
    id: roomId,
    players: [{ name: playersDB[0]?.name ?? "", index: wsId }],
    ships: {},
  };

  sendCreateRoomResponse(wsId, roomId, wss);
  updateRoomState(/* wss, */ wsId);
  console.log(`Room created: ${roomId}`);
}

function sendCreateRoomResponse(
  wsId: string,
  roomId: string,
  wss: WebSocketServer
) {
  const response = JSON.stringify({
    type: "create_game",
    data: {
      idGame: roomId,
      idPlayer: parseInt(wsId),
    },
    id: 0,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}

function updateRoomState(/* wss: WebSocketServer, */ wsId: string) {
  console.log('Object.values(roomsDB)', Object.values(roomsDB)[0]?.players)
  const rooms = Object.values(roomsDB).map((room) => {
    if (room.players.length === 1) {
      return {
        roomId: room.id,
        roomUsers: [
          {
            name: playersDB[0]?.name ?? "",
            index: parseInt(wsId),
          },
        ],
      };
    }
  });

  console.log('rooms', rooms);

  //const roomUsersJson = 

  const response = JSON.stringify({
    type: "update_room",
    data: rooms,
    id: 0,
  });
  console.log('response', response);
 /* wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  }); */
}

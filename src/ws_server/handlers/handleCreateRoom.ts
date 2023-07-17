//import { v4 as uuidv4 } from "uuid";
import WebSocket, { WebSocketServer } from "ws";

import { playersDB, roomsDB } from "../utils/constants";

let roomId = 0;

export function handleCreateRoom(wsId: string, wss: WebSocketServer) {
  
  let player = playersDB.find((item) => item.wsId === wsId);
  //console.log(`player ${player?.wsId}`, "wsId", wsId);
  roomsDB.push({
    id: roomId,
    players: [{ name: player?.name ?? "", index: player?.index ?? 10 }],
    ships: {},
  });

  //sendCreateRoomResponse(player?.index ?? 1, roomId, wss);
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
  //console.log("response", response);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}

export function updateRoomState(wss: WebSocketServer /**/ /* wsId: string */) {
  //console.log("Object.values(roomsDB)", roomsDB[0], roomsDB[1]);
  const rooms = roomsDB.filter((room) => (room.players.length === 1) ).map((room) => {
    
      return /* JSON.stringify( */{
        roomId: room.id,
        roomUsers: [
          /* JSON.stringify( */{
            name: room.players[0]?.name,
            index: room.players[0]?.index,
          }/* ) */,
        ]
      }/* ) */;
    
  });

  //console.log("rooms[0]", rooms);

 /*  const nullResponse = JSON.stringify({
    type: "update_room",
    data: JSON.stringify([]),
    id: 0,
  }); */
  const response = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(rooms) ,
    id: 0,
  });
  //console.log("response", response);
  
  //if (rooms) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
         client.send(response);
        
          
        
      }
    });
  //}
  /* else {
    wss.clients.forEach((client) => {
      
      if (client.readyState === WebSocket.OPEN) {
        

        console.log('nullResponse', nullResponse);
        client.send(nullResponse);

      }
    });
  } */

    
    

  
  console.log(`Rooms updated`);
}

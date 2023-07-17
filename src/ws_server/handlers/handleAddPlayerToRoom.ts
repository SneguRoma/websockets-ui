import { WebSocketServer } from "ws";
import { playersDB, roomsDB } from "../utils/constants";
import { sendCreateGameResponse, updateRoomState } from "./handleCreateRoom";

export function handleAddPlayerToRoom(
  wsId: string,
  wss: WebSocketServer,
  roomId: number
) {
  console.log(`roomId ${roomId}`, "wsId", wsId);
  //const { indexRoom } = data;

  //const roomIds = Object.keys(roomsDB);
  /* if (roomId < 0 || roomId >= roomsDB.length) {
    //sendAddPlayerToRoomResponse(roomId, "Invalid room index");
    return;
  } */

  //const roomId = roomIds[indexRoom];
  //const room = roomsDB[roomId];
  let room = roomsDB.find((item) => item.id === roomId);

  /* if (room && room.players.length >= 2) {
    //sendAddPlayerToRoomResponse(roomId, "Room is already full");
    return;
  } */
  const player = playersDB.find((item) => item.wsId === wsId);

  if (player && player.name !== room?.players[0]?.name) {
    room?.players.push({
      name: player.name,
      index: player.index,
    });
    //sendAddPlayerToRoomResponse(roomId, null);
    sendCreateGameResponse(player.index, roomId, wss);

    console.log(`Player added to room: ${roomId}`, wss.eventNames);
    updateRoomState(wss);
  } else {
    console.log(
      "the player does not exist or the player does not want to play with himself"
    );
  }
  //console.log("room", room);
}

/* function sendAddPlayerToRoomResponse(id: string, errorText: string) {
  const response = JSON.stringify({
    type: "create_game",
    data: {
      idGame: -1,
      idPlayer: -1,
      error: errorText !== "",
      errorText,
    },
    id,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    }
  });
}
 */

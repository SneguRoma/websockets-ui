import { WebSocketServer } from "ws";
import { playersDB, roomsDB } from "../utils/constants";
import { sendCreateGameResponse, updateRoomState } from "./handleCreateRoom";

export function handleAddPlayerToRoom(
  wsId: string,
  wss: WebSocketServer,
  roomId: number
) {
  let room = roomsDB.find((item) => item.id === roomId);

  const player = playersDB.find((item) => item.wsId === wsId);

  if (player && player.name !== room?.players[0]?.name) {
    room?.players.push({
      name: player.name,
      index: player.index,
    });

    sendCreateGameResponse(player.index, roomId, wss);

    console.log(`Player ${player.name} added to room: ${roomId}`);
    updateRoomState(wss);
  } else {
    console.log(
      "the player does not exist or the player does not want to play with himself"
    );
  }
}

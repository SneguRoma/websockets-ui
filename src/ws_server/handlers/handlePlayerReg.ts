import WebSocket /* , { WebSocketServer } */ from "ws";
import { playersDB } from "../utils/constants";

let playerIndex = 0;

export function handlePlayerReg(
  data: any,
  wsId: string,
  ws: WebSocket /* wss: WebSocketServer */
) {
  const { name, password } = data;

  if (!name || !password) {
    sendPlayerRegResp(ws, null, true, "Invalid registration data");
    return;
  }

  if (Object.values(playersDB).some((player) => player.name === name)) {
    sendPlayerRegResp(
      ws,

      null,
      true,
      "Player with the same name already exists"
    );
    return;
  }

  playersDB.push({ name, password, index: playerIndex, wsId, wins: 0 });

  sendPlayerRegResp(
    ws,

    { name, index: playerIndex },
    false,
    ""
  );

  console.log(`Player registered: ${name}`);
  playerIndex++;
}

function sendPlayerRegResp(
  ws: WebSocket,

  data: any,
  error: boolean,
  errorText: string
) {
  const dataJSON = JSON.stringify({
    name: data ? data.name : "",
    index: data ? data.index : -1,
    error,
    errorText,
  });
  const response = JSON.stringify({
    type: "reg",
    data: dataJSON,
    id: 0,
  });

  ws.send(response);
}

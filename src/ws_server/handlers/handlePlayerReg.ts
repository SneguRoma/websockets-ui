import WebSocket, { WebSocketServer } from "ws";
import { playersDB } from "..";
import { v4 as uuidv4 } from "uuid";

export function handlePlayerReg(data: any, id: string, wss: WebSocketServer) {
  const { name, password } = data;  

  if (!name || !password) {
    sendPlayerRegResp(wss, id, null, true, "Invalid registration data");
    return;
  }

  if (Object.values(playersDB).some((player) => player.name === name)) {
    sendPlayerRegResp(
      wss,
      id,
      null,
      true,
      "Player with the same name already exists"
    );
    return;
  }

  const playerId = uuidv4();
  playersDB[playerId] = { name, password };
  console.log('playersDB[playerId]',playersDB[playerId])
  sendPlayerRegResp(
    wss,
    id,
    { name, index: Object.keys(playersDB).length - 1 },
    false,
    ""
  );

  console.log(`Player registered: ${name}`);
}

function sendPlayerRegResp(
  wss: WebSocketServer,
  id: string,
  data: any,
  error: boolean,
  errorText: string
) {
  const dataJSON = JSON.stringify(
    {
      name: data ? data.name : "",
      index: data ? data.index : -1,
      error,
      errorText,
    },
  )
  const response = JSON.stringify({
    type: "reg",
    data: dataJSON,
    id,
  });  
    
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(response);
    } 
  });
}
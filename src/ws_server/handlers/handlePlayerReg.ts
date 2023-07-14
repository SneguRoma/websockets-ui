
import WebSocket, { WebSocketServer } from "ws";
import { playersDB } from "../utils/constants";
//import { v4 as uuidv4 } from "uuid";

 let playerIndex = 0;

export function handlePlayerReg(data: any, wsId:string,  wss: WebSocketServer) {
  const { name, password } = data;
  

  if (!name || !password) {
    sendPlayerRegResp(wss,  null, true, "Invalid registration data");
    return;
  }

  if (Object.values(playersDB).some((player) => player.name === name)) {
    sendPlayerRegResp(
      wss,
      
      null,
      true,
      "Player with the same name already exists"
    );
    return;
  }

  //const playerId = uuidv4();
  playersDB.push({ name, password, index: playerIndex, wsId, wins: 0 });
  
  sendPlayerRegResp(
    wss,
    
    { name, index: playerIndex },
    false,
    ""
  );

  console.log(`Player registered: ${name}`);
  playerIndex++;
}

function sendPlayerRegResp(
  wss: WebSocketServer,
  
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
    id: 0,
  });  
  //console.log('dataJSON', dataJSON);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      
      client.send(response);
    } 
  });
}
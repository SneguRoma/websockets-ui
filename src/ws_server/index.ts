import WebSocket, { WebSocketServer } from "ws";
//import { v4 as uuidv4 } from "uuid";

export const wsServer = (port: number) => {


  const wss = new WebSocketServer({ port });
  wss.on("connection", (ws: WebSocket) => {
    ws.on('message', (data) => {
      console.log(`hi there ${data}`)
    })
    ws.send('hi i am server')
    console.log("New connection established " + ws);
  });

}
import WebSocket, { WebSocketServer } from "ws";
import { handlePlayerReg } from "./handlers/handlePlayerReg";


export const playersDB: { [id: string]: { name: string; password: string } } =
  {};



export const wsServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    console.log("new connection created");
    ws.on("message", (message: string) => {
      try {
        const { type, data, id } = JSON.parse(message);
        const dataObject = JSON.parse(data);
        console.log(
          `Received command: ${type}Data: ${JSON.stringify(data)}  id ${id}`
        );
        switch (type) {
          case "reg":
            handlePlayerReg(dataObject, id, wss);
           // ws.send("{  "type": "reg",      "data": {              "name": "qw", "index": "1", "error": "false",   "errorText": "good" },   "id": 0},")
            break;
          
        }
      } catch (error) {
        console.error("Error processing command:", error);
        //sendErrorResponse(id, "Internal server error");
      }
    });
    
  });
  
};

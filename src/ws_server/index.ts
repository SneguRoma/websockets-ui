import WebSocket, { WebSocketServer } from "ws";
import { handlePlayerReg } from "./handlers/handlePlayerReg";
import { v4 as uuidv4 } from "uuid";
import { handleCreateRoom, updateRoomState } from "./handlers/handleCreateRoom";
import { updateWinners } from "./handlers/updateWinners";
import { handleAddPlayerToRoom } from "./handlers/handleAddPlayerToRoom";
import { handleAddShips } from "./handlers/handleAddShips";

export const wsServer = (port: number) => {
  const wss = new WebSocketServer({ port });
  

  wss.on("connection", (ws: WebSocket) => {
    console.log("new connection created");
    const wsId = uuidv4();
    ws.on("message", (message: string) => {
      try {
        const { type, data } = JSON.parse(message);
        

        console.log(
          `Received command: ${type}Data: ${JSON.stringify(data)}`
        );
        switch (type) {
          case "reg":
            const dataObject = JSON.parse(data);
            handlePlayerReg(dataObject, wsId, ws);
            /* if(roomsDB.length !==0) */ updateRoomState(wss);
            updateWinners(wss);
            break;
          case "create_room":
            handleCreateRoom(wsId, wss);
            break;
          case "add_user_to_room":
            const dataAdd = JSON.parse(data);
            handleAddPlayerToRoom(wsId, wss, dataAdd.indexRoom);
            break;
          case "add_ships":
            const dataShips = JSON.parse(data);
            handleAddShips(wsId, ws, dataShips.gameId, dataShips.ships);
            break;
        }
      } catch (error) {
        console.error("something went wrong", error);
       
      }
    });
    
  });
  
};

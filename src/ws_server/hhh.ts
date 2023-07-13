import WebSocket, { WebSocketServer } from "ws";
//import { v4 as uuidv4 } from "uuid";

export const wsServer = (port: number) => {


  const wss = new WebSocketServer({ port });
  wss.on("connection", (ws: WebSocket) => {
    ws.on('message', (message: string) => {
      
      const { type, data, id } = JSON.parse(message);

      console.log(`Received command: ${type}`);
      console.log(`Data: ${JSON.stringify(data)}`);
      console.log(`hi there ${data}  ${id}`);
    });
    
    console.log("New connection established " + ws);
  });
  // In-memory database for player data
  const playersDB: { [id: string]: { name: string; password: string } } = {};
  
  // In-memory database for room data
  const roomsDB: {
    [id: string]: {
      id: string;
      players: string[];
      ships: { [playerId: string]: any[] };
    };
  } = {};
  
  wss.on("connection", (ws: WebSocket) => {
    console.log("New connection established");
  
    ws.on("message", (message: string) => {
      try {
        const { type, data, id } = JSON.parse(message);
  
        console.log(`Received command: ${type}`);
        console.log(`Data: ${JSON.stringify(data)}`);
  
        switch (type) {
          case "reg":
            handlePlayerRegistration(data, id);
            break;
          case "create_room":
            handleCreateRoom(id);
            break;
          case "add_player_to_room":
            handleAddPlayerToRoom(data, id);
            break;
          case "add_ships":
            handleAddShips(data, id);
            break;
          case "attack":
            handleAttack(data, id);
            break;
          case "randomAttack":
            handleRandomAttack(data, id);
            break;
          default:
            sendErrorResponse(id, "Invalid command");
            break;
        }
      } catch (error) {
        console.error("Error processing command:", error);
        //sendErrorResponse(id, "Internal server error");
      }
    });
  });
  
  function handlePlayerRegistration(data: any, id: string) {
    const { name, password } = data;
  
    if (!name || !password) {
      sendPlayerRegistrationResponse(id, null, true, "Invalid registration data");
      return;
    }
  
    if (Object.values(playersDB).some((player) => player.name === name)) {
      sendPlayerRegistrationResponse(
        id,
        null,
        true,
        "Player with the same name already exists"
      );
      return;
    }
  
    const playerId = uuidv4();
    playersDB[playerId] = { name, password };
    sendPlayerRegistrationResponse(
      id,
      { name, index: Object.keys(playersDB).length - 1 },
      false,
      ""
    );
  
    console.log(`Player registered: ${name}`);
  }
  
  function handleCreateRoom(id: string) {
    const roomId = uuidv4();
    roomsDB[roomId] = { id: roomId, players: [], ships: {} };
  
    sendCreateRoomResponse(id, roomId);
    updateRoomState();
    console.log(`Room created: ${roomId}`);
  }
  
  function handleAddPlayerToRoom(data: any, id: string) {
    const { indexRoom } = data;
  
    const roomIds = Object.keys(roomsDB);
    if (indexRoom < 0 || indexRoom >= roomIds.length) {
      sendAddPlayerToRoomResponse(id, "Invalid room index");
      return;
    }
  
    const roomId = roomIds[indexRoom];
    const room = roomsDB[roomId];
  
    if (room.players.length >= 2) {
      sendAddPlayerToRoomResponse(id, "Room is already full");
      return;
    }
  
    const playerId = Object.keys(playersDB)[parseInt(id)];
    room.players.push(playerId);
    room.ships[playerId] = [];
  
    sendAddPlayerToRoomResponse(id, null);
    sendCreateGameResponse(playerId, roomId);
    updateRoomState();
    console.log(`Player added to room: ${roomId}`);
  }
  
  function handleAddShips(data: any, id: string) {
    const { gameId, ships, indexPlayer } = data;
  
    const room = getRoomByPlayerId(id);
    if (!room) {
      sendErrorResponse(id, "Player is not in any room");
      return;
    }
  
    if (room.id !== gameId) {
      sendErrorResponse(id, "Invalid game id");
      return;
    }
  
    const playerId = Object.keys(playersDB)[parseInt(id)];
    room.ships[playerId] = ships;
  
    sendStartGameResponse(playerId, room.ships, 0);
    console.log(`Ships added for player: ${playerId}`);
  }
  
  function handleAttack(data: any, id: string) {
    const { gameID, x, y, indexPlayer } = data;
  
    const room = getRoomByPlayerId(id);
    if (!room) {
      sendErrorResponse(id, "Player is not in any room");
      return;
    }
  
    if (room.id !== gameID) {
      sendErrorResponse(id, "Invalid game id");
      return;
    }
  
    const otherPlayerId = room.players.find((playerId) => playerId !== id);
    if (!otherPlayerId) {
      sendErrorResponse(id, "No other player in the room");
      return;
    }
  
    const currentPlayerIndex = room.players.findIndex(
      (playerId) => playerId === id
    );
    if (currentPlayerIndex !== indexPlayer) {
      sendErrorResponse(id, "Not player's turn");
      return;
    }
  
    // Handle attack logic here
  
    sendAttackResponse(id, {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "miss",
    });
    sendAttackResponse(otherPlayerId, {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "miss",
    });
    console.log(`Player ${id} attacked (${x}, ${y})`);
  }
  
  function handleRandomAttack(data: any, id: string) {
    const { gameID, indexPlayer } = data;
  
    const room = getRoomByPlayerId(id);
    if (!room) {
      sendErrorResponse(id, "Player is not in any room");
      return;
    }
  
    if (room.id !== gameID) {
      sendErrorResponse(id, "Invalid game id");
      return;
    }
  
    const otherPlayerId = room.players.find((playerId) => playerId !== id);
    if (!otherPlayerId) {
      sendErrorResponse(id, "No other player in the room");
      return;
    }
  
    const currentPlayerIndex = room.players.findIndex(
      (playerId) => playerId === id
    );
    if (currentPlayerIndex !== indexPlayer) {
      sendErrorResponse(id, "Not player's turn");
      return;
    }
  
    // Handle random attack logic here
  
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
  
    sendAttackResponse(id, {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "miss",
    });
    sendAttackResponse(otherPlayerId, {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "miss",
    });
    console.log(`Player ${id} randomly attacked (${x}, ${y})`);
  }
  
  function sendPlayerRegistrationResponse(
    id: string,
    data: any,
    error: boolean,
    errorText: string
  ) {
    const response = JSON.stringify({
      type: "reg",
      data: {
        name: data ? data.name : "",
        index: data ? data.index : -1,
        error,
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
  
  function sendCreateRoomResponse(id: string, roomId: string) {
    const response = JSON.stringify({
      type: "create_game",
      data: {
        idGame: roomId,
        idPlayer: parseInt(id),
      },
      id,
    });
  
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(response);
      }
    });
  }
  
  function sendAddPlayerToRoomResponse(id: string, errorText: string) {
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
  
  function sendStartGameResponse(
    playerId: string,
    ships: any[],
    currentPlayerIndex: number
  ) {
    const response = JSON.stringify({
      type: "start_game",
      data: {
        ships,
        currentPlayerIndex,
      },
      id: playerId,
    });
  
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.protocol === playerId) {
        client.send(response);
      }
    });
  }
  
  function sendAttackResponse(playerId: string, attackResult: any) {
    const response = JSON.stringify({
      type: "attack",
      data: attackResult,
      id: playerId,
    });
  
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.protocol === playerId) {
        client.send(response);
      }
    });
  }
  
  function sendErrorResponse(id: string, errorText: string) {
    const response = JSON.stringify({
      type: "response",
      data: {
        error: true,
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
  
  function updateRoomState() {
    const rooms = Object.values(roomsDB).map((room) => ({
      roomId: room.id,
      roomUsers: room.players.map((playerId) => ({
        name: playersDB[playerId].name,
        index: parseInt(playerId),
      })),
    }));
  
    const response = JSON.stringify({
      type: "update_room",
      data: rooms,
      id: 0,
    });
  
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(response);
      }
    });
  }
  
  function getRoomByPlayerId(playerId: string) {
    return Object.values(roomsDB).find((room) => room.players.includes(playerId));
  } 
  //export { wss };
};
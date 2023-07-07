import { wsServer } from './src/ws_server/index';
import { httpServer } from "./src/http_server/index";
//import WebSocket from 'ws';

/* import wss  */
import 'dotenv/config';

const HTTP_PORT = process.env.HTTPPORT ?? 8181;
const WS_PORT = Number(process.env.WSPORT) ?? 8080;
wsServer(WS_PORT);
console.log(`Start static http server on the ${HTTP_PORT} port!`);
console.log(`Start websocket server on the ${WS_PORT} port!`);
httpServer.listen(HTTP_PORT);


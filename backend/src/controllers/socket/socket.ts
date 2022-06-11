import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// SOURCE: https://socket.io/docs/v3/handling-cors/

let io: Server<DefaultEventsMap, DefaultEventsMap>;

export default{
    initialisation: (httpServer: any) => {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:8080",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => { if (!io) throw new Error('Io not initialized.'); return io;}
}
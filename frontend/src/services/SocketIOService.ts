import { io, Socket } from 'socket.io-client'


export type SocketConnectionType = 'admin' | 'user';

export class SocketIOService {
  
  private socket : Socket | null = null;
  
  constructor(token : string, connectionType : SocketConnectionType) {

    this.socket = io(`http://localhost:3000/${connectionType}`, { query : {token}});

  }

  public get getSocket() : Socket | null {
    return this.socket;
  }

  public closeConnection() : void { this.socket?.disconnect(); }

}
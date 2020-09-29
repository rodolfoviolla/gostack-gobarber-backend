declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    io: SocketIO.Server;
    connectedUsers: {
      [key: string]: string;
    };
  }
}

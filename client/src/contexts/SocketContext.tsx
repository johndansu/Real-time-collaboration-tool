import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useState } from "react";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  updateDocument: (roomId: string, documentId: string, content: string) => void;
  updateCursor: (roomId: string, position: { x: number; y: number }) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io("http://localhost:3000", {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinRoom = (roomId: string) => {
    if (socket && user) {
      socket.emit("join-room", {
        roomId,
        userId: user.id,
        username: user.username,
      });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && user) {
      socket.emit("leave-room", {
        roomId,
        userId: user.id,
        username: user.username,
      });
    }
  };

  const sendMessage = (roomId: string, message: string) => {
    if (socket && user) {
      socket.emit("chat-message", {
        roomId,
        message,
        userId: user.id,
        username: user.username,
      });
    }
  };

  const updateDocument = (
    roomId: string,
    documentId: string,
    content: string
  ) => {
    if (socket && user) {
      socket.emit("document-change", {
        roomId,
        documentId,
        content,
        userId: user.id,
      });
    }
  };

  const updateCursor = (roomId: string, position: { x: number; y: number }) => {
    if (socket && user) {
      socket.emit("cursor-move", {
        roomId,
        position,
        userId: user.id,
        username: user.username,
      });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateDocument,
    updateCursor,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

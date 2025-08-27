import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { Users, MessageSquare, Save, Download, Share } from "lucide-react";

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface CursorPosition {
  userId: string;
  username: string;
  x: number;
  y: number;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  initialContent = "",
}) => {
  const [content, setContent] = useState(initialContent);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showUsers, setShowUsers] = useState(true);

  const {
    socket,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateDocument,
    updateCursor,
  } = useSocket();
  const { user } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (socket && user) {
      // Join the document collaboration room
      joinRoom(documentId);

      // Listen for document updates
      socket.on("document-updated", (data) => {
        if (data.documentId === documentId && data.userId !== user.id) {
          setContent(data.content);
        }
      });

      // Listen for user presence
      socket.on("user-joined", (data) => {
        setActiveUsers((prev) => [...prev, data.username]);
      });

      socket.on("user-left", (data) => {
        setActiveUsers((prev) =>
          prev.filter((username) => username !== data.username)
        );
      });

      // Listen for cursor updates
      socket.on("cursor-updated", (data) => {
        if (data.userId !== user.id) {
          setCursors((prev) => {
            const filtered = prev.filter((c) => c.userId !== data.userId);
            return [
              ...filtered,
              {
                userId: data.userId,
                username: data.username,
                x: data.position.x,
                y: data.position.y,
              },
            ];
          });
        }
      });

      // Listen for chat messages
      socket.on("chat-message", (data) => {
        if (data.roomId === documentId) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              userId: data.userId,
              username: data.username,
              message: data.message,
              timestamp: new Date(data.timestamp),
            },
          ]);
        }
      });

      return () => {
        leaveRoom(documentId);
        socket.off("document-updated");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("cursor-updated");
        socket.off("chat-message");
      };
    }
  }, [socket, user, documentId, joinRoom, leaveRoom]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);

    // Debounce document updates
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updateDocument(documentId, documentId, newContent);
    }, 500);
  };

  const handleCursorMove = (e: React.MouseEvent) => {
    if (socket && user) {
      const rect = editorRef.current?.getBoundingClientRect();
      if (rect) {
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        updateCursor(documentId, position);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      sendMessage(documentId, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleSave = () => {
    // Save document content
    console.log("Saving document:", content);
    // In a real app, this would call an API endpoint
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${documentId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Toolbar */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="btn btn-outline px-3 py-1 text-sm">B</button>
              <button className="btn btn-outline px-3 py-1 text-sm">I</button>
              <button className="btn btn-outline px-3 py-1 text-sm">U</button>
              <button className="btn btn-outline px-3 py-1 text-sm">
                Link
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="btn btn-primary px-3 py-1 text-sm"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
              <button
                onClick={handleDownload}
                className="btn btn-outline px-3 py-1 text-sm"
              >
                <Download size={16} className="mr-1" />
                Download
              </button>
              <button className="btn btn-outline px-3 py-1 text-sm">
                <Share size={16} className="mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[500px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={handleContentChange}
            onMouseMove={handleCursorMove}
            suppressContentEditableWarning
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        {/* Users Panel */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100"
          >
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span className="font-medium">
                Active Users ({activeUsers.length})
              </span>
            </div>
            <span className="text-gray-500">{showUsers ? "−" : "+"}</span>
          </button>

          {showUsers && (
            <div className="px-4 pb-4 space-y-2">
              {activeUsers.map((username, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 border-b border-gray-200"
          >
            <div className="flex items-center space-x-2">
              <MessageSquare size={20} />
              <span className="font-medium">Chat</span>
            </div>
            <span className="text-gray-500">{showChat ? "−" : "+"}</span>
          </button>

          {showChat && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
                {chatMessages.map((message) => (
                  <div key={message.id} className="bg-white p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {message.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200"
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn btn-primary px-3 py-2 text-sm disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;

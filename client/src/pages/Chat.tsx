import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  User,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar: string;
  isOwn: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

const Chat: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts] = useState<ChatContact[]>([
    {
      id: "1",
      name: "John Doe",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      status: "online",
      lastMessage: "Great! Let's schedule a meeting for tomorrow.",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 0,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff&size=150",
      status: "online",
      lastMessage: "The API documentation is ready for review.",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 2,
    },
    {
      id: "3",
      name: "Mike Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Chen&background=F59E0B&color=fff&size=150",
      status: "away",
      lastMessage: "Marketing materials are being prepared.",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8B5CF6&color=fff&size=150",
      status: "offline",
      lastMessage: "Database migration completed successfully.",
      lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "John Doe",
      content: "Hi! How's the project coming along?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isOwn: false,
    },
    {
      id: "2",
      sender: "You",
      content:
        "Great! We're making good progress. The frontend is almost complete.",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isOwn: true,
    },
    {
      id: "3",
      sender: "John Doe",
      content: "That's fantastic! When do you think we can start testing?",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isOwn: false,
    },
    {
      id: "4",
      sender: "You",
      content: "We should be ready for testing by the end of this week.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isOwn: true,
    },
    {
      id: "5",
      sender: "John Doe",
      content: "Great! Let's schedule a meeting for tomorrow.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isOwn: false,
    },
  ]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: message.trim(),
        timestamp: new Date(),
        avatar:
          "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
        isOwn: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedContact?.id === contact.id
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      contact.status
                    )}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(contact.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unreadCount > 0 && (
                  <div className="ml-2">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {contact.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      selectedContact.status
                    )}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedContact.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedContact.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Video size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      msg.isOwn ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {!msg.isOwn && (
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="btn btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a contact to start chatting
              </h3>
              <p className="text-gray-600">
                Choose someone from the list to begin your conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

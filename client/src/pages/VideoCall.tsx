import React, { useState, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageSquare,
  MoreVertical,
  Settings,
  Share,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

const VideoCall: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      sender: "John Doe",
      message: "Can everyone hear me?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      message: "Yes, I can hear you clearly!",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
    },
    {
      id: "3",
      sender: "You",
      message: "Perfect! Let's start the meeting.",
      timestamp: new Date(),
    },
  ]);

  const [participants] = useState<Participant[]>([
    {
      id: "1",
      name: "John Doe",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: false,
      isScreenSharing: false,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff&size=150",
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: true,
      isScreenSharing: false,
    },
    {
      id: "3",
      name: "Mike Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Chen&background=F59E0B&color=fff&size=150",
      isVideoOn: false,
      isAudioOn: true,
      isSpeaking: false,
      isScreenSharing: false,
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8B5CF6&color=fff&size=150",
      isVideoOn: true,
      isAudioOn: false,
      isSpeaking: false,
      isScreenSharing: true,
    },
  ]);

  const handleJoinCall = () => {
    setIsInCall(true);
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "You",
        message: chatMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  if (!isInCall) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Video Call</h1>
          <p className="text-gray-600 mt-1">Start or join a video conference</p>
        </div>

        {/* Call Options */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="card p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start New Call
            </h3>
            <p className="text-gray-600 mb-4">
              Create a new video conference room
            </p>
            <button onClick={handleJoinCall} className="btn btn-primary w-full">
              <Phone className="mr-2" size={20} />
              Start Call
            </button>
          </div>

          <div className="card p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Join Existing Call
            </h3>
            <p className="text-gray-600 mb-4">Enter a meeting ID or link</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter meeting ID or link"
                className="input w-full"
              />
              <button className="btn btn-secondary w-full">
                <Phone className="mr-2" size={20} />
                Join Call
              </button>
            </div>
          </div>

          {/* Recent Calls */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Calls
            </h3>
            <div className="space-y-3">
              {participants.slice(0, 3).map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {participant.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Last call: 2 hours ago
                    </p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Phone size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative">
        {/* Main Video Area */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-4 h-full">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {participant.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}

              {/* Participant Info */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {participant.name}
              </div>

              {/* Status Indicators */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {!participant.isAudioOn && (
                  <div className="bg-red-500 p-1 rounded">
                    <MicOff size={12} className="text-white" />
                  </div>
                )}
                {participant.isScreenSharing && (
                  <div className="bg-blue-500 p-1 rounded">
                    <Share size={12} className="text-white" />
                  </div>
                )}
                {participant.isSpeaking && (
                  <div className="bg-green-500 p-1 rounded animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Screen Share Overlay */}
        {isScreenSharing && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <Share size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Screen Sharing Active
              </h3>
              <p className="text-gray-300">
                You are currently sharing your screen
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleToggleMute}
            className={`p-3 rounded-full ${
              isMuted
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-full ${
              !isVideoOn
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {!isVideoOn ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          <button
            onClick={handleToggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Share size={24} />
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-3 rounded-full ${
              showParticipants
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Users size={24} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full ${
              showChat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <MessageSquare size={24} />
          </button>

          <button className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">
            <Settings size={24} />
          </button>

          <button
            onClick={handleLeaveCall}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Side Panels */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Participants ({participants.length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {participant.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {participant.isAudioOn ? "Audio on" : "Audio off"} •{" "}
                      {participant.isVideoOn ? "Video on" : "Video off"}
                    </p>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Meeting Chat
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex space-x-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">
                      {msg.sender}
                    </p>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                    <p className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input flex-1"
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatMessage.trim()}
                  className="btn btn-primary px-3 py-2 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;

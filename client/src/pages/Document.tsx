import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CollaborativeEditor from "../components/CollaborativeEditor";
import { FileText, Users, Clock, Edit3 } from "lucide-react";

const Document: React.FC = () => {
  const { documentId } = useParams();
  const [documentData, setDocumentData] = useState({
    name: "Untitled Document",
    content:
      "<h1>Welcome to the Collaborative Editor!</h1><p>Start typing to begin collaborating in real-time. You can see other users typing, chat with them, and work together seamlessly.</p><p>Features include:</p><ul><li>Real-time collaborative editing</li><li>Live cursor tracking</li><li>Instant chat messaging</li><li>User presence indicators</li><li>Document versioning</li></ul>",
    collaborators: ["You", "Team Member 1", "Team Member 2"],
    lastModified: new Date(),
    version: 1,
  });

  return (
    <div className="h-full flex flex-col">
      {/* Document Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {documentData.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{documentData.collaborators.length} collaborators</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>
                    Modified {documentData.lastModified.toLocaleDateString()}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <Edit3 size={16} />
                  <span>Version {documentData.version}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn btn-outline px-4 py-2">
              <Users size={16} className="mr-2" />
              Invite
            </button>
            <button className="btn btn-primary px-4 py-2">
              <Edit3 size={16} className="mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Collaborative Editor */}
      <div className="flex-1 overflow-hidden">
        <CollaborativeEditor
          documentId={documentId || "default"}
          initialContent={documentData.content}
        />
      </div>
    </div>
  );
};

export default Document;

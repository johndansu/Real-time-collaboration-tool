import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  Edit,
  Download,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  description: string;
  author: string;
  lastModified: Date;
  size: string;
  type: string;
  project: string;
  collaborators: number;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Project Requirements Document",
      description: "Detailed requirements for the website redesign project",
      author: "John Doe",
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      size: "2.4 MB",
      type: "PDF",
      project: "Website Redesign",
      collaborators: 3,
    },
    {
      id: "2",
      title: "API Documentation",
      description: "Complete API reference for mobile app development",
      author: "Sarah Johnson",
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      size: "1.8 MB",
      type: "MD",
      project: "Mobile App Development",
      collaborators: 5,
    },
    {
      id: "3",
      title: "Marketing Strategy",
      description: "Q4 marketing campaign strategy and implementation plan",
      author: "Mike Chen",
      lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000),
      size: "3.1 MB",
      type: "DOCX",
      project: "Marketing Campaign Q4",
      collaborators: 2,
    },
    {
      id: "4",
      title: "Database Schema",
      description: "Database design and migration documentation",
      author: "Alex Rodriguez",
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      size: "856 KB",
      type: "SQL",
      project: "Database Migration",
      collaborators: 1,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "docx":
        return "📝";
      case "md":
        return "📖";
      case "sql":
        return "🗄️";
      default:
        return "📄";
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      doc.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Access and manage your project documents
          </p>
        </div>
        <button className="btn btn-primary px-4 py-2">
          <Plus size={20} className="mr-2" />
          New Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Documents
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">PDF Files</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.type === "PDF").length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collaborative</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.collaborators > 1).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  documents.filter(
                    (d) =>
                      Date.now() - d.lastModified.getTime() <
                      24 * 60 * 60 * 1000
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="MD">Markdown</option>
              <option value="SQL">SQL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.title}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{doc.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>
                        Modified {doc.lastModified.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📁 {doc.project}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👥 {doc.collaborators} collaborators</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Eye size={20} />
                </button>
                <Link
                  to={`/document/${doc.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={20} />
                </Link>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || typeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first document"}
          </p>
          {!searchQuery && typeFilter === "all" && (
            <button className="btn btn-primary px-4 py-2">
              <Plus size={20} className="mr-2" />
              Create Document
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Documents;

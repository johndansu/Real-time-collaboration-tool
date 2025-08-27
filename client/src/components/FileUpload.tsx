import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  File,
  X,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  Image,
  FileText,
  Video,
  Music,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  status: "uploading" | "completed" | "error";
  progress?: number;
}

interface FileUploadProps {
  projectId: string;
  onFileUpload?: (files: FileItem[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  projectId,
  onFileUpload,
  multiple = true,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image size={20} />;
    if (type.startsWith("video/")) return <Video size={20} />;
    if (type.startsWith("audio/")) return <Music size={20} />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`;
    }
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileType = file.type;
      if (
        !acceptedTypes.some(
          (type) =>
            type === fileType ||
            type === "*/*" ||
            (type.endsWith("/*") && fileType.startsWith(type.slice(0, -1)))
        )
      ) {
        return "File type not accepted";
      }
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (selectedFiles: FileList) => {
      const newFiles: FileItem[] = [];

      Array.from(selectedFiles).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          alert(error);
          return;
        }

        const fileItem: FileItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date(),
          status: "uploading",
          progress: 0,
        };

        newFiles.push(fileItem);
      });

      if (newFiles.length > 0) {
        setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
        simulateUpload(newFiles);
      }
    },
    [multiple, maxSize, accept]
  );

  const simulateUpload = (filesToUpload: FileItem[]) => {
    setUploading(true);

    filesToUpload.forEach((fileItem) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, status: "completed", progress: 100 }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f))
          );
        }
      }, 200);
    });

    setTimeout(() => setUploading(false), 2000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const downloadFile = (file: FileItem) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openFile = (file: FileItem) => {
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.includes("pdf")
    ) {
      window.open(file.url, "_blank");
    } else {
      downloadFile(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary-400 bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            {multiple ? "Upload multiple files" : "Upload a single file"} • Max
            size: {formatFileSize(maxSize)}
          </p>
          <p className="text-xs text-gray-400">
            Accepted types: {accept === "*/*" ? "All files" : accept}
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 btn btn-primary px-6 py-2"
        >
          Choose Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Uploaded Files ({files.length})
            </h3>
            {uploading && (
              <span className="text-sm text-blue-600">Uploading...</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div key={file.id} className="card p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h4>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize(file.size)} •{" "}
                      {file.uploadedAt.toLocaleDateString()}
                    </p>

                    {file.status === "uploading" && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openFile(file)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => downloadFile(file)}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center space-x-1"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

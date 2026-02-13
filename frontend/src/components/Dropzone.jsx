import { useState, useRef } from 'react';
import { uploadFile, uploadMultipleFiles } from '../api/files';
import toast from 'react-hot-toast';

export default function Dropzone({ onUploaded = () => {} }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);

  const handleFiles = async (selectedFiles) => {
    if (isUploading) return;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    try {
      if (selectedFiles.length === 1) {
        await uploadFile(selectedFiles[0], setProgress);
      } else {
        await uploadMultipleFiles(selectedFiles, setProgress);
      }

      toast.success('Upload successful');
      onUploaded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      handleFiles(droppedFiles);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current.click()}
        className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <p className="text-3xl mb-2">📤</p>
        <p className="font-semibold">
          {isUploading ? 'Uploading...' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supported: PDF, Images, Text • Max size: 10MB
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          disabled={isUploading}
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      </div>

      {progress > 0 && (
        <div className="mt-4">
          <div className="h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-blue-600 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isUploading ? 'Uploading...' : 'Uploaded '}{progress}%
          </p>
        </div>
      )}
    </div>
  );
}


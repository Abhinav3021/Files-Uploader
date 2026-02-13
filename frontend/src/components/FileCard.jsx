import { useState } from 'react';
import { downloadFile } from '../api/files';
import PreviewModal from './PreviewModal';
import toast from 'react-hot-toast';

export default function FileCard({ file, onDelete }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const mimeType = file?.mimeType || '';
  const isImage = mimeType.startsWith('image');
  const isPDF = mimeType === 'application/pdf';

  const handleDelete = async () => {
    const ok = window.confirm(`Delete "${file.originalName}"?`);
    if (!ok) return;

    try {
      await onDelete(file.id);
      toast.success('File deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/api/files/${file.id}/download`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Download link copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-4">
          {isImage ? (
            <img
              src={`/api/files/${file.id}/preview`}
              className="w-12 h-12 rounded object-cover cursor-pointer"
              onClick={() => setPreviewOpen(true)}
            />
          ) : (
            <div
              className="w-12 h-12 flex items-center justify-center bg-gray-400 rounded cursor-pointer"
              onClick={() => (isPDF ? setPreviewOpen(true) : null)}
            >
              📄
            </div>
          )}

          <div>
            <p className="font-medium">{file.originalName}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB •{' '}
              {new Date(file.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-sm">
          {(isImage || isPDF) && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="text-gray-600 hover:underline"
            >
              Preview
            </button>
          )}
          <button
            onClick={handleShare}
            className="text-indigo-600 hover:underline"
          >
            Share
          </button>
          <button
            onClick={() => downloadFile(file.id)}
            className="text-blue-600 hover:underline"
          >
            Download
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {previewOpen && (
        <PreviewModal
          file={file}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

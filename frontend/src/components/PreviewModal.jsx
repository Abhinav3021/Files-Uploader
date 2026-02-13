import { useEffect } from 'react';

export default function PreviewModal({ file, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!file) return null;

  const mimeType = file?.mimeType || '';
  const isImage = mimeType.startsWith('image');
  const isPDF = mimeType === 'application/pdf';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg max-w-3xl w-full p-4"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{file.originalName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {isImage && (
          <img
            src={`/api/files/${file.id}/preview`}
            className="max-h-[70vh] mx-auto rounded"
          />
        )}

        {isPDF && (
          <iframe
            src={`/api/files/${file.id}/preview`}
            className="w-full h-[70vh]"
          />
        )}

        {!isImage && !isPDF && (
          <p className="text-center text-gray-500">
            Preview not available
          </p>
        )}
      </div>
    </div>
  );
}

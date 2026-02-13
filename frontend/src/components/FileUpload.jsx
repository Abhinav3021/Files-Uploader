import { useState } from 'react';
import { uploadFile, uploadMultipleFiles } from '../api/files';

export default function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileNames, setFileNames] = useState([]);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setError('');
    setProgress(0);
    setFileNames(selectedFiles.map(f => f.name));

    try {
      if (selectedFiles.length === 1) {
        await uploadFile(selectedFiles[0], setProgress);
      } else {
        await uploadMultipleFiles(selectedFiles, setProgress);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">📤 Upload Files</h2>

      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="block w-full text-sm mb-4"
      />

      {fileNames.length > 0 && (
        <ul className="text-sm text-gray-600 mb-3 list-disc pl-5">
          {fileNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded h-3 mb-3">
          <div
            className="bg-green-600 h-3 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}

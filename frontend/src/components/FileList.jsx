import { useEffect, useState } from 'react';
import { getFiles, deleteFile } from '../api/files';
import FileCard from './FileCard';
import toast from 'react-hot-toast';

export default function FileList({ refreshKey = 0 }) {
  const [files, setFiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalSize, setTotalSize] = useState('');
  const [loading, setLoading] = useState(true);
  const normalize = (data) => {
    const list = Array.isArray(data?.files)
      ? data.files
      : Array.isArray(data)
        ? data
        : [];

    return {
      files: list,
      total: typeof data?.total === 'number' ? data.total : list.length,
      totalSize: data?.totalSize ?? '0 B'
    };
  };

  useEffect(() => {
    let mounted = true;

    const loadFiles = async () => {
      try {
        setLoading(true);
        const data = await getFiles();

        if (!mounted) return;

        const normalized = normalize(data);

        setFiles(normalized.files);
        setTotal(normalized.total);
        setTotalSize(normalized.totalSize);
      } catch (err) {
        toast.error('Failed to load files');
        console.log(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFiles();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      await deleteFile(id);
      toast.success('File deleted');

      // re-fetch safely
      const data = await getFiles();
      const normalized = normalize(data);
      setFiles(normalized.files);
      setTotal(normalized.total);
      setTotalSize(normalized.totalSize);
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="mt-10 max-w-3xl mx-auto space-y-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-20 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-6">
        No files uploaded yet
      </p>
    );
  }

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Your Files ({total} files, {totalSize})
      </h2>

      <div className="space-y-3">
        {files.map(file => (
          <FileCard
            key={file.id}
            file={file}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

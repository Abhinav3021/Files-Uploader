import express from 'express';
import { upload } from '../config/multer.js';
import { files } from '../data/fileStore.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { formatSize } from '../utils/formatSize.js';

const router = express.Router();

/**
 * POST /api/files
 * Upload single file
 */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  const file = req.file;

  const fileData = {
    id: `file_${crypto.randomUUID()}`,
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
    uploadedAt: new Date().toISOString(),
  };

  files.push(fileData);

  res.status(201).json({
    ...fileData,
    url: `/api/files/${fileData.id}/download`
  });
});

/**
 * POST /api/files/batch
 * Upload multiple files
 */
router.post('/batch', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Files are required' });
  }

  const uploadedFiles = req.files.map((file) => {
    const fileData = {
      id: `file_${crypto.randomUUID()}`,
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date().toISOString(),
    };

    files.push(fileData);
    return {
      ...fileData,
      url: `/api/files/${fileData.id}/download`
    };
  });

  res.status(201).json({
    files: uploadedFiles,
    count: uploadedFiles.length
  });
});

/**
 * GET /api/files
 * List all files
 */
router.get('/', (req, res) => {
  const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);

  res.json({
    files: files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      mimeType: f.mimeType,
      size: f.size,
      uploadedAt: f.uploadedAt
    })),
    total: files.length,
    totalSize: formatSize(totalSizeBytes)
  });
});

/**
 * GET /api/files/:id
 * Get file details
 */
router.get('/:id', (req, res) => {
  const file = files.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.json({
    id: file.id,
    originalName: file.originalName,
    filename: file.filename,
    mimeType: file.mimeType,
    size: file.size,
    uploadedAt: file.uploadedAt,
    url: `/api/files/${file.id}/download`
  });
});

/**
 * GET /api/files/:id/download
 * Download file
 */
router.get('/:id/download', (req, res) => {
  const file = files.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.setHeader('Content-Type', file.mimeType);
  res.download(path.resolve(file.path), file.originalName);
});

/**
 * GET /api/files/:id/preview
 * Inline preview (no download)
 */
router.get('/:id/preview', (req, res) => {
  const file = files.find(f => f.id === req.params.id);

  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
  res.sendFile(path.resolve(file.path));
});

/**
 * DELETE /api/files/:id
 * Delete file
 */
router.delete('/:id', (req, res) => {
  const index = files.findIndex(f => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'File not found' });
  }

  const [file] = files.splice(index, 1);

  fs.unlink(file.path, (err) => {
    if (err) console.error('Failed to delete file:', err);
  });

  res.json({ message: 'File deleted successfully' });
});

export default router;

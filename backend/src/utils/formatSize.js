export const formatSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

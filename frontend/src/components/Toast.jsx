export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white
        ${type === 'error' ? 'bg-red-500' : 'bg-green-600'}
      `}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">×</button>
      </div>
    </div>
  );
}

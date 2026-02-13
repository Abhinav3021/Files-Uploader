import { useState } from "react"
import FileList from "./components/FileList"
import Dropzone from "./components/Dropzone"

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        File Manager
      </h1>
      <Dropzone onUploaded={() => setRefreshKey((k) => k + 1)} />
      <FileList refreshKey={refreshKey} />
    </div>
  )
}

export default App

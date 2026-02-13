# File Uploader

A simple full‑stack file manager with drag‑and‑drop uploads, previews (images/PDF), and basic file actions.

**Stack**
- Frontend: React + Vite + Tailwind
- Backend: Express + Multer

**Features**
- Single and multi‑file uploads
- Drag & drop support
- File list with size, date, download, share, delete
- Image/PDF preview
- Upload progress

**Project Structure**
- `frontend/` React app
- `backend/` Express API
- `backend/uploads/` stored files (local)

**Requirements**
- Node.js

**Local Setup**
1. Install backend deps:
   - `cd backend`
   - `npm install`
2. Install frontend deps:
   - `cd ../frontend`
   - `npm install`
3. Run backend:
   - `cd ../backend`
   - `npm run dev`
4. Run frontend:
   - `cd ../frontend`
   - `npm run dev`

Frontend runs on Vite’s default port and proxies `/api` requests to `http://localhost:5000`.

**API (Backend)**
- `GET /api/files` list files
- `POST /api/files` upload single file (field: `file`)
- `POST /api/files/batch` upload multiple files (field: `files`)
- `GET /api/files/:id` file details
- `GET /api/files/:id/download` download file
- `DELETE /api/files/:id` delete file

**Upload Rules**
- Max size: 10 MB per file
- Allowed types: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`, `text/plain`

**Notes**
- File metadata is stored in memory on the backend (`backend/src/data/fileStore.js`), so it resets on server restart.


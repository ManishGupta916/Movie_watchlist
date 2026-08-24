# Movie Watchlist

## Run the backend

```powershell
cd backend
npm install
npm.cmd start
```

The API runs at `http://localhost:5002` and uses MongoDB from `backend/.env`.

## Run the frontend

```powershell
cd frontend
npm install
npm.cmd run dev
```

Open `http://localhost:5173`.

For a hosted backend, create `frontend/.env` with:

```env
VITE_API_URL=https://your-backend.example.com
```

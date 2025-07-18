# Music App

## What it does

- Upload audio files (MP3, WAV, FLAC)
- Analyzes BPM and musical key using AI
- Shows audio waveform
- Finds similar beats from other users using AI similarity matching
- Buy beats from other users with virtual coins
- Transaction history and earnings tracking

## Setup

1. Create .env file in root directory:
```
VITE_API_BASE=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Get Firebase credentials:
- Go to https://console.firebase.google.com
- Create new project or use existing
- Enable Authentication with Google provider
- Enable Storage
- Add localhost:3000 to authorized domains
- Copy config values to .env file

## Run the app

```
docker-compose up
```

App runs at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## How to use

1. Go to http://localhost:3000/login
2. Sign in with Google
3. Upload an audio file by dragging and dropping
4. Click "Analyze Beat" 
5. View BPM, key, and similar beats from other users
6. See AI similarity percentages for each recommended beat
7. Buy beats from other users with coins (starts with 100 coins)
8. Check History tab for purchases and earnings

## File requirements

- Audio files only (MP3, WAV, FLAC, etc)
- Maximum recommended size: 50MB
- First 30 seconds analyzed for speed

## Troubleshooting

- If Firebase auth fails: check .env file exists and has correct credentials
- If backend not responding: make sure Docker containers are running
- If upload fails: check file format and internet connection
- If analysis takes long: larger files take more time to process

## Development

Run without Docker:

Frontend:
```
cd frontend
npm install
npm run dev
```

Backend:
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
 
# Detection - Backend and Frontend Access Guide

This project contains:
- `fastapi/`: FastAPI backend (authentication APIs)
- `frontend/`: Next.js frontend

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Project Structure

```text
Detection/
	fastapi/
		requirements.txt
		api/
			main.py
			database.py
			deps.py
			models.py
			routers/
				auth.py
	frontend/
		package.json
		app/
```

## 1) Run Backend (FastAPI)

Open a terminal from the project root (`Detection/`):

```bash
cd fastapi
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
```

Set auth environment variables (used for JWT token creation/validation):

```bash
export AUTH_SECRET_KEY="your-secret-key"
export AUTH_ALGORITHM="HS256"
```

Start backend server:

```bash
cd api
python3 -m uvicorn main:app --reload
```

Backend is available at:
- `http://localhost:8000`

Useful backend endpoints:
- `GET /` -> health check
- `POST /auth/` -> register user
- `POST /auth/token` -> login and get bearer token
- `DELETE /auth/users/{user_id}` -> delete user (admin token required)

## 2) Run Frontend (Next.js)

Open another terminal from project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend is available at:
- `http://localhost:3000`

## 3) Access the App

1. Start backend first on port `8000`.
2. Start frontend on port `3000`.
3. Open `http://localhost:3000` in your browser.
4. Go to `/login` and authenticate using an existing account.

The frontend currently calls backend APIs at:
- `http://localhost:8000/auth/token`
- `http://localhost:8000/scan`

If backend host/port changes, update these URLs in frontend files.

Current status:
- `/auth` endpoints are implemented in backend.
- `/scan` is called by frontend home page, but a scan router is not present yet in `fastapi/api/routers/`.

## 4) Quick API Test (Optional)

Register:

```bash
curl -X POST "http://localhost:8000/auth/" \
	-H "Content-Type: application/json" \
	-d '{"email":"test@example.com","password":"test123"}'
```

Login:

```bash
curl -X POST "http://localhost:8000/auth/token" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "username=test@example.com&password=test123"
```

## Notes

- CORS is configured to allow `http://localhost:3000`.
- Database connection is currently configured in `fastapi/api/database.py`.
- Keep secrets out of source control for production use.

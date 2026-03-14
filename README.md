# QuickThumbnail

AI-powered thumbnail generation web application that creates high-quality thumbnails from text prompts. The platform allows content creators to generate visual thumbnails quickly without using complex design tools.

---

## Project Demo

Live Application  
https://quick-thumbnail1.vercel.app/

---
---

## Features

- AI-based thumbnail generation from text prompts
- Clean and minimal UI
- Fast response image generation
- Responsive layout for mobile and desktop
- Download generated thumbnails
- Lightweight full-stack architecture

---

## Tech Stack

### Frontend
- React (Vite)
- CSS
- Axios

### Backend
- Node.js
- Express.js

### AI Service
- AI Image Generation API

### Deployment
- Vercel (Frontend)
- Node Server (Backend)

---

## System Architecture

```
User
  │
  │  Prompt Input
  ▼
React Frontend (Vite)
  │
  │  API Request
  ▼
Node.js / Express Backend
  │
  │  Prompt Processing
  ▼
AI Image Generation API
  │
  │  Generated Image
  ▼
Frontend Display + Download
```

---

## Project Structure

```
QuickThumbnail
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   ├── routes
│   ├── controllers
│   ├── config
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

Clone the repository

```
git clone https://github.com/your-username/QuickThumbnail.git
cd QuickThumbnail
```

---

Install frontend dependencies

```
cd client
npm install
```

Install backend dependencies

```
cd server
npm install
```

---

## Environment Variables

Create `.env` inside the server directory.

```
API_KEY=your_api_key
PORT=5000
```

---

## Run the Application

Start backend

```
npm start
```

Start frontend

```
npm run dev
```

---

## API Endpoint

### Generate Thumbnail

```
POST /api/generate-thumbnail
```

Request Body

```
{
  "prompt": "YouTube gaming thumbnail with neon lighting"
}
```

Response

```
{
  "imageUrl": "generated_image_link"
}
```

---

## Deployment

Frontend is deployed using **Vercel**

Live Project  
https://quick-thumbnail1.vercel.app/

---

## Future Improvements

- User authentication
- Thumbnail templates
- Prompt history
- Image editing tools
- Dark mode UI

---

## Author

Ankit Kumar Tiwari

---

## License

This project is licensed under the MIT License.

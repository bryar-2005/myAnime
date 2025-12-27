MyAnime Features
================

Overview
--------
- Split roles: admin (manage catalog) and user (browse and track).
- Backend: Laravel API with Sanctum tokens.
- Frontend: React + Vite single-page app.

User Features
-------------
- Browse anime/manga catalog with filters.
- View anime details, episodes, and comments.
- Favorites, watchlist, and watch history.
- Profile with avatar and banner uploads.

Admin Features
--------------
- Create/update anime and episodes.
- Create genres and studios via API.

API Additions
-------------
- Auth logout endpoint: POST /api/auth/logout
- Genres: GET /api/genres, POST /api/genres
- Studios: GET /api/studios, POST /api/studios

Performance Improvements
------------------------
- Frontend route-based code splitting for faster initial load.
- Parallel API requests for home and detail views.
- Backend cache versioning to avoid full cache flushes.
- Database indexes for frequent filters and timelines.

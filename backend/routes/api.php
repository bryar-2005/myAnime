<?php

use App\Http\Controllers\AnimeController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\StudioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/token', [AuthController::class, 'token']);
Route::post('/auth/register', [AuthController::class, 'register']);

// --- TEMPORARY SECRET ROUTE (API) ---
// Visit https://your-site/api/seed-now to fill the database
Route::get('/seed-now', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return response()->json(['message' => 'Database has been seeded! You can now go to the homepage.']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me/favorites', [LibraryController::class, 'favorites']);
    Route::get('/me/watchlist', [LibraryController::class, 'watchlist']);
    Route::get('/me/history', [LibraryController::class, 'history']);
    Route::post('/anime/{anime}/favorite', [LibraryController::class, 'toggleFavorite']);
    Route::post('/anime/{anime}/watchlist', [LibraryController::class, 'toggleWatchlist']);
    Route::post('/anime/{anime}/watched', [LibraryController::class, 'markWatched']);
    Route::post('/user/media', [UserProfileController::class, 'updateMedia']);

    Route::post('/anime', [AnimeController::class, 'store']);
    Route::patch('/anime/{anime}', [AnimeController::class, 'update']);
    Route::post('/anime/{anime}/rate', [AnimeController::class, 'rate']);
    Route::post('/anime/{anime}/episodes', [EpisodeController::class, 'store']);
    Route::post('/anime/{anime}/comments', [CommentController::class, 'store']);
    Route::post('/genres', [GenreController::class, 'store']);
    Route::post('/studios', [StudioController::class, 'store']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::get('/anime', [AnimeController::class, 'index']);
Route::get('/anime/{anime}', [AnimeController::class, 'show']);
Route::get('/anime/{anime}/episodes', [EpisodeController::class, 'index']);
Route::get('/anime/{anime}/episodes/{episode}', [EpisodeController::class, 'show']);
Route::get('/anime/{anime}/comments', [CommentController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/studios', [StudioController::class, 'index']);

<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    // If Apache passes the request to PHP, serve the React Frontend
    return File::get(public_path('index.html'));
});

// Optional: specific fallback for other non-API routes if needed
Route::fallback(function () {
    return File::get(public_path('index.html'));
});

// --- TEMPORARY SECRET ROUTE ---
// Visit https://your-site/seed-now to fill the database
Route::get('/seed-now', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return 'Database has been seeded! You can now go to the homepage.';
});

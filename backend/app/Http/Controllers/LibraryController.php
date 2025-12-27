<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Favorite;
use App\Models\WatchHistory;
use App\Models\Watchlist;
use App\Http\Resources\AnimeResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LibraryController extends Controller
{
    public function favorites(Request $request)
    {
        $perPage = min(max($request->integer('per_page', 20), 1), 50);
        $favorites = $request->user()->favorites()
            ->with('anime.genres', 'anime.studio')
            ->latest()
            ->paginate($perPage);

        return LibraryResource::collection($favorites);
    }

    public function watchlist(Request $request)
    {
        $perPage = min(max($request->integer('per_page', 20), 1), 50);
        $watchlist = $request->user()->watchlists()
            ->with('anime.genres', 'anime.studio')
            ->latest()
            ->paginate($perPage);

        return LibraryResource::collection($watchlist);
    }

    public function history(Request $request)
    {
        $perPage = min(max($request->integer('per_page', 20), 1), 50);
        $history = $request->user()->watchHistories()
            ->with(['anime.genres', 'anime.studio', 'episode'])
            ->latest('watched_at')
            ->paginate($perPage);

        return LibraryResource::collection($history);
    }

    public function toggleFavorite(Request $request, Anime $anime)
    {
        $exists = Favorite::where('user_id', $request->user()->id)->where('anime_id', $anime->id)->first();
        if ($exists) {
            $exists->delete();
            return response()->json([
                'favorited' => false,
                'favorites_count' => $anime->favorites()->count(),
            ]);
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'anime_id' => $anime->id,
        ]);

        return response()->json([
            'favorited' => true,
            'favorites_count' => $anime->favorites()->count(),
        ]);
    }

    public function toggleWatchlist(Request $request, Anime $anime)
    {
        $exists = Watchlist::where('user_id', $request->user()->id)->where('anime_id', $anime->id)->first();
        if ($exists) {
            $exists->delete();
            return response()->json([
                'watchlisted' => false,
                'watchlist_count' => $anime->watchlists()->count(),
            ]);
        }

        Watchlist::create([
            'user_id' => $request->user()->id,
            'anime_id' => $anime->id,
        ]);

        return response()->json([
            'watchlisted' => true,
            'watchlist_count' => $anime->watchlists()->count(),
        ]);
    }

    public function markWatched(Request $request, Anime $anime)
    {
        $data = $request->validate([
            'episode_id' => [
                'nullable',
                Rule::exists('episodes', 'id')->where('anime_id', $anime->id),
            ],
            'progress_seconds' => 'nullable|integer|min:0',
        ]);

        $history = WatchHistory::create([
            'user_id' => $request->user()->id,
            'anime_id' => $anime->id,
            'episode_id' => $data['episode_id'] ?? null,
            'progress_seconds' => $data['progress_seconds'] ?? 0,
        ]);

        return (new LibraryResource($history->load(['anime.genres', 'anime.studio', 'episode'])))
            ->response()
            ->setStatusCode(201);
    }
}

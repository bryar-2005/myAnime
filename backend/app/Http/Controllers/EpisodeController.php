<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Episode;
use App\Http\Resources\EpisodeResource;
use Illuminate\Http\Request;

class EpisodeController extends Controller
{
    public function index(Anime $anime)
    {
        $perPage = min(max(request()->integer('per_page', 30), 1), 100);
        return EpisodeResource::collection($anime->episodes()->paginate($perPage));
    }

    public function show(Anime $anime, Episode $episode)
    {
        abort_if($episode->anime_id !== $anime->id, 404);
        return new EpisodeResource($episode);
    }

    public function store(Request $request, Anime $anime)
    {
        abort_unless($request->user()?->is_admin, 403, 'Admin only');

        $data = $request->validate([
            'number' => 'required|integer|min:1',
            'title' => 'nullable|string',
            'synopsis' => 'nullable|string',
            'thumbnail' => 'nullable|url',
            'stream_url' => 'nullable|url',
            'aired_at' => 'nullable|date',
        ]);

        $episode = $anime->episodes()->create($data);
        return (new EpisodeResource($episode))->response()->setStatusCode(201);
    }
}

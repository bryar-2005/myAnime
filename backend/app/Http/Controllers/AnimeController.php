<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Http\Resources\AnimeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AnimeController extends Controller
{
    private function cacheVersion(): string
    {
        return (string) Cache::rememberForever('anime_cache_version', fn() => '1');
    }

    private function bumpCacheVersion(): void
    {
        Cache::increment('anime_cache_version');
    }

    public function index(Request $request)
    {
        $perPage = min(max($request->integer('per_page', 12), 1), 50);

        $query = Anime::query()->with(['genres', 'studio'])->withCount(['favorites', 'episodes'])->withAvg('ratings', 'score');

        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('synopsis', 'like', '%' . $search . '%');
            });
        }

        if ($genre = $request->query('genre')) {
            $query->whereHas('genres', function ($q) use ($genre) {
                $q->where('slug', $genre);
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($season = $request->query('season')) {
            $query->where('season', (int) $season);
        }

        if ($year = $request->query('year')) {
            $query->where('year', (int) $year);
        }

        $sort = $request->query('sort', 'recent');
        $query->when($sort === 'popular', fn ($q) => $q->withCount('favorites')->orderByDesc('favorites_count'))
            ->when($sort === 'rated', fn ($q) => $q->orderByDesc('rating'))
            ->when($sort === 'recent', fn ($q) => $q->orderByDesc('created_at'));

        $cacheKey = 'anime_index:v' . $this->cacheVersion() . ':' . md5($request->fullUrl());

        return Cache::remember($cacheKey, 60, function () use ($query, $perPage) {
            return AnimeResource::collection($query->paginate($perPage));
        });
    }

    public function show(Anime $anime)
    {
        $cacheKey = 'anime_show:v' . $this->cacheVersion() . ':' . $anime->id;

        return Cache::remember($cacheKey, 60, function () use ($anime) {
            $anime->load(['genres', 'studio', 'episodes', 'favorites'])
                ->loadCount(['favorites', 'episodes'])
                ->loadAvg('ratings', 'score');
            
            if ($user = auth('sanctum')->user()) {
                $anime->load(['ratings' => fn($q) => $q->where('user_id', $user->id)]);
            }

            return new AnimeResource($anime);
        });
    }

    public function store(Request $request)
    {
        abort_unless($request->user()?->is_admin, 403, 'Admin only');

        $data = $request->validate([
            'title' => 'required|string',
            'synopsis' => 'nullable|string|max:2000',
            'cover_image' => 'nullable|url',
            'banner_image' => 'nullable|url',
            'pdf_url' => 'nullable|url',
            'status' => 'required|string|in:ongoing,completed,upcoming',
            'type' => 'required|string|in:TV,Movie,Manga,OVA',
            'rating' => 'nullable|integer|min:0|max:100',
            'year' => 'nullable|integer',
            'season' => 'nullable|integer|min:1|max:4',
            'studio_id' => 'nullable|exists:studios,id',
            'genres' => 'array',
            'genres.*' => 'exists:genres,id',
        ]);

        $data['slug'] = Str::slug($data['title']);
        $anime = Anime::create($data);
        $anime->genres()->sync($data['genres'] ?? []);
        $this->bumpCacheVersion();

        return (new AnimeResource($anime->load(['genres', 'studio'])))->response()->setStatusCode(201);
    }

    public function update(Request $request, Anime $anime)
    {
        abort_unless($request->user()?->is_admin, 403, 'Admin only');

        $data = $request->validate([
            'title' => 'sometimes|string',
            'synopsis' => 'nullable|string|max:2000',
            'cover_image' => 'nullable|url',
            'banner_image' => 'nullable|url',
            'pdf_url' => 'nullable|url',
            'status' => 'nullable|string|in:ongoing,completed,upcoming',
            'type' => 'nullable|string|in:TV,Movie,Manga,OVA',
            'rating' => 'nullable|integer|min:0|max:100',
            'year' => 'nullable|integer',
            'season' => 'nullable|integer|min:1|max:4',
            'studio_id' => 'nullable|exists:studios,id',
            'genres' => 'array',
            'genres.*' => 'exists:genres,id',
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $anime->update($data);
        if (isset($data['genres'])) {
            $anime->genres()->sync($data['genres']);
        }

        $this->bumpCacheVersion();

        return new AnimeResource($anime->load(['genres', 'studio']));
    }

    public function rate(Request $request, Anime $anime)
    {
        $data = $request->validate([
            'score' => 'required|integer|min:1|max:10',
        ]);

        $rating = \App\Models\Rating::updateOrCreate(
            ['user_id' => $request->user()->id, 'anime_id' => $anime->id],
            ['score' => $data['score']]
        );

        $this->bumpCacheVersion();

        return response()->json([
            'message' => 'Rating saved',
            'rating' => $rating,
        ]);
    }
}

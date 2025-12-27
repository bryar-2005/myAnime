<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnimeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'synopsis' => $this->synopsis,
            'cover_image' => $this->cover_image,
            'banner_image' => $this->banner_image,
            'pdf_url' => $this->pdf_url,
            'status' => $this->status,
            'type' => $this->type,
            'rating' => $this->ratings_avg_score ? round($this->ratings_avg_score, 1) : $this->rating,
            'year' => $this->year,
            'season' => $this->season,
            'studio' => new StudioResource($this->whenLoaded('studio')),
            'genres' => GenreResource::collection($this->whenLoaded('genres')),
            'favorites_count' => $this->whenCounted('favorites'),
            'episodes_count' => $this->whenCounted('episodes'),
            'user_rating' => $this->relationLoaded('ratings') 
                ? $this->ratings->first()?->score 
                : ($request->user() ? \App\Models\Rating::where('user_id', $request->user()->id)->where('anime_id', $this->id)->value('score') : null),
            'resume_episode' => $this->relationLoaded('watchHistories')
                ? $this->watchHistories->first()
                : ($request->user()
                    ? \App\Models\WatchHistory::where('user_id', $request->user()->id)
                        ->where('anime_id', $this->id)
                        ->with('episode')
                        ->latest('watched_at')
                        ->first()
                    : null),
            'created_at' => $this->created_at,
        ];
    }
}

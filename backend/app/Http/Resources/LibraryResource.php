<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'anime' => new AnimeResource($this->whenLoaded('anime') ?? $this->anime),
            'episode' => $this->when($this->episode_id, $this->episode),
            'progress_seconds' => $this->when(isset($this->progress_seconds), $this->progress_seconds),
            'watched_at' => $this->when($this->watched_at, $this->watched_at),
            'created_at' => $this->created_at,
        ];
    }
}

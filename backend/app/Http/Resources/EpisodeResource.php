<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EpisodeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'anime_id' => $this->anime_id,
            'number' => $this->number,
            'title' => $this->title,
            'synopsis' => $this->synopsis,
            'thumbnail' => $this->thumbnail,
            'stream_url' => $this->stream_url,
            'aired_at' => $this->aired_at,
        ];
    }
}

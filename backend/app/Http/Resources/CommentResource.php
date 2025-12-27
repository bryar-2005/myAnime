<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'user' => [
                'id' => $this->user->id ?? null,
                'name' => $this->user->name ?? 'User',
                'avatar_url' => $this->user->avatar_url ?? null,
            ],
            'created_at' => $this->created_at,
        ];
    }
}

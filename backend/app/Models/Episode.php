<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    use HasFactory;

    protected $fillable = [
        'anime_id',
        'number',
        'title',
        'synopsis',
        'thumbnail',
        'stream_url',
        'aired_at',
    ];

    protected $casts = [
        'aired_at' => 'date',
    ];

    public function anime()
    {
        return $this->belongsTo(Anime::class);
    }
}

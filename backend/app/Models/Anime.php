<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'synopsis',
        'cover_image',
        'banner_image',
        'pdf_url',
        'status',
        'type',
        'rating',
        'year',
        'season',
        'studio_id',
    ];

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }

    public function studio()
    {
        return $this->belongsTo(Studio::class);
    }

    public function episodes()
    {
        return $this->hasMany(Episode::class)->orderBy('number');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function watchlists()
    {
        return $this->hasMany(Watchlist::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function watchHistories()
    {
        return $this->hasMany(WatchHistory::class);
    }
}

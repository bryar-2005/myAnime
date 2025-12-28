<?php

namespace Database\Seeders;

use App\Models\Anime;
use App\Models\Episode;
use App\Models\Genre;
use App\Models\Studio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnimeSeeder extends Seeder
{
    public function run(): void
    {
        $genres = collect([
            'Action', 'Adventure', 'Drama', 'Romance', 'Sci-Fi', 'Fantasy', 'Slice of Life', 'Sports', 'Comedy',
        ])->mapWithKeys(function ($name) {
            return [$name => Genre::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name])];
        });

        // Fix: Use 'name' to find the studio to avoid duplicate errors
        $studio = Studio::firstOrCreate(['name' => 'Kyoto Animation'], ['slug' => 'kyoto-animation']);

        $anime = Anime::firstOrCreate(
            ['slug' => 'celestial-pulse'],
            [
            'title' => 'Celestial Pulse',
            'synopsis' => 'A group of teens pilot bio-mechs to keep an orbiting city alive while unraveling the mystery of the vanished earth.',
            'cover_image' => 'https://placehold.co/600x800/cf7fff/1b1035?text=Celestial+Pulse',
            'banner_image' => 'https://placehold.co/1600x600/0f1624/78ffd6?text=Celestial+Pulse',
            'status' => 'ongoing',
            'type' => 'TV',
            'rating' => 86,
            'year' => 2025,
            'season' => 1,
            'studio_id' => $studio->id,
            ]
        );

        $anime->genres()->sync([
            $genres['Action']->id,
            $genres['Sci-Fi']->id,
            $genres['Drama']->id,
        ]);

        for ($i = 1; $i <= 6; $i++) {
            Episode::firstOrCreate(
                ['anime_id' => $anime->id, 'number' => $i],
                [
                'anime_id' => $anime->id,
                'number' => $i,
                'title' => 'Episode ' . $i . ': Resonance',
                'synopsis' => 'The crew pushes deeper into the derelict ring, uncovering a secret that shifts alliances.',
                'thumbnail' => 'https://placehold.co/640x360/13192b/78ffd6?text=Ep+' . $i,
                'stream_url' => 'https://example.com/streams/celestial-pulse/' . $i,
                ]
            );
        }
    }
}

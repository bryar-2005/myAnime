<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GenreSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'action' => 'ئەکشن',
            'adventure' => 'سەرکێشی',
            'comedy' => 'کۆمیدی',
            'drama' => 'دراما',
            'fantasy' => 'فانتازیا',
            'horror' => 'ترسناک',
            'mystery' => 'نادیار',
            'psychological' => 'دەروونی',
            'romance' => 'ڕۆمانسی',
            'sci-fi' => 'زانستی خەیاڵی',
            'slice-of-life' => 'ژیاننامە',
            'sports' => 'وەرزشی',
            'supernatural' => 'سەروو سروشت',
            'thriller' => 'ترسێنەر',
            'mecha' => 'مێکا',
            'music' => 'میوزیک',
            'school' => 'قوتابخانە',
            'historical' => 'مێژوویی',
            'military' => 'سەربازی',
            'magic' => 'سیحر',
            'isekai' => 'ئایسێکای',
            'cyberpunk' => 'سایبەرپانک',
            'martial-arts' => 'هونەری جەنگی',
            'space' => 'بۆشایی',
            'parody' => 'پارۆدی',
            'game' => 'یاری',
        ];

        foreach ($genres as $slug => $name) {
            Genre::updateOrCreate(['slug' => $slug], ['name' => $name]);
        }
    }
}

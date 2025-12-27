<?php

namespace Database\Seeders;

use App\Models\Studio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudioSeeder extends Seeder
{
    public function run(): void
    {
        $studios = [
            'Kyoto Animation',
            'Bones',
            'MAPPA',
            'Madhouse',
            'A-1 Pictures',
            'Production I.G',
            'Trigger',
            'Ufotable',
            'Wit Studio',
            'CloverWorks',
            'Shaft',
            'Sunrise',
            'Pierrot',
            'Toei Animation',
            'J.C.Staff',
            'Silver Link.',
            'David Production',
            'Brains Base',
            'TMS Entertainment',
            'Studio Ghibli',
            'Graphinica',
            'Orange',
            'Lerche',
            'White Fox',
            'TNK',
            '8bit',
            'Science SARU',
        ];

        foreach ($studios as $name) {
            Studio::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            );
        }
    }
}

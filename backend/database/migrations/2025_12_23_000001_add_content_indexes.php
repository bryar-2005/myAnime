<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('animes', function (Blueprint $table) {
            $table->index('status', 'animes_status_idx');
            $table->index('type', 'animes_type_idx');
            $table->index('year', 'animes_year_idx');
            $table->index('season', 'animes_season_idx');
            $table->index('created_at', 'animes_created_at_idx');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->index(['anime_id', 'created_at'], 'comments_anime_created_idx');
        });

        Schema::table('watch_histories', function (Blueprint $table) {
            $table->index(['user_id', 'watched_at'], 'watch_histories_user_watched_idx');
        });
    }

    public function down(): void
    {
        Schema::table('animes', function (Blueprint $table) {
            $table->dropIndex('animes_status_idx');
            $table->dropIndex('animes_type_idx');
            $table->dropIndex('animes_year_idx');
            $table->dropIndex('animes_season_idx');
            $table->dropIndex('animes_created_at_idx');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropIndex('comments_anime_created_idx');
        });

        Schema::table('watch_histories', function (Blueprint $table) {
            $table->dropIndex('watch_histories_user_watched_idx');
        });
    }
};

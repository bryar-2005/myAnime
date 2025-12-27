<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('studios', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('animes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('synopsis')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('banner_image')->nullable();
            $table->enum('status', ['ongoing', 'completed', 'upcoming'])->default('ongoing');
            $table->string('type')->default('TV');
            $table->unsignedTinyInteger('rating')->default(0);
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedSmallInteger('season')->nullable(); // 1 winter, 2 spring, 3 summer, 4 fall
            $table->foreignId('studio_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('anime_genre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained()->cascadeOnDelete();
            $table->foreignId('genre_id')->constrained()->cascadeOnDelete();
            $table->unique(['anime_id', 'genre_id']);
        });

        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('number');
            $table->string('title')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('stream_url')->nullable();
            $table->date('aired_at')->nullable();
            $table->timestamps();
            $table->unique(['anime_id', 'number']);
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('anime_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'anime_id']);
        });

        Schema::create('watchlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('anime_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'anime_id']);
        });

        Schema::create('watch_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('anime_id')->constrained()->cascadeOnDelete();
            $table->foreignId('episode_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('watched_at')->useCurrent();
            $table->unsignedInteger('progress_seconds')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('watch_histories');
        Schema::dropIfExists('watchlists');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('episodes');
        Schema::dropIfExists('anime_genre');
        Schema::dropIfExists('animes');
        Schema::dropIfExists('studios');
        Schema::dropIfExists('genres');
    }
};

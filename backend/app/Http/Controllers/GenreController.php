<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use App\Http\Resources\GenreResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GenreController extends Controller
{
    public function index()
    {
        $genres = Genre::orderBy('name')->get();
        return GenreResource::collection($genres);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()?->is_admin, 403, 'Admin only');

        $data = $request->validate([
            'name' => 'required|string|max:100|unique:genres,name',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $genre = Genre::create($data);

        return (new GenreResource($genre))->response()->setStatusCode(201);
    }
}

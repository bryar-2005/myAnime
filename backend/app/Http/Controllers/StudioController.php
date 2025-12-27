<?php

namespace App\Http\Controllers;

use App\Models\Studio;
use App\Http\Resources\StudioResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudioController extends Controller
{
    public function index()
    {
        $studios = Studio::orderBy('name')->get();
        return StudioResource::collection($studios);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()?->is_admin, 403, 'Admin only');

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:studios,name',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $studio = Studio::create($data);

        return (new StudioResource($studio))->response()->setStatusCode(201);
    }
}

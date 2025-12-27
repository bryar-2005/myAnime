<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\Anime;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Anime $anime)
    {
        $perPage = min(max($request->integer('per_page', 30), 1), 50);
        $comments = Comment::with('user:id,name,avatar_url')
            ->where('anime_id', $anime->id)
            ->latest()
            ->paginate($perPage);
        return CommentResource::collection($comments);
    }

    public function store(Request $request, Anime $anime)
    {
        $data = $request->validate([
            'body' => 'required|string|min:3|max:1000',
        ]);

        $body = trim(strip_tags($data['body']));

        if (empty($body)) {
            return response()->json(['message' => 'Comment body cannot be empty after sanitization.'], 422);
        }

        $comment = Comment::create([
            'anime_id' => $anime->id,
            'user_id' => $request->user()->id,
            'body' => $body,
        ]);

        return (new CommentResource($comment->load('user:id,name,avatar_url')))->response()->setStatusCode(201);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function updateMedia(Request $request)
    {
        $data = $request->validate([
            'avatar' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:4096',
        ]);

        $user = $request->user();

        if (isset($data['avatar'])) {
            $path = $data['avatar']->storePublicly('avatars', ['disk' => 'public']);
            $user->avatar_url = Storage::disk('public')->url($path);
        }

        if (isset($data['banner'])) {
            $path = $data['banner']->storePublicly('banners', ['disk' => 'public']);
            $user->banner_url = Storage::disk('public')->url($path);
        }

        $user->save();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'is_admin', 'avatar_url', 'banner_url', 'created_at']),
        ]);
    }
}

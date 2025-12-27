<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter([
        env('FRONTEND_ORIGIN', 'http://127.0.0.1:5173'),
        env('FRONTEND_ORIGIN_ALT', 'http://localhost:5173'),
        env('FRONTEND_ORIGIN_PROD'),
    ]),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

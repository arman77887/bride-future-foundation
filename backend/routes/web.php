<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Bride Future Foundation API',
        'version' => '1.0.0',
        'status' => 'online'
    ]);
});

<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * API tidak boleh redirect ke route login, jadi return null.
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return null;
        }
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function Laravel\Prompts\alert;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {

        if (Auth::check()) {
            return $next($request);
        }

        return redirect('/');
    }
}

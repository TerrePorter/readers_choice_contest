<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('admin/index');
    }
}

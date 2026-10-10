<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Show the public welcome page with each campaign's currently active event.
     */
    public function index(): Response
    {
        $now = Carbon::now();


        $campaigns = Campaigns::with(['events' => function ($query) use ($now) {
            $query
                ->where(function ($query) use ($now) {
                    $query->whereNull('start_date')->orWhere('start_date', '<=', $now);
                })
                ->where(function ($query) use ($now) {
                    $query->whereNull('end_date')->orWhere('end_date', '>=', $now);
                });
        }])->orderBy('name')->get();

        return Inertia::render('welcome', [
            'campaigns' => $campaigns,
        ]);
    }
}

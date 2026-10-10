<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use Inertia\Inertia;
use Inertia\Response;

class AdminCampaignsController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        $data = Campaigns::with([
            'events' => function ($query) {
                $query->orderBy('end_date', 'desc');
            },
            'events.categories:id',
        ])->orderByDesc('id')->get()->toArray();

        return Inertia::render('admin/campaigns', [
            'campaigns' => $data,
            'categoryGroups' => CategoriesController::categoryGroups(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use App\Models\Categories;
use App\Models\CategoriesDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesDatabaseController extends Controller
{
    /**
     * Show the admin businesses page.
     */
    public function adminIndex(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $city = $request->string('city')->toString();
        $categoryId = $request->integer('category_id') ?: null;
        $campaignId = $request->integer('campaign_id') ?: null;

        $businesses = CategoriesDatabase::with('category')
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($city, fn ($query) => $query->where('city', 'like', "%{$city}%"))
            ->when($categoryId, fn ($query) => $query->where('category_id', $categoryId))
            ->when($campaignId, fn ($query) => $query->where('campaign_id', $campaignId))
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/businesses', [
            'businesses' => $businesses,
            'filters' => [
                'search' => $search,
                'city' => $city,
                'category_id' => $categoryId,
                'campaign_id' => $campaignId,
            ],
            'categoryGroups' => CategoriesController::categoryGroups(),
            'campaigns' => Campaigns::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created business (admin).
     */
    public function adminStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
        ]);

        CategoriesDatabase::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business created.')]);

        return back();
    }

    /**
     * Update the given business (admin).
     */
    public function adminUpdate(Request $request, CategoriesDatabase $business): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
        ]);

        $business->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business updated.')]);

        return back();
    }

    /**
     * Delete the given business (admin).
     */
    public function adminDestroy(CategoriesDatabase $business): RedirectResponse
    {
        $business->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business deleted.')]);

        return back();
    }

    /**
     * Search businesses within the given category by name.
     */
    public function index(Request $request, Categories $category): JsonResponse
    {
        $query = CategoriesDatabase::where('category_id', $category->id);

        if ($request->filled('campaign_id')) {
            $query->where('campaign_id', $request->integer('campaign_id'));
        }

        if ($request->filled('q')) {
            $query->where('name', 'like', '%'.$request->string('q').'%');
        }

        return response()->json(
            $query->orderBy('name')->limit(50)->get(['id', 'name', 'city']),
        );
    }

    /**
     * Create a new business entry within the given category.
     */
    public function store(Request $request, Categories $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'campaign_id' => ['required', 'integer'],
        ]);

        $business = CategoriesDatabase::create([
            'category_id' => $category->id,
            'campaign_id' => $validated['campaign_id'],
            'name' => $validated['name'],
            'city' => $validated['city'] ?? null,
        ]);

        return response()->json($business->only(['id', 'name', 'city']));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\CategoriesGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesController extends Controller
{
    /**
     * Show the admin categories page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/categories', [
            'categoryGroups' => self::categoryGroups(),
            'groups' => CategoriesGroup::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'group_id' => ['required', 'integer', 'exists:categories_groups,id'],
        ]);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '_', $validated['name'])));

        Categories::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'group_id' => $validated['group_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category created.')]);

        return to_route('adminCategories');
    }

    /**
     * Update the given category.
     */
    public function update(Request $request, Categories $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'group_id' => ['required', 'integer', 'exists:categories_groups,id'],
        ]);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '_', $validated['name'])));

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'group_id' => $validated['group_id'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category updated.')]);

        return to_route('adminCategories');
    }

    /**
     * Fetch every category grouped by its category group, for admin use.
     */
    public static function categoryGroups()
    {
        return Categories::with('group')
            ->orderBy('name')
            ->get()
            ->groupBy(fn ($category) => $category->group->id ?? 0)
            ->map(function ($categories, $groupId) {
                $group = $categories->first()->group;

                return [
                    'id' => $group->id ?? 0,
                    'name' => $group->name ?? 'Other',
                    'categories' => $categories
                        ->map(fn ($category) => [
                            'id' => $category->id,
                            'name' => $category->name,
                            'group_id' => $category->group_id,
                        ])
                        ->values(),
                ];
            })
            ->sortBy('name')
            ->values();
    }
}

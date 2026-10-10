<?php

namespace App\Http\Controllers;

use App\Models\Campaigns;
use App\Models\Events;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventsController extends Controller
{
    /**
     * Show the public event page.
     */
    public function show(Events $event): Response
    {
        $categories = $event->eventCategories()
            ->with('category.group')
            ->get()
            ->pluck('category')
            ->filter();

        $categoryGroups = $categories
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
                        ])
                        ->sortBy('name')
                        ->values(),
                ];
            })
            ->sortBy('name')
            ->values();

        return Inertia::render('event', [
            'event' => $event,
            'categoryGroups' => $categoryGroups,
        ]);
    }

    /**
     * Store a newly created event for the given campaign.
     */
    public function store(Request $request, Campaigns $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'banner_image' => ['nullable', 'image', 'max:5120'],
            'info_text' => ['nullable', 'string'],
            'info_text_image' => ['nullable', 'image', 'max:5120'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'category_ids' => ['array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
        ]);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '_', $validated['name'])));

        $event = $campaign->events()->create([
            'name' => $validated['name'],
            'slug' => $slug,
            'banner_image' => $request->file('banner_image')?->store('event-banners', 'public'),
            'info_text' => $validated['info_text'] ?? null,
            'info_text_image' => $request->file('info_text_image')?->store('event-banners/info', 'public'),
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        $event->categories()->sync($validated['category_ids'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event created.')]);

        return to_route('adminCampaigns');
    }

    /**
     * Update the given event.
     */
    public function update(Request $request, Events $event): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'banner_image' => ['nullable', 'image', 'max:5120'],
            'info_text' => ['nullable', 'string'],
            'info_text_image' => ['nullable', 'image', 'max:5120'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'category_ids' => ['array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
        ]);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '_', $validated['name'])));

        $bannerImage = $event->banner_image;

        if ($request->hasFile('banner_image')) {
            if ($bannerImage) {
                Storage::disk('public')->delete($bannerImage);
            }

            $bannerImage = $request->file('banner_image')->store('event-banners', 'public');
        }

        $infoTextImage = $event->info_text_image;

        if ($request->hasFile('info_text_image')) {
            if ($infoTextImage) {
                Storage::disk('public')->delete($infoTextImage);
            }

            $infoTextImage = $request->file('info_text_image')->store('event-banners/info', 'public');
        }

        $event->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'banner_image' => $bannerImage,
            'info_text' => $validated['info_text'] ?? null,
            'info_text_image' => $infoTextImage,
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        $event->categories()->sync($validated['category_ids'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('adminCampaigns');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Ballot;
use App\Models\CategoriesDatabase;
use App\Models\EventCategories;
use App\Models\Events;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BallotController extends Controller
{
    /**
     * Save a ballot: one nominated business per category, for this event.
     */
    public function store(Request $request, Events $event): JsonResponse
    {
        $sessionId = $request->session()->getId();

        $alreadyVoted = Ballot::where('event_id', $event->id)
            ->where('session_id', $sessionId)
            ->exists();

        if ($alreadyVoted) {
            return response()->json([
                'message' => 'You have already submitted a ballot for this event.',
            ], 409);
        }

        $validated = $request->validate([
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.category_id' => ['required', 'integer'],
            'entries.*.categories_database_id' => ['required', 'integer'],
        ]);

        $categoryIds = EventCategories::where('event_id', $event->id)
            ->pluck('category_id');

        foreach ($validated['entries'] as $entry) {
            if (! $categoryIds->contains($entry['category_id'])) {
                throw ValidationException::withMessages([
                    'entries' => 'One of the selected categories does not belong to this event.',
                ]);
            }

            $business = CategoriesDatabase::find($entry['categories_database_id']);

            if (! $business || $business->category_id !== $entry['category_id']) {
                throw ValidationException::withMessages([
                    'entries' => 'One of the selected businesses does not belong to its category.',
                ]);
            }
        }

        $ballotToken = (string) Str::uuid();

        foreach ($validated['entries'] as $entry) {
            Ballot::create([
                'ballot_token' => $ballotToken,
                'event_id' => $event->id,
                'category_id' => $entry['category_id'],
                'categories_database_id' => $entry['categories_database_id'],
                'session_id' => $sessionId,
            ]);
        }

        return response()->json(['status' => true]);
    }
}

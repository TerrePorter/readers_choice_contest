<?php

namespace App\Http\Controllers;

use App\Models\Ballot;
use App\Models\Campaigns;
use App\Models\Categories;
use App\Models\CategoriesDatabase;
use App\Models\Events;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportsController extends Controller
{
    /**
     * Show the ballot counts report: businesses by category, for a selected campaign and event.
     */
    public function ballots(Request $request): Response
    {
        $campaigns = Campaigns::orderBy('name')->get(['id', 'name']);
        $campaignId = $request->integer('campaign_id') ?: $campaigns->first()?->id;
        $eventId = $request->integer('event_id') ?: null;

        $events = $campaignId
            ? Events::where('campaign_id', $campaignId)->orderBy('name')->get(['id', 'name'])
            : collect();

        return Inertia::render('admin/reports/ballots', [
            'campaigns' => $campaigns,
            'campaignId' => $campaignId,
            'events' => $events,
            'eventId' => $eventId,
            'report' => $campaignId ? $this->buildReport($campaignId, $eventId) : collect(),
        ]);
    }

    /**
     * Export the ballot counts report as a CSV download.
     */
    public function ballotsExport(Request $request): StreamedResponse
    {
        $campaignId = $request->integer('campaign_id');

        abort_if(! $campaignId, 404);

        $campaign = Campaigns::findOrFail($campaignId);
        $eventId = $request->integer('event_id') ?: null;
        $event = $eventId ? Events::find($eventId) : null;

        $report = $this->buildReport($campaignId, $eventId);

        $filename = collect([
            'ballot-report',
            Str::slug($campaign->name),
            $event ? Str::slug($event->name) : null,
        ])->filter()->implode('-').'.csv';

        return response()->streamDownload(function () use ($report) {
            $handle = fopen('php://output', 'w');

            foreach ($report->groupBy('groupName') as $groupName => $categories) {
                fputcsv($handle, [$groupName]);
                fputcsv($handle, []);

                foreach ($categories as $category) {
                    fputcsv($handle, [$category['name']]);
                    fputcsv($handle, ['Business', 'Votes']);

                    foreach ($category['businesses'] as $business) {
                        fputcsv($handle, [$business['name'], $business['votes']]);
                    }

                    fputcsv($handle, []);
                }
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    /**
     * Build the category => businesses => vote count report for a campaign, optionally scoped to one event.
     */
    private function buildReport(int $campaignId, ?int $eventId = null): Collection
    {
        $eventsQuery = Events::where('campaign_id', $campaignId);

        if ($eventId) {
            $eventsQuery->where('id', $eventId);
        }

        $eventIds = $eventsQuery->pluck('id');

        $counts = Ballot::whereIn('event_id', $eventIds)
            ->select('category_id', 'categories_database_id', DB::raw('count(*) as votes'))
            ->groupBy('category_id', 'categories_database_id')
            ->get();

        $categories = Categories::with('group')
            ->whereIn('id', $counts->pluck('category_id')->unique())
            ->get()
            ->keyBy('id');

        $businesses = CategoriesDatabase::whereIn('id', $counts->pluck('categories_database_id')->unique())
            ->get()
            ->keyBy('id');

        return $counts
            ->groupBy('category_id')
            ->map(function ($rows, $categoryId) use ($categories, $businesses) {
                $category = $categories->get($categoryId);

                return [
                    'id' => (int) $categoryId,
                    'name' => $category?->name ?? 'Unknown category',
                    'groupId' => $category?->group_id ?? 0,
                    'groupName' => $category?->group?->name ?? 'Other',
                    'totalVotes' => $rows->sum('votes'),
                    'businesses' => $rows
                        ->map(fn ($row) => [
                            'id' => $row->categories_database_id,
                            'name' => $businesses->get($row->categories_database_id)?->name ?? 'Unknown business',
                            'city' => $businesses->get($row->categories_database_id)?->city,
                            'votes' => (int) $row->votes,
                        ])
                        ->sortByDesc('votes')
                        ->values(),
                ];
            })
            ->sortBy([
                ['groupName', 'asc'],
                ['name', 'asc'],
            ])
            ->values();
    }
}

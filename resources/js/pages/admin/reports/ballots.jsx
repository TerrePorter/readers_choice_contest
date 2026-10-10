import { Head, router } from '@inertiajs/react';
import ReportsController from '@/actions/App/Http/Controllers/ReportsController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

export default function AdminBallotReport({
    campaigns,
    campaignId,
    events,
    eventId,
    report,
}) {
    function handleCampaignChange(value) {
        router.get(
            ReportsController.ballots.url(),
            { campaign_id: value },
            { preserveState: true, replace: true },
        );
    }

    function handleEventChange(value) {
        router.get(
            ReportsController.ballots.url(),
            {
                campaign_id: campaignId,
                event_id: value !== 'all' ? value : undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    const exportUrl = campaignId
        ? ReportsController.ballotsExport.url({
              query: {
                  campaign_id: campaignId,
                  event_id: eventId ?? undefined,
              },
          })
        : null;

    const groupedReport = report.reduce((groups, category) => {
        let group = groups.find((g) => g.id === category.groupId);

        if (!group) {
            group = {
                id: category.groupId,
                name: category.groupName,
                categories: [],
            };
            groups.push(group);
        }

        group.categories.push(category);

        return groups;
    }, []);

    return (
        <>
            <Head title="Ballot Report" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Heading
                        title="Ballot Report"
                        description="Business nomination counts by category, per campaign and event."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={campaignId ? String(campaignId) : undefined}
                            onValueChange={handleCampaignChange}
                        >
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="Select a campaign" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map((campaign) => (
                                    <SelectItem
                                        key={campaign.id}
                                        value={String(campaign.id)}
                                    >
                                        {campaign.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={eventId ? String(eventId) : 'all'}
                            onValueChange={handleEventChange}
                        >
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="All events" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All events in campaign
                                </SelectItem>
                                {events.map((event) => (
                                    <SelectItem
                                        key={event.id}
                                        value={String(event.id)}
                                    >
                                        {event.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {exportUrl ? (
                            <Button asChild variant="outline">
                                <a href={exportUrl}>Export CSV</a>
                            </Button>
                        ) : (
                            <Button variant="outline" disabled>
                                Export CSV
                            </Button>
                        )}
                    </div>
                </div>

                {report.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No ballots have been cast for this campaign yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {groupedReport.map((group) => (
                            <div key={group.id} className="flex flex-col gap-3">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {group.name}
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {group.categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="overflow-hidden rounded-lg border border-gray-200 shadow-md"
                                        >
                                            <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {category.name}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {category.totalVotes}{' '}
                                                    {category.totalVotes === 1
                                                        ? 'vote'
                                                        : 'votes'}
                                                </span>
                                            </div>
                                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                                <tbody className="divide-y divide-gray-100">
                                                    {category.businesses.map(
                                                        (business, index) => (
                                                            <tr
                                                                key={
                                                                    business.id
                                                                }
                                                            >
                                                                <td className="w-8 px-6 py-3 text-gray-400">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <div className="font-medium text-gray-900">
                                                                        {
                                                                            business.name
                                                                        }
                                                                    </div>
                                                                    {business.city && (
                                                                        <div className="text-xs text-gray-500">
                                                                            {
                                                                                business.city
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                                                    {
                                                                        business.votes
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminBallotReport.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

import { Head } from '@inertiajs/react';
import EditEventDialog from '@/components/edit-event-dialog';
import Heading from '@/components/heading';
import NewEventDialog from '@/components/new-event-dialog';
import { EnlargeableImage } from '@/components/ui/enlargeable-image';
import { dashboard } from '@/routes';

function NewTR({ campaignEvents, categoryGroups }) {
    return (
        <>
            {campaignEvents.map((campaignEvent) => (
                <tr key={campaignEvent.id}>
                    <th className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            <div className="font-medium text-gray-700">
                                {campaignEvent.id}
                            </div>
                        </div>
                    </th>
                    <td className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            <div className="font-medium text-gray-700">
                                {campaignEvent.name}
                            </div>
                        </div>
                    </td>

                    <td className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            {campaignEvent.banner_image ? (
                                <EnlargeableImage
                                    src={`/event/images/${campaignEvent.banner_image}`}
                                    alt={campaignEvent.name}
                                    thumbnailClassName="h-12 "
                                />
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </div>
                    </td>

                    <td className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            <div className="font-medium text-gray-700">
                                {campaignEvent.start_date}
                            </div>
                        </div>
                    </td>

                    <td className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            <div className="font-medium text-gray-700">
                                {campaignEvent.end_date}
                            </div>
                        </div>
                    </td>
                    <td className="gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="text-sm">
                            <EditEventDialog
                                event={campaignEvent}
                                categoryGroups={categoryGroups}
                                trigger={
                                    <button className="w-24 rounded border border-blue-600 bg-blue-600 px-4 py-2 text-center text-white hover:bg-transparent hover:text-blue-600 focus:ring focus:outline-none active:text-blue-500">
                                        Edit
                                    </button>
                                }
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}

export default function AdminCampaignsIndex({ campaigns, categoryGroups }) {
    return (
        <>
            <Head title="Admin Campaigns" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Admin Campaigns"
                    description="Add and edit campaigns."
                />

                {campaigns.map((campaign, index) => (
                    <div
                        key={index}
                        className="m-5 overflow-hidden rounded-lg border border-gray-200 shadow-md"
                    >
                        <div className="flex w-full flex-row justify-between p-3">
                            <div className=" ">
                                <h2 className="border-l-4 border-blue-500 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text py-1 pl-3 text-2xl font-extrabold text-transparent">
                                    {campaign.name}
                                </h2>
                            </div>
                            <div className="">
                                <NewEventDialog
                                    campaignId={campaign.id}
                                    categoryGroups={categoryGroups}
                                    trigger={
                                        <button className="w-44 rounded border border-blue-600 bg-blue-600 px-6 py-2 text-center text-white hover:bg-transparent hover:text-blue-600 focus:ring focus:outline-none active:text-blue-500">
                                            New Campaign
                                        </button>
                                    }
                                />
                            </div>
                        </div>

                        {campaign.events.length > 0 ? (
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            Campaign Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            Image
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            Start Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            End Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 font-medium text-gray-900"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border-t border-gray-100">
                                    <NewTR
                                        campaignEvents={campaign.events}
                                        categoryGroups={categoryGroups}
                                    />
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex justify-center">
                                <div
                                    className="w-96 border-t border-b border-blue-500 bg-blue-100 px-4 py-3 text-blue-700"
                                    role="alert"
                                >
                                    <p className="font-bold">
                                        No Campaigns to Display.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

AdminCampaignsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

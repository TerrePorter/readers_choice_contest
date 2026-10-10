import { Head, Link } from '@inertiajs/react';
import EventsController from '@/actions/App/Http/Controllers/EventsController';

export default function Welcome({ campaigns }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center gap-16 bg-background px-6 py-16">
                {campaigns.map((campaign) => {
                    const banners = campaign.events.filter(
                        (event) => event.banner_image,
                    );

                    return (
                        <div
                            key={campaign.id}
                            className="flex w-full max-w-2xl flex-col items-center gap-4 text-center"
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {campaign.name}
                            </h1>

                            {banners.length > 0 ? (
                                banners.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={EventsController.show.url(
                                            event.slug,
                                        )}
                                        className="block w-full max-w-xl"
                                    >
                                        <img
                                            src={`/event/images/${event.banner_image}`}
                                            alt={event.name}
                                            className="w-full rounded-lg border border-border object-contain transition-opacity hover:opacity-90"
                                        />
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No active event to show right now.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

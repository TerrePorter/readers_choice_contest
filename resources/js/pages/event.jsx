import { Head } from '@inertiajs/react';
import { useState } from 'react';
import BallotController from '@/actions/App/Http/Controllers/BallotController';
import { CategoryGroupBallotSection } from '@/components/category-group-ballot-section';
import { postJson } from '@/lib/fetch-json';

const MAX_BALLOTS = 10;

export default function Event({ event, categoryGroups }) {
    const [ballotEntries, setBallotEntries] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const numberOfBallots = Object.keys(ballotEntries).length;
    const canSave = numberOfBallots >= MAX_BALLOTS;

    function handleSelect(categoryId, business) {
        setBallotEntries((prev) => ({ ...prev, [categoryId]: business }));
    }

    function handleClear(categoryId) {
        setBallotEntries((prev) => {
            const next = { ...prev };
            delete next[categoryId];
            return next;
        });
    }

    async function handleSaveBallot() {
        setSaving(true);
        setError(null);

        try {
            await postJson(BallotController.store.url(event.id), {
                entries: Object.entries(ballotEntries).map(
                    ([categoryId, business]) => ({
                        category_id: Number(categoryId),
                        categories_database_id: business.id,
                    }),
                ),
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err.data?.message ??
                    'Something went wrong saving your ballot. Please try again.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Head title={event.name} />

            {event.banner_image && (
                <img
                    src={`/event/images/${event.banner_image}`}
                    alt={event.name}
                    className="w-full object-cover"
                />
            )}

            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-12">
                <div className="flex flex-col gap-4">
                    <h1 className="text-center text-3xl font-bold tracking-tight text-foreground">
                        {event.name}
                    </h1>

                    {(event.info_text || event.info_text_image) && (
                        <div
                            className={
                                event.info_text && event.info_text_image
                                    ? 'grid items-start gap-6 md:grid-cols-2'
                                    : 'grid gap-6'
                            }
                        >
                            {event.info_text && (
                                <p className="whitespace-pre-line text-muted-foreground">
                                    {event.info_text}
                                </p>
                            )}

                            {event.info_text_image && (
                                <img
                                    src={`/event/images/${event.info_text_image}`}
                                    alt={`${event.name} info`}
                                    className="w-full rounded-lg border border-border object-contain"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="mx-auto w-full max-w-5xl">
                    <div className="rounded border border-amber-400 bg-amber-100 py-3 text-amber-700">
                        <p className="text-center">
                            Improperly completed ballots will be eliminated.
                        </p>
                    </div>
                </div>

                {success ? (
                    <div className="mx-auto w-full max-w-5xl">
                        <div className="rounded border border-green-400 bg-green-100 py-3 text-green-700">
                            <p className="text-center">
                                Ballot saved! Thanks for voting.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {categoryGroups.map((group) => (
                            <CategoryGroupBallotSection
                                key={group.id}
                                group={group}
                                campaignId={event.campaign_id}
                                entries={ballotEntries}
                                onSelect={handleSelect}
                                onClear={handleClear}
                            />
                        ))}

                        <div className="mx-auto w-full max-w-5xl">
                            {error && (
                                <p className="mb-2 text-center text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="mt-5 flex items-center justify-between rounded border border-gray-400 bg-gray-100 py-3 text-gray-700">
                                <div className="p-2 text-center">
                                    Have {numberOfBallots} of {MAX_BALLOTS}{' '}
                                    ballot entries!
                                </div>
                                {canSave && (
                                    <button
                                        type="button"
                                        onClick={handleSaveBallot}
                                        disabled={saving}
                                        className="mr-2 inline-flex items-center justify-center rounded-lg border border-blue-300 bg-white px-4 py-1 text-sm font-medium text-blue-800 hover:bg-green-50 disabled:opacity-50"
                                    >
                                        {saving ? 'Saving…' : 'Save'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

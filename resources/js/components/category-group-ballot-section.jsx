import { useEffect, useState } from 'react';
import CategoriesDatabaseController from '@/actions/App/Http/Controllers/CategoriesDatabaseController';
import { postJson } from '@/lib/fetch-json';
import { cn } from '@/lib/utils';

export function CategoryGroupBallotSection({
    group,
    campaignId,
    entries,
    onSelect,
    onClear,
}) {
    const [activeCategoryId, setActiveCategoryId] = useState(
        group.categories[0]?.id ?? null,
    );
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingNew, setAddingNew] = useState(false);
    const [newBiz, setNewBiz] = useState({ name: '', city: '' });
    const [creating, setCreating] = useState(false);

    const activeCategory = group.categories.find(
        (category) => category.id === activeCategoryId,
    );
    const savedEntry = activeCategoryId ? entries[activeCategoryId] : null;

    useEffect(() => {
        setQuery('');
        setResults([]);
        setAddingNew(false);
        setNewBiz({ name: '', city: '' });
    }, [activeCategoryId]);

    useEffect(() => {
        if (!activeCategoryId || savedEntry || !query) {
            setResults([]);
            return;
        }

        setLoading(true);

        const timeout = setTimeout(() => {
            const url = CategoriesDatabaseController.index.url(
                activeCategoryId,
                { query: { q: query, campaign_id: campaignId } },
            );

            fetch(url, { headers: { Accept: 'application/json' } })
                .then((response) => response.json())
                .then((data) => setResults(data))
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategoryId, query, savedEntry, campaignId]);

    function handleSelect(business) {
        onSelect(activeCategoryId, business);
        setAddingNew(false);
    }

    async function handleCreateBusiness(event) {
        event.preventDefault();

        if (!newBiz.name.trim()) {
            return;
        }

        setCreating(true);

        try {
            const business = await postJson(
                CategoriesDatabaseController.store.url(activeCategoryId),
                {
                    name: newBiz.name,
                    city: newBiz.city,
                    campaign_id: campaignId,
                },
            );

            handleSelect(business);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="mt-16">
            <div className="ml-2 w-full text-2xl font-bold text-gray-800">
                {group.name}
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-1/3">
                    <div className="md:hidden">
                        <label
                            htmlFor={`category-select-${group.id}`}
                            className="mb-1 block text-sm font-semibold text-gray-800"
                        >
                            Categories
                        </label>
                        <select
                            id={`category-select-${group.id}`}
                            value={activeCategoryId ?? ''}
                            onChange={(event) =>
                                setActiveCategoryId(Number(event.target.value))
                            }
                            className="w-full rounded-lg border border-gray-700 bg-white p-3 text-base text-gray-800 shadow-md"
                        >
                            {group.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                    {entries[category.id] ? ' ✓' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mx-auto hidden max-w-lg overflow-hidden rounded-md bg-white shadow-md md:block">
                        <div className="bg-gray-100 px-4 py-2">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Categories
                            </h2>
                        </div>
                        <div className="h-72 overflow-y-auto">
                            <ul className="divide-y divide-gray-200">
                                {group.categories.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() =>
                                            setActiveCategoryId(category.id)
                                        }
                                        className={cn(
                                            'flex cursor-pointer items-center px-6 py-4 hover:bg-green-300',
                                            category.id === activeCategoryId &&
                                                'bg-blue-300',
                                        )}
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg text-gray-800">
                                                {category.name}
                                                {entries[category.id] && (
                                                    <span className="ml-2 text-green-700">
                                                        ✓
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {savedEntry ? (
                    <div className="mt-2 w-full md:w-2/3">
                        <div className="mt-2 rounded border border-yellow-400 bg-yellow-100 py-3 text-yellow-700">
                            <p className="text-center text-2xl">
                                Selected Business
                            </p>
                            <div className="flex items-center justify-center gap-2 bg-amber-100 px-6 py-4">
                                <div className="text-lg text-gray-800">
                                    {savedEntry.name}
                                </div>
                                {savedEntry.city && (
                                    <div className="text-lg text-gray-800">
                                        - {savedEntry.city}
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => onClear(activeCategoryId)}
                                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <div>Search {activeCategory?.name}</div>
                        <input
                            className="w-full rounded-lg border border-gray-700 p-3 shadow-md duration-300 ease-in-out placeholder:text-base focus:outline-none"
                            type="text"
                            placeholder="Search Business..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />

                        {loading && (
                            <p className="mt-2 text-sm text-gray-600">
                                Searching…
                            </p>
                        )}

                        {!loading && results.length > 0 && (
                            <ul className="mt-2 divide-y divide-gray-200">
                                {results.map((business) => (
                                    <li
                                        key={business.id}
                                        onClick={() => handleSelect(business)}
                                        className="flex cursor-pointer items-center gap-2 px-6 py-4 hover:bg-green-300"
                                    >
                                        <div className="text-lg text-gray-800">
                                            {business.name}
                                        </div>
                                        {business.city && (
                                            <div className="text-lg text-gray-800">
                                                - {business.city}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {!loading &&
                            query &&
                            results.length === 0 &&
                            !addingNew && (
                                <div className="mt-2 rounded border border-blue-400 bg-blue-100 py-3 text-blue-700">
                                    <p className="text-center">
                                        No results found. <br /> Try a different
                                        search, or add it below.
                                    </p>
                                    <div
                                        onClick={() => setAddingNew(true)}
                                        className="m-auto cursor-pointer pl-2 text-center text-blue-600 underline"
                                    >
                                        Create a NEW Business Entry
                                    </div>
                                </div>
                            )}

                        {addingNew && (
                            <form
                                onSubmit={handleCreateBusiness}
                                className="mt-3 rounded-lg bg-white p-5 shadow"
                            >
                                <h4 className="mb-2 text-lg font-semibold text-gray-800">
                                    Enter the Business Information
                                </h4>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        placeholder="Name"
                                        value={newBiz.name}
                                        onChange={(event) =>
                                            setNewBiz((prev) => ({
                                                ...prev,
                                                name: event.target.value,
                                            }))
                                        }
                                        className="w-full grow rounded-lg border-transparent bg-gray-200 px-4 py-2.5 text-base text-black placeholder-gray-600 focus:bg-white focus:outline-none"
                                    />
                                    <input
                                        placeholder="City"
                                        value={newBiz.city}
                                        onChange={(event) =>
                                            setNewBiz((prev) => ({
                                                ...prev,
                                                city: event.target.value,
                                            }))
                                        }
                                        className="w-full grow rounded-lg border-transparent bg-gray-200 px-4 py-2.5 text-base text-black placeholder-gray-600 focus:bg-white focus:outline-none sm:w-1/4"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="mt-3 inline-flex items-center rounded-md bg-black px-5 py-2.5 font-medium text-white transition duration-300 hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {creating ? 'Saving…' : 'Save'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CategoriesDatabaseController from '@/actions/App/Http/Controllers/CategoriesDatabaseController';
import EditBusinessDialog from '@/components/edit-business-dialog';
import Heading from '@/components/heading';
import NewBusinessDialog from '@/components/new-business-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

export default function AdminBusinessesIndex({
    businesses,
    filters,
    categoryGroups,
    campaigns,
}) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [cityValue, setCityValue] = useState(filters.city ?? '');
    const [categoryValue, setCategoryValue] = useState(
        filters.category_id ? String(filters.category_id) : 'all',
    );
    const [campaignValue, setCampaignValue] = useState(
        filters.campaign_id ? String(filters.campaign_id) : 'all',
    );

    function applyFilters(overrides = {}) {
        const next = {
            search: searchValue,
            city: cityValue,
            category_id: categoryValue,
            campaign_id: campaignValue,
            ...overrides,
        };

        router.get(
            CategoriesDatabaseController.adminIndex.url(),
            {
                search: next.search || undefined,
                city: next.city || undefined,
                category_id:
                    next.category_id && next.category_id !== 'all'
                        ? next.category_id
                        : undefined,
                campaign_id:
                    next.campaign_id && next.campaign_id !== 'all'
                        ? next.campaign_id
                        : undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    function handleFilterSubmit(event) {
        event.preventDefault();
        applyFilters();
    }

    function handleClearFilters() {
        setSearchValue('');
        setCityValue('');
        setCategoryValue('all');
        setCampaignValue('all');

        router.get(
            CategoriesDatabaseController.adminIndex.url(),
            {},
            { preserveState: true, replace: true },
        );
    }

    function handleDelete(business) {
        if (!confirm(`Delete "${business.name}"? This cannot be undone.`)) {
            return;
        }

        router.delete(
            CategoriesDatabaseController.adminDestroy.url(business.id),
        );
    }

    return (
        <>
            <Head title="Admin Businesses" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Businesses"
                        description="Create, edit, and delete business entries."
                    />
                    <NewBusinessDialog
                        categoryGroups={categoryGroups}
                        campaigns={campaigns}
                        trigger={<Button>New Business</Button>}
                    />
                </div>

                <form
                    onSubmit={handleFilterSubmit}
                    className="flex flex-wrap items-end gap-2"
                >
                    <Input
                        type="search"
                        placeholder="Search by name..."
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        className="max-w-xs"
                    />

                    <Input
                        type="search"
                        placeholder="Filter by city..."
                        value={cityValue}
                        onChange={(event) => setCityValue(event.target.value)}
                        className="max-w-xs"
                    />

                    <Select
                        value={categoryValue}
                        onValueChange={(value) => {
                            setCategoryValue(value);
                            applyFilters({ category_id: value });
                        }}
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categoryGroups.map((group) => (
                                <SelectGroup key={group.id}>
                                    <SelectLabel>{group.name}</SelectLabel>
                                    {group.categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={campaignValue}
                        onValueChange={(value) => {
                            setCampaignValue(value);
                            applyFilters({ campaign_id: value });
                        }}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All campaigns" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All campaigns</SelectItem>
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

                    <Button type="submit" variant="outline">
                        Filter
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </Button>
                </form>

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-900">
                                    Name
                                </th>
                                <th className="px-6 py-4 font-medium text-gray-900">
                                    City
                                </th>
                                <th className="px-6 py-4 font-medium text-gray-900">
                                    Category
                                </th>
                                <th className="px-6 py-4 font-medium text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {businesses.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No businesses found.
                                    </td>
                                </tr>
                            )}

                            {businesses.data.map((business) => (
                                <tr key={business.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {business.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {business.city ?? '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {business.category?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <EditBusinessDialog
                                                business={business}
                                                categoryGroups={categoryGroups}
                                                campaigns={campaigns}
                                                trigger={
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                }
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(business)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Page {businesses.current_page} of {businesses.last_page}{' '}
                        ({businesses.total} total)
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!businesses.prev_page_url}
                            onClick={() =>
                                router.get(
                                    businesses.prev_page_url,
                                    {},
                                    { preserveState: true },
                                )
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!businesses.next_page_url}
                            onClick={() =>
                                router.get(
                                    businesses.next_page_url,
                                    {},
                                    { preserveState: true },
                                )
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminBusinessesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

import { Head } from '@inertiajs/react';
import EditCategoryDialog from '@/components/edit-category-dialog';
import Heading from '@/components/heading';
import NewCategoryDialog from '@/components/new-category-dialog';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

export default function AdminCategoriesIndex({ categoryGroups, groups }) {
    return (
        <>
            <Head title="Admin Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Categories"
                        description="Manage categories and the groups they belong to."
                    />
                    <NewCategoryDialog
                        groups={groups}
                        trigger={<Button>New Category</Button>}
                    />
                </div>

                {categoryGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No categories yet.
                    </p>
                ) : (
                    categoryGroups.map((group) => (
                        <div
                            key={group.id}
                            className="overflow-hidden rounded-lg border border-gray-200 shadow-md"
                        >
                            <div className="bg-gray-50 px-6 py-3">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {group.name}
                                </h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {group.categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="flex items-center justify-between px-6 py-3"
                                    >
                                        <span className="text-gray-900">
                                            {category.name}
                                        </span>
                                        <EditCategoryDialog
                                            category={category}
                                            groups={groups}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Edit
                                                </Button>
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

AdminCategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

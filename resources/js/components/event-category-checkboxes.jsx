import { useState } from 'react';

export function EventCategoryCheckboxes({
    categoryGroups,
    defaultSelectedIds = [],
}) {
    const allCategoryIds = categoryGroups.flatMap((group) =>
        group.categories.map((category) => category.id),
    );
    const [selectedIds, setSelectedIds] = useState(
        () => new Set(defaultSelectedIds),
    );

    const allSelected =
        allCategoryIds.length > 0 &&
        allCategoryIds.every((id) => selectedIds.has(id));

    function toggleCategory(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    }

    function toggleSelectAll() {
        setSelectedIds(allSelected ? new Set() : new Set(allCategoryIds));
    }

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm leading-none font-medium">
                    Categories
                </span>
                {allCategoryIds.length > 0 && (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                            className="size-4 rounded border-input"
                        />
                        Select all
                    </label>
                )}
            </div>
            <div className="max-h-48 overflow-y-auto rounded-md border border-input p-3">
                {categoryGroups.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No categories yet.
                    </p>
                )}

                {categoryGroups.map((group) => (
                    <div key={group.id} className="mb-3 last:mb-0">
                        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {group.name}
                        </p>
                        <div className="flex flex-col gap-1">
                            {group.categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="category_ids[]"
                                        value={category.id}
                                        checked={selectedIds.has(category.id)}
                                        onChange={() =>
                                            toggleCategory(category.id)
                                        }
                                        className="size-4 rounded border-input"
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

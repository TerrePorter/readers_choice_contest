import { Form } from '@inertiajs/react';
import { useState } from 'react';
import CategoriesDatabaseController from '@/actions/App/Http/Controllers/CategoriesDatabaseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditBusinessDialog({
    business,
    categoryGroups,
    campaigns,
    trigger,
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit business</DialogTitle>
                    <DialogDescription>
                        Update this business&apos;s details.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...CategoriesDatabaseController.adminUpdate.form(
                        business.id,
                    )}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={business.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    defaultValue={business.city ?? ''}
                                />
                                <InputError message={errors.city} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select
                                    name="category_id"
                                    defaultValue={String(business.category_id)}
                                >
                                    <SelectTrigger
                                        id="category_id"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryGroups.map((group) => (
                                            <SelectGroup key={group.id}>
                                                <SelectLabel>
                                                    {group.name}
                                                </SelectLabel>
                                                {group.categories.map(
                                                    (category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={String(
                                                                category.id,
                                                            )}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="campaign_id">Campaign</Label>
                                <Select
                                    name="campaign_id"
                                    defaultValue={String(business.campaign_id)}
                                >
                                    <SelectTrigger
                                        id="campaign_id"
                                        className="w-full"
                                    >
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
                                <InputError message={errors.campaign_id} />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

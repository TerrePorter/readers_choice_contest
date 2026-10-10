import { Form } from '@inertiajs/react';
import { useState } from 'react';
import CategoriesController from '@/actions/App/Http/Controllers/CategoriesController';
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditCategoryDialog({ category, groups, trigger }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                    <DialogDescription>
                        Update this category&apos;s name or group.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...CategoriesController.update.form(category.id)}
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
                                    defaultValue={category.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="group_id">Group</Label>
                                <Select
                                    name="group_id"
                                    defaultValue={String(category.group_id)}
                                >
                                    <SelectTrigger
                                        id="group_id"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map((group) => (
                                            <SelectItem
                                                key={group.id}
                                                value={String(group.id)}
                                            >
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.group_id} />
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

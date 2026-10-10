import { Form } from '@inertiajs/react';
import { useState } from 'react';
import EventsController from '@/actions/App/Http/Controllers/EventsController';
import { EventCategoryCheckboxes } from '@/components/event-category-checkboxes';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
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

export default function NewEventDialog({
    campaignId,
    categoryGroups,
    trigger,
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New event</DialogTitle>
                    <DialogDescription>
                        Add a new event to this campaign.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...EventsController.store.form(campaignId)}
                    resetOnSuccess
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="banner_image">
                                    Banner image
                                </Label>
                                <Input
                                    id="banner_image"
                                    name="banner_image"
                                    type="file"
                                    accept="image/*"
                                />
                                <InputError message={errors.banner_image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="info_text">Info text</Label>
                                <textarea
                                    id="info_text"
                                    name="info_text"
                                    rows={5}
                                    className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.info_text} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="info_text_image">
                                    Info text image
                                </Label>
                                <Input
                                    id="info_text_image"
                                    name="info_text_image"
                                    type="file"
                                    accept="image/*"
                                />
                                <InputError message={errors.info_text_image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start date</Label>
                                <DateTimePicker
                                    id="start_date"
                                    name="start_date"
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End date</Label>
                                <DateTimePicker id="end_date" name="end_date" />
                                <InputError message={errors.end_date} />
                            </div>

                            <EventCategoryCheckboxes
                                categoryGroups={categoryGroups}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Create event
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

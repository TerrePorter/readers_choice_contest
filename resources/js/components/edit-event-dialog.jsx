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
import { EnlargeableImage } from '@/components/ui/enlargeable-image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditEventDialog({ event, categoryGroups, trigger }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit event</DialogTitle>
                    <DialogDescription>
                        Update this event&apos;s details.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...EventsController.update.form(event.id)}
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
                                    defaultValue={event.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="banner_image">
                                    Banner image
                                </Label>
                                {event.banner_image && (
                                    <EnlargeableImage
                                        src={`/event/images/${event.banner_image}`}
                                        alt={event.name}
                                        thumbnailClassName="h-20 "
                                    />
                                )}
                                <Input
                                    id="banner_image"
                                    name="banner_image"
                                    type="file"
                                    accept="image/*"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current image.
                                </p>
                                <InputError message={errors.banner_image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="info_text">Info text</Label>
                                <textarea
                                    id="info_text"
                                    name="info_text"
                                    rows={5}
                                    defaultValue={event.info_text ?? ''}
                                    className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.info_text} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="info_text_image">
                                    Info text image
                                </Label>
                                {event.info_text_image && (
                                    <EnlargeableImage
                                        src={`/event/images/${event.info_text_image}`}
                                        alt={`${event.name} info`}
                                        thumbnailClassName="h-20 "
                                    />
                                )}
                                <Input
                                    id="info_text_image"
                                    name="info_text_image"
                                    type="file"
                                    accept="image/*"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current image.
                                </p>
                                <InputError message={errors.info_text_image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start date</Label>
                                <DateTimePicker
                                    id="start_date"
                                    name="start_date"
                                    defaultValue={event.start_date}
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End date</Label>
                                <DateTimePicker
                                    id="end_date"
                                    name="end_date"
                                    defaultValue={event.end_date}
                                />
                                <InputError message={errors.end_date} />
                            </div>

                            <EventCategoryCheckboxes
                                categoryGroups={categoryGroups}
                                defaultSelectedIds={event.categories.map(
                                    (category) => category.id,
                                )}
                            />

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

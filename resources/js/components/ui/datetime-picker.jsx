import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function toParts(value) {
    if (!value) {
        return { date: undefined, time: '00:00' };
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return { date: undefined, time: '00:00' };
    }

    return { date: parsed, time: format(parsed, 'HH:mm') };
}

function combine(date, time) {
    if (!date) {
        return '';
    }

    const [hours, minutes] = (time || '00:00').split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0, 0);

    return format(combined, "yyyy-MM-dd'T'HH:mm");
}

function DateTimePicker({
    id,
    name,
    defaultValue,
    placeholder = 'Pick a date & time',
}) {
    const initial = toParts(defaultValue);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time);

    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        className={cn(
                            'flex-1 justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="size-4" />
                        {date ? format(date, 'PPP') : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>

            <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-28 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />

            <input type="hidden" name={name} value={combine(date, time)} />
        </div>
    );
}

export { DateTimePicker };

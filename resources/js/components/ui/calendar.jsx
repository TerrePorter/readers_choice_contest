import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = 'ghost',
    formatters,
    components,
    ...props
}) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                'bg-background group/calendar p-3 [--cell-size:2rem]',
                className,
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString('default', { month: 'short' }),
                ...formatters,
            }}
            classNames={{
                root: cn('w-fit', defaultClassNames.root),
                months: cn(
                    'relative flex flex-col gap-4 md:flex-row',
                    defaultClassNames.months,
                ),
                month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
                nav: cn(
                    'absolute inset-x-0 top-0 flex w-full items-center justify-between',
                    defaultClassNames.nav,
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
                    defaultClassNames.button_previous,
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
                    defaultClassNames.button_next,
                ),
                month_caption: cn(
                    'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
                    defaultClassNames.month_caption,
                ),
                caption_label: cn(
                    'select-none text-sm font-medium',
                    defaultClassNames.caption_label,
                ),
                table: 'w-full border-collapse',
                weekdays: cn('flex', defaultClassNames.weekdays),
                weekday: cn(
                    'flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none',
                    defaultClassNames.weekday,
                ),
                week: cn('mt-2 flex w-full', defaultClassNames.week),
                day: cn(
                    'group/day relative aspect-square h-full w-full p-0 text-center select-none',
                    defaultClassNames.day,
                ),
                today: cn(
                    'rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none',
                    defaultClassNames.today,
                ),
                outside: cn(
                    'text-muted-foreground aria-selected:text-muted-foreground',
                    defaultClassNames.outside,
                ),
                disabled: cn(
                    'text-muted-foreground opacity-50',
                    defaultClassNames.disabled,
                ),
                hidden: cn('invisible', defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === 'left') {
                        return (
                            <ChevronLeftIcon
                                className={cn('size-4', className)}
                                {...props}
                            />
                        );
                    }

                    if (orientation === 'right') {
                        return (
                            <ChevronRightIcon
                                className={cn('size-4', className)}
                                {...props}
                            />
                        );
                    }

                    return (
                        <ChevronDownIcon
                            className={cn('size-4', className)}
                            {...props}
                        />
                    );
                },
                DayButton: CalendarDayButton,
                ...components,
            }}
            {...props}
        />
    );
}

function CalendarDayButton({ className, day, modifiers, ...props }) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <Button
            variant="ghost"
            size="icon"
            data-day={day.date.toLocaleDateString()}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            className={cn(
                'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground',
                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton };

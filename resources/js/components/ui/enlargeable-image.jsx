import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function EnlargeableImage({ src, alt = '', className, thumbnailClassName }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'block cursor-zoom-in overflow-hidden rounded-md border border-input',
                    thumbnailClassName,
                )}
            >
                <img
                    src={src}
                    alt={alt}
                    className={cn('h-full w-full object-cover', className)}
                />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogTitle className="sr-only">
                        {alt || 'Image preview'}
                    </DialogTitle>
                    <img
                        src={src}
                        alt={alt}
                        className="h-auto w-full rounded-md object-contain"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export { EnlargeableImage };

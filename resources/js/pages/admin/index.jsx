import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { admin } from '@/routes';

export default function AdminIndex() {
    return (
        <>
            <Head title="Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Admin"
                    description="Administrative tools and settings."
                />
            </div>
        </>
    );
}

AdminIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: admin(),
        },
    ],
};

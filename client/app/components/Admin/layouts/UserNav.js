'use client';
import { Button } from '../../ui/button';
import { UserAvatar } from '../../ui/avatar';
import { useSelector } from 'react-redux';

export function UserNav() {
    const { user } = useSelector((state) => state.auth);

    return (
        <>
            <Button variant="ghost" className="relative h-6 w-6 rounded-full">
                <UserAvatar user={user} />
            </Button>

        </>
    );
}

import { type ExtendedUser } from '@/types/next-auth';
import { useSession, getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Props {
    user?: ExtendedUser;
    label: string;
}

export function UserInfo({ user, label }: Props) {
    // export function UserInfo() {

    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">{label}</p>
            </CardHeader>
            <CardContent className="space-y-2">
                <Row
                    label="id"
                    values={user?.id}
                />
                <Row
                    label="name"
                    values={user?.name}
                />
                <Row
                    label="email"
                    values={user?.email}
                />
                <Row
                    label="image"
                    values={user?.image}
                />
                <Row
                    label="role"
                    values={user?.role}
                />
                <Row
                    label="two factor authentication"
                    values={user?.isTwoFactorEnable}
                />
            </CardContent>
        </Card>
    );
}

export function Row({ label, values }: { label: string; values: string | boolean | undefined | null }) {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm ">
            <p className="capitalize text-sm">{label}</p>
            <p className="truncate text-xs max-w-[180px] font-mono py-1 px-2 bg-slate-200 dark:bg-slate-800 rounded-md ">
                {values !== undefined && values !== null ? values?.toString() : <span className="text-red-300">No data</span>}
            </p>
        </div>
    );
}

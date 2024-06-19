'use client';

import { currentRole, currentUser } from '@/lib/auth/current-login';
import { useCurrentRole, useCurrentUser } from '@/hooks/use-current-login';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleGate } from '../_party/components/role-gate';
import { FormSucces } from '@/app/auth/_party/components/form-succes';
import { Row } from '../_party/components/user-info';
import { Button } from '@/components/ui/button';
import { toast as toastSonner } from 'sonner';
import { admin } from '@/server/auth/admin';

export default function AdminPage() {
    const role = useCurrentRole();

    // API Route
    async function onApiRouteClick() {
        try {
            const res = await fetch('/api/code-with-antonio/antonio/admin', {
                method: 'GET',
            });
            if (res.ok) {
                toastSonner.success(<div className="text-green-500">Allow API Route</div>);
            } else {
                toastSonner.error(<div className="text-red-500">Not Allow API Route</div>);
            }
        } catch (error) {
            console.log('error fetch: ', error);
        }
    }

    // Server Action
    async function onServerActionClick() {
        const resAction = await admin();
        if (resAction.success) {
            toastSonner.success(<div className="text-green-500">{resAction.message}</div>);
        } else {
            toastSonner.error(<div className="text-red-500">{resAction.message}</div>);
        }
    }
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold">Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowRole="ADMIN">
                    <FormSucces message="You are allowed to see this content" />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm ">
                    <p className="capitalize text-sm">admin-only API route</p>
                    <Button
                        size="sm"
                        onClick={() => onApiRouteClick()}
                    >
                        click to test
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm ">
                    <p className="capitalize text-sm">admin-only Server action</p>
                    <Button
                        size="sm"
                        onClick={() => onServerActionClick()}
                    >
                        click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

'use client';

import { useRef, useTransition, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsIcon, RefreshCwIcon } from 'lucide-react';
import { toast as toastSonner } from 'sonner';

import { SettingUserSchema, TSettingUserSchema } from '@/schemas/auth';
import { ResponseSettingUser, settingUser } from '@/server/auth/setting-user';
import { getErrorMessage } from '@/utils/get-error-message';
import { useCurrentUser } from '@/hooks/use-current-login';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormItem, FormField, FormControl, FormDescription, FormMessage, FormLabel } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';

export default function SettingsPage() {
    const [isLoading, startTransition] = useTransition();
    const [response, setResponse] = useState<ResponseSettingUser | null>(null);
    const { data: session, update: updateSession } = useSession();

    const inputNameRef = useRef<HTMLInputElement>(null);

    const form = useForm<TSettingUserSchema>({
        resolver: zodResolver(SettingUserSchema),
        defaultValues: {
            name: session?.user.name || '',
            role: (session?.user?.role as TSettingUserSchema['role']) || 'USER',
            email: session?.user.email || '',
            password: '',
            newPassword: '',
            image: session?.user.image === null ? undefined : session?.user.image,
            isTwoFactorEnable: session?.user.isTwoFactorEnable,
        },
    });

    function handleOnSubmit(data: TSettingUserSchema) {
        // window.alert(JSON.stringify(data, null, 2));
        // return;
        startTransition(() => {
            settingUser(data)
                .then((result) => {
                    if (result.suceess) {
                        toastSonner.success(result.message);
                        updateSession(); // trigger update session using fetch on client component
                    } else {
                        toastSonner.error(result.message);
                    }
                })
                .catch((error) => void toastSonner.error(`Something went wrong! on action setting, error: ${getErrorMessage(error)}`));
        });
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold flex items-center justify-center">
                    <SettingsIcon className="mr-1 size-5" />
                    Setting
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {false && (
                    <div className="flex flex-row items-center space-x-2 justify-between rounded-lg border p-2 shadow-sm ">
                        <p className="capitalize text-sm">name</p>
                        <Input
                            ref={inputNameRef}
                            name="name"
                            className="h-8"
                        />
                        <Button
                            size="sm"
                            disabled={isLoading}
                            onClick={() => {
                                const txt = inputNameRef.current;
                                if (!txt) return;
                                // handleOnSubmit({ name: txt.value });
                            }}
                        >
                            update
                            {isLoading && <RefreshCwIcon className="ml-1 size-3 animate-spin" />}
                        </Button>
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}>
                        <div className="space-y-2 mb-8">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8"
                                                {...field}
                                                placeholder="John Wick"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="role"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {session?.user.isOAuth === false && (
                                <>
                                    <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        className="h-8"
                                                        {...field}
                                                        placeholder="john.wick@example.com"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="password"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        className="h-8"
                                                        autoComplete="off"
                                                        aria-autocomplete="none"
                                                        {...field}
                                                        placeholder="******"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="newPassword"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        className="h-8"
                                                        {...field}
                                                        placeholder="******"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="isTwoFactorEnable"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm !mt-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel>is Two Factor Enable</FormLabel>
                                                    <FormDescription>Enable two factor authentication for your account</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        disabled={isLoading}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <Button
                            size="default"
                            disabled={isLoading}
                            type="submit"
                            className="w-full h-7"
                        >
                            save
                            {isLoading && <RefreshCwIcon className="ml-1 size-3 animate-spin" />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

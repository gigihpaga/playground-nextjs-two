'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type TRegisterSchema, registerSchema, registerSchemaOptional, type TRegisterSchemaOptional } from '../schema/register';

import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/classnames';

export function FormRegister() {
    const router = useRouter();
    const pathname = usePathname();

    const [formStep, setFormStep] = React.useState<0 | 1>(0);

    const form = useForm<TRegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            name: '',
            studentId: '',
            year: '',
            password: '',
            comfirmPassword: '',
        },
    });

    // console.log('Watch: ', form.watch());

    function handleOnSubmit(data: TRegisterSchema) {
        console.log('Submitted: ', data);
        // window.alert(JSON.stringify(data, null, 2));
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 4)}</code>
                </pre>
            ),
        });
    }

    // console.log('FormLogin', 'RENDER !!!');
    return (
        <Card className="w-[450px]">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Start the journey with us today.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleOnSubmit)}
                        className="relative overflow-x-hidden"
                    >
                        {/* step 1 */}
                        <motion.div
                            className={cn('space-y-3 px-1', {
                                // hidden: formStep == 1,
                            })}
                            // formStep == 0 -> translateX == 0
                            // formStep == 1 -> translateX == -100%
                            animate={{
                                translateX: `-${formStep * 100}%`,
                            }}
                            transition={{
                                ease: 'easeInOut',
                            }}
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8 py-0"
                                                placeholder="Enter your name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8 py-0"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="studentId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8 py-0"
                                                placeholder="Enter your student id"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="year"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8 ">
                                                    <SelectValue placeholder="Select a verified year to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[10, 11, 12].map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            You can manage email addresses in your{' '}
                                            <Link
                                                className="underline"
                                                href="/examples/forms"
                                            >
                                                email settings
                                            </Link>
                                            .
                                        </FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                        {/* step 2 */}
                        <motion.div
                            className={cn('space-y-3 px-1 absolute top-0 left-0 right-0', {
                                // hidden: formStep == 0,
                            })}
                            /*   style={{
                                translateX: `${100 - formStep * 100}%`,
                            }} */
                            initial={{
                                translateX: `${100 - formStep * 100}%`,
                            }}
                            // formStep == 0 -> translateX == 100%
                            // formStep == 1 -> translateX == 0%
                            animate={{
                                translateX: `${100 - formStep * 100}%`,
                            }}
                            transition={{
                                ease: 'easeInOut',
                            }}
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8 py-0"
                                                placeholder="Enter your password"
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="comfirmPassword"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comcomfirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8 py-0"
                                                placeholder="Enter your comfirm password"
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                        {/*   
                        <Button variant="outline" type="submit" size="sm" className="h-7">
                            Submit 1
                        </Button> 
                        */}
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex gap-2 _justify-between">
                <Button
                    size="sm"
                    className={cn('h-7', { hidden: formStep == 1 })}
                    variant="default"
                    onClick={async () => {
                        // cara paga
                        const isValid = await form.trigger(['email', 'name', 'year', 'studentId'], { shouldFocus: true });
                        if (isValid) {
                            setFormStep(1);
                            router.push('?halo=paga', { scroll: false });
                        }
                        /* 
                        // cara elliot
                        const formState_1 = {
                            email: form.getFieldState('email'),
                            name: form.getFieldState('name'),
                            year: form.getFieldState('year'),
                            studentId: form.getFieldState('studentId'),
                        };
                        if (!formState_1.email.isDirty || formState_1.email.invalid) return;
                        if (!formState_1.name.isDirty || formState_1.name.invalid) return;
                        if (!formState_1.year.isDirty || formState_1.year.invalid) return;
                        if (!formState_1.studentId.isDirty || formState_1.studentId.invalid) return;
                        setFormStep(1); */
                    }}
                >
                    Next Step
                    <ArrowRight className="ml-2 size-3" />
                </Button>
                <Button
                    size="sm"
                    className={cn('h-7', { hidden: formStep == 0 })}
                    variant="ghost"
                    onClick={() => {
                        setFormStep(0);
                    }}
                >
                    Prev Step
                    <ArrowLeft className="ml-2 size-3" />
                </Button>
                <Button
                    size="sm"
                    className={cn('h-7', { hidden: formStep == 0 })}
                    onClick={() => {
                        // console.log('onclick submit: ', form.getValues());
                        form.handleSubmit(handleOnSubmit)();
                    }}
                >
                    Submit
                    <Send className="ml-2 size-3" />
                </Button>
            </CardFooter>
        </Card>
    );
}

function ComDummy() {
    return (
        <form>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Name of your project"
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                        <SelectTrigger id="framework">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="next">Next.js</SelectItem>
                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                            <SelectItem value="astro">Astro</SelectItem>
                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </form>
    );
}

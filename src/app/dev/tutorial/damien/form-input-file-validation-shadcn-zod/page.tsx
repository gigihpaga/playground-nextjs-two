'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MimeImage = ['png', 'jpeg', 'jpg', 'svg', 'tif', 'tiff', 'webp', 'gif'];

const formSchema = z.object({
    // file: typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional(),
    // file: z.instanceof(FileList).optional(),
    file:
        typeof window === 'undefined'
            ? z.any()
            : z
                  .instanceof(FileList)
                  .refine((file) => file.length == 1, 'File is required.')
                  .refine(
                      (files) => {
                          // return MimeImage.some((mime) => mime === files[0].type.split('/')[1]);
                          return MimeImage.some((mime) => mime === files?.[0]?.name.split('.').pop());
                      },
                      `File type must be: ${MimeImage.join(', ')}`
                  )
                  .refine((files) => files[0]?.size < 250_000, 'File max size is 250 KB.'),
});

export default function FormValidationInputFileShadcnZodPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const fileRef = form.register('file');

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        console.log(fileRef);
    };

    return (
        <div className="w-full container">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full p-10 space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            placeholder="shadcn"
                                            {...fileRef}
                                            // onChange={(event) => field.onChange(event.target?.files?.[0] ?? undefined)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

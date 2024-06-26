'use client';

import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { MultipleFileUploadField } from './upload/multiple-file-upload-field';
import { Button } from '@/components/ui/button';

interface Props {}

const ValidationSchema = z.object({
    files: z.array(
        z.object({
            url: z.string().min(1, 'url is Required'),
        })
    ),
});

type FormValues = z.infer<typeof ValidationSchema>;

export function FormUpload(props: Props) {
    return (
        <Formik<FormValues>
            initialValues={{ files: [] }}
            onSubmit={(values) => {
                console.log('values', values);
                return new Promise((res) => setTimeout(res, 2000));
            }}
            validationSchema={toFormikValidationSchema(ValidationSchema)}
        >
            {({ values, errors, isValid, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Form>
                    <MultipleFileUploadField name="files" />
                    <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
}

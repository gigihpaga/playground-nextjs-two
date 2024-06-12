import { FormRegister } from './_party/components/form-register';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function FormStepPage(req: PageProps) {
    // console.log('FormStepPage', 'RENDER !!!');
    return (
        <div className="w-full flex justify-center items-start py-[50px]">
            <FormRegister />
        </div>
    );
}

import { authRoutes } from '@/lib/auth/routes';
import { CardWrapper } from '../components/card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface Props {
    attribute?: string;
}

export function CardError({ attribute }: Props) {
    return (
        <CardWrapper
            headerLabel="Oops! something went wrong!"
            backButtonHref={authRoutes.login}
            backButtonLabel="Back to login"
        >
            <div className="h-full text-destructive flex justify-center items-center">
                <ExclamationTriangleIcon className="size-8" />
            </div>
        </CardWrapper>
    );
}

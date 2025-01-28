import { type Doc } from '~/.contentlayer/generated';
import { Tag, TagProps } from '../../components/tag';
import { Url } from '../../constants';
import { cn } from '@/lib/classnames';

interface Props {
    categories: Doc['tags'];
    currentSlug: Doc['tags'][number];
}

export function CategoriesPopulate({ categories, currentSlug }: Props) {
    return (
        <div className="px-0 md:px-10 sxl:px-20 mt-10 border-t-2 text-cb-dark border-b-2 border-solid border-cb-dark dark:border-cb-light py-4 flex items-start flex-wrap font-medium mx-5 md:mx-10 gap-2">
            {categories.map((category) => (
                <Category
                    key={category}
                    href={`${Url.categories}/${category}`}
                    isActive={currentSlug === category}
                    scroll={false}
                >
                    {category}
                </Category>
            ))}
        </div>
    );
}

type CategoryProps = TagProps & {
    isActive: boolean;
};

function Category({ children, href, isActive, ...props }: CategoryProps) {
    return (
        <Tag
            className={cn(
                'py-1.5 md:py-2 px-4 md:px-6 normal-case font-normal text-xs md:text-base',
                isActive ? 'bg-cb-dark text-cb-light' : 'bg-cb-light text-cb-dark'
            )}
            href={href}
            {...props}
        >
            #{children}
        </Tag>
    );
}

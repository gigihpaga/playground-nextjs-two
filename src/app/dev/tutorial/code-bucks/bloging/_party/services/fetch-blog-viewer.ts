import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function mutationIncrementView(slug: string) {
    // https://supabase.com/dashboard/project/yzblsoaierguxexuziaw/api?rpc=increment_blog_viewer
    try {
        let { data, error } = await supabase.rpc('increment_blog_viewer', {
            slug_text: slug,
        });
        if (error) {
            console.error('Error incrementing view count inside try-catch', error);
        } else console.log('data supabase view', data);
    } catch (error) {
        console.error('An error occured while incrementing the view count', error);
    }
}

export async function queryViewCount(slug: string) {
    // https://supabase.com/dashboard/project/yzblsoaierguxexuziaw/api?resource=blog_views
    try {
        let { data: blog_views, error } = await supabase.from('blog_views').select('count').match({ slug: slug }).single();
        console.log('data view count supabase', blog_views);
        if (blog_views) {
            return blog_views.count as number;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('An error occured while get view count supabase', error);
        return 0;
    }
}

import type { RootState } from '@/lib/redux/store';
import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';

type Post = {
    id: number | string;
    title: string;
    description: string;
};

type PostState = {
    posts: Post[];
};

const initialState = {
    posts: [
        {
            id: 1,
            title: 'Post 1',
            description: 'Description 1',
        },
    ],
} satisfies PostState as PostState;

/**
 * [reducer with prepare](https://redux-toolkit.js.org/api/createSlice#customizing-generated-action-creators)
 *
 * ### menulis code di reducer
 * - jika bermutasi jangan ada `return`
 *
 * ```js
 * const addPost = (state) => state.push({nama:"paga"}) ❌ // state.push() adalah mutasi & dan state.push() juga `mereturn` sebuah nilai
 * const addPost = (state) => void state.push({nama:"paga"}) ✅ // ditambah keyword "void"
 * // atau dengan curly brackets ✅, boleh bermutasi asalkan tidak mereturn valuw, agar immer tidak bingung
 * const addPost = (state) => {
 *      state.push({nama:"paga"})
 * }
 *
 * ```
 * - jika ingin menggunakan `return`, pastikan value yang di return "immutably" ex: [...post] | state.posts.map() | state.post.filter()
 *
 */

const postSlice = createSlice({
    name: 'pwu-post',
    initialState,
    reducers: {
        setInitialPost: (state, action: PayloadAction<Post[]>) => {
            return { posts: action.payload };
        },
        addPost: (state, action: PayloadAction<Post>) => {
            const { id, title, description } = action.payload;
            /**
             * [](https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state)
             * "Mutate" the existing state, no return value needed
             */
            state.posts.push({ id, title, description }); // disini seakan state bermutasi tapi sebenernya tidak, karena ditangaini oleh immer
            // console.log(current(state));
        },
        /**
         reducers: (create) => ({}) // bentuk reducer harus seperti ini jika ingin menggunakan "create"
         addPost2: create.preparedReducer(
             (p: Post) => {
                 const id = nanoid();
                 const { description, title } = p;
                 return { payload: { id, description, title } };
             },
             (state, action) => {
                 state.posts.push(action.payload);
             }
         ),
         */

        addPost3: {
            reducer: (state, action: PayloadAction<Post>) => {
                state.posts.push(action.payload);
            },
            prepare: (p: Omit<Post, 'id'>) => {
                const id = nanoid();
                const { title, description } = p;
                return { payload: { id, title, description } };
            },
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const { id, title, description } = action.payload;
            const postIndex = state.posts.findIndex((post) => post.id === id);
            if (postIndex !== -1) {
                state.posts[postIndex].title = title;
                state.posts[postIndex].description = description;
            }
        },
        deletePost: (state, action: PayloadAction<Post['id']>) => {
            const postId = action.payload;
            // Construct a new result array immutably and return it
            const newPost = state.posts.filter((post) => post.id !== postId);
            return { posts: newPost };
        },
        deletePost2(state, action: PayloadAction<Post['id']>) {
            const postId = action.payload;
            // Construct a new result array immutably and return it
            const newPost = state.posts.filter((post) => post.id !== postId);
            return { posts: newPost };
        },
        deletePost3: (state, action: PayloadAction<Post['id']>) => {
            const postId = action.payload;
            // Construct a new array immutably
            const newPost = state.posts.filter((post) => post.id !== postId);
            // "Mutate" the existing state to save the new array
            state.posts = newPost;
        },
        /**
        deletePost4: create.reducer<number>((state, action) => {
            state.posts.splice(action.payload, 1);
        }),
         */
    },
});

//* Core
export const { addPost, deletePost } = postSlice.actions;

export const pwuPostReducer = postSlice.reducer;

//? Extra Selector
/**
 *
 * @param state
 * @returns
 * ### penggunaan
 * ```js
 * import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
 * import { addPost, deletePost, selectPostByTitle, selectAllPost } from '@/lib/redux/slices/tutorial/programming-with-umair/post-slice';
 * // standart selector
 * const posts = useAppSelector((state) => state.pwuPost.posts);
 * // lebih simple
 * const allPost2 = useAppSelector((state) => selectAllPost(state));
 * // sangat simple
 * const allPost = useAppSelector(selectAllPost);
 * ```
 */
export function selectAllPost(state: RootState) {
    return state.pwuPost.posts;
}

export function selectPostById(state: RootState, postId: Post['id']) {
    const finded = state.pwuPost.posts.find((post) => post.id == postId);
    return finded;
}

// selector with memoise
/**
 * ### penggunaan
 * ```js
 * const postByTitle = useAppSelector((state) => selectPostByTitle(state, 'post liburan'));
 * ```
 */
export const selectPostByTitle = createSelector(
    [
        selectAllPost,
        function (state: RootState, title: Post['title']) {
            return title;
        },
    ],
    function (posts, title) {
        return posts.filter((post) => post.title === title);
    }
);

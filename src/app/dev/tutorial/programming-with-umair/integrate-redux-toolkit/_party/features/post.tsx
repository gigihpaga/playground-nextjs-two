'use client';

import { useState, type FormEvent, type MouseEvent } from 'react';
import styles from '../page.module.scss';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { addPost, deletePost, selectPostByTitle, selectAllPost } from '@/lib/redux/slices/tutorial/programming-with-umair/post-slice';

export function Post() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => state.pwuPost.posts);
    const postByTitle = useAppSelector((state) => selectPostByTitle(state, 'post liburan'));

    const handleAddPost = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title && !description) return;

        const newPost = {
            id: Date.now(),
            title,
            description,
        };

        dispatch(addPost(newPost));

        // Reset form fields
        setTitle('');
        setDescription('');
    };

    const handleRemovePost = (postId: any) => {
        dispatch(deletePost(postId));
    };

    console.count('Post Render');
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Post</h1>
            <p className={styles.description}>
                data post using&nbsp;
                <i>redux-toolkit</i>
                &nbsp;dan&nbsp;
                <i>redux-persist</i>
            </p>
            <form
                className={styles.form}
                onSubmit={(e) => handleAddPost(e)}
            >
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    className={styles.input}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button
                    className={styles.button}
                    // onClick={(e) => handleAddPost(e)}
                >
                    Add New Post
                </button>
            </form>
            <h2 className={styles.heading}>Posts list</h2>
            {posts ? (
                posts.map((post) => (
                    <div
                        key={post.id}
                        className={styles.post}
                    >
                        <h3 className={styles.title}>{post.title}</h3>
                        <p className={styles.description}>{post.description}</p>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleRemovePost(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
}

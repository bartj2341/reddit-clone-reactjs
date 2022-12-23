import React from 'react';
import { useRecoilState } from 'recoil';
import { postState } from '../atoms/postsAtom';

const usePosts = () => {
    const [postsStateValue, setPostsStateValue] = useRecoilState(postState)
    
    const onVote = async () => {};

    const onSelectPost = () => {};

    const onDeletePost = async() => {};

    return {
        postsStateValue,
        setPostsStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}
export default usePosts;
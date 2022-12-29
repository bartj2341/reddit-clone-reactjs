import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContent from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Posts/PostItem";
import { auth } from "../../../../firebase/clientApp";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
    const [user] = useAuthState(auth)
	const { postsStateValue, setPostsStateValue, onDeletePost, onVote } =
		usePosts();

	return (
		<PageContent>
			<>
				{postsStateValue.selectedPost && (
                    <PostItem
                        post={postsStateValue.selectedPost}
                        onVote={onVote}
                        onDeletePost={onDeletePost}
                        userVoteValue={postsStateValue.postVotes.find(item => item.postId === postsStateValue.selectedPost?.id)?.voteValue}
                        userIsCreator={user?.uid === postsStateValue.selectedPost?.creatorId}
                    />
                )}
				{/* Comments */}
			</>
			<>{/* About */}</>
		</PageContent>
	);
};
export default PostPage;

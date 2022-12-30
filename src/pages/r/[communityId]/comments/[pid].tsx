import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postsAtom";
import About from "../../../../components/Community/About";
import PageContent from "../../../../components/Layout/PageContent";
import Comments from "../../../../components/Posts/Comments/Comments";
import PostItem from "../../../../components/Posts/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	const { postsStateValue, setPostsStateValue, onDeletePost, onVote } =
		usePosts();
	const router = useRouter();
	const { communityStateValue } = useCommunityData();

	const fetchPost = async (postId: string) => {
		try {
			const postDocRef = doc(firestore, "posts", postId);
			const postDoc = await getDoc(postDocRef);
			setPostsStateValue((prev) => ({
				...prev,
				selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
			}));
		} catch (error) {
			console.log("fetchPost error", error);
		}
	};

	useEffect(() => {
		const { pid } = router.query;
		if (pid && !postsStateValue.selectedPost) {
			fetchPost(pid as string);
		}
	}, [router.query, postsStateValue.selectedPost]);

	return (
		<PageContent>
			<>
				{postsStateValue.selectedPost && (
					<PostItem
						post={postsStateValue.selectedPost}
						onVote={onVote}
						onDeletePost={onDeletePost}
						userVoteValue={
							postsStateValue.postVotes.find(
								(item) => item.postId === postsStateValue.selectedPost?.id
							)?.voteValue
						}
						userIsCreator={
							user?.uid === postsStateValue.selectedPost?.creatorId
						}
					/>
				)}
				<Comments user={user as User} selectedPost={postsStateValue.selectedPost} communityId={postsStateValue.selectedPost?.communityId as string}/>
			</>
			<>
				{communityStateValue.currentCommmunity && (
					<About communityData={communityStateValue.currentCommmunity} />
				)}
			</>
		</PageContent>
	);
};
export default PostPage;

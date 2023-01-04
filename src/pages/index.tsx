import { Stack } from "@chakra-ui/react";
import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth)
	const [loading, setLoading] = useState(false);
	const { postsStateValue, setPostsStateValue, onSelectPost, onDeletePost, onVote } = usePosts();
	
	const buildUserHomeFeed = () => {
		// fetch some posts from community that the user is in
	};

	const buildNoUserHomeFeed = async() => {
		setLoading(true);
		try {
		const postQuery = query(
			collection(firestore, "posts"),
			orderBy("voteStatus", "desc"),
			limit(10)
		);

		const postDocs = await getDocs(postQuery);
		const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		// setPostState
		setPostsStateValue((prev) => ({
			...prev,
			posts: posts as Post[],
		}));

		
		} catch (error) {
		console.log("buildNoUserHomeFeed error", error);
		}
		setLoading(false);
	};

	const getUserPostVotes = () => {};

	// useEffects
	useEffect(() => {
		if(!user && !loadingUser) buildNoUserHomeFeed();

	}, [user, loadingUser])


	return (
		<PageContent>
			<>
				<CreatePostLink/>
				{loading ? (
					<PostLoader/>
				) : (
					<Stack>
						{postsStateValue.posts.map(post => (
							<PostItem
								key={post.id}
								post={post}
								userIsCreator={user?.uid === post.creatorId}
								userVoteValue={postsStateValue.postVotes.find(vote => vote.postId === post.id)?.voteValue}
								onVote={onVote}
								onSelectPost={onSelectPost}
								onDeletePost={onDeletePost}
								homePage
							/>
						))}	
					</Stack>
				)}
			</>
			<>
				{/* <Recommendations/> */}
			</>
		</PageContent>
	)
}

export default Home;
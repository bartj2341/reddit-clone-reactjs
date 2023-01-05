import { Stack } from "@chakra-ui/react";
import {
	query,
	collection,
	orderBy,
	limit,
	getDocs,
	where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import useCommunityData from "../hooks/useCommunityData";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postsStateValue,
		setPostsStateValue,
		onSelectPost,
		onDeletePost,
		onVote,
	} = usePosts();
	const { communityStateValue } = useCommunityData();

	const buildUserHomeFeed = async () => {
		setLoading(true);
		try {
			if (communityStateValue.mySnippets.length) {
				// get posts from users' communities
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);
				const postQuery = query(
					collection(firestore, "posts"),
					where("communityId", "in", myCommunityIds),
					limit(10)
				);
				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPostsStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.log("buildUserHomeFeed error", error);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
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

	const getUserPostVotes = async () => {
		try {
			const postIds = postsStateValue.posts.map((post) => post.id);
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where("postId", "in", postIds)
			);
			const postVoteDocs = await getDocs(postVotesQuery);
			const postVotes = postVoteDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostsStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (error) {
			console.log("getUserPostVotes error", error);
		}
	};

	// useEffects

	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed();
	}, [communityStateValue.snippetsFetched]);

	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser]);

	useEffect(() => {
		if (user && postsStateValue.posts.length) getUserPostVotes();

		return () => {
			setPostsStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		};
	}, [user, postsStateValue.posts]);

	return (
		<PageContent>
			<>
				<CreatePostLink />
				{loading ? (
					<PostLoader />
				) : (
					<Stack>
						{postsStateValue.posts.map((post) => (
							<PostItem
								key={post.id}
								post={post}
								userIsCreator={user?.uid === post.creatorId}
								userVoteValue={
									postsStateValue.postVotes.find(
										(vote) => vote.postId === post.id
									)?.voteValue
								}
								onVote={onVote}
								onSelectPost={onSelectPost}
								onDeletePost={onDeletePost}
								homePage
							/>
						))}
					</Stack>
				)}
			</>
			<>{/* <Recommendations/> */}</>
		</PageContent>
	);
};

export default Home;

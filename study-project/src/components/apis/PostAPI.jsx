import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Text = styled.div`
	font-size: 14px;
`;

function PostAPI() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	console.log(process.env.REACT_APP_JSONPLACEHOLDER_SERVER_URL);
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setError(null);
				setPosts(null);
				setLoading(true);

				const response = await axios.get(process.env.REACT_APP_JSONPLACEHOLDER_SERVER_URL);
				setPosts(response.data);
			} catch (e) {
				setError(e);
			}
			setLoading(false);
		};
		fetchPosts();
	}, []);

	if (loading) {
		return <Text>loading...</Text>;
	}
	if (error) {
		return <Text>error...:{error}</Text>;
	}
	if (!posts) {
		return <Text>no data...</Text>;
	}
	return (
		<ul>
			{posts.map((post) => (
				<li key={post.id}>
					{post.userId} {post.title} ({post.body})
				</li>
			))}
		</ul>
	);
}

export default PostAPI;

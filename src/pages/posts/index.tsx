import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useQuery } from "react-query";
import axios from "axios";
import { IPost } from "../../types";
import { useEffect, useState } from "react";

interface Props {
  posts: IPost[];
}

const Posts: NextPage<Props> = (props) => {
  const [posts, setPosts] = useState(props.posts);
  const { isLoading, isError, isIdle, data } = useQuery(
    "posts",
    async () =>
      (await axios.get<IPost[]>("https://jsonplaceholder.typicode.com/posts"))
        .data
  );

  useEffect(() => {
    if (!isLoading && !isError && !isIdle) {
      setPosts(data);
    }
  }, [isLoading, isError, isIdle, data]);

  // should handle error as well
  if (!posts) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Posts</h1>
      <p>Only post #1 to post #5 are generated at build time</p>
      {isLoading && <p style={{ color: "red" }}>Fetching client-side</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = (
    await axios.get<IPost[]>("https://jsonplaceholder.typicode.com/posts")
  ).data;

  return {
    props: { posts },
    revalidate: 60, // 1 minute
  };
};

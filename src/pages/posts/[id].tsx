import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useQuery } from "react-query";
import axios from "axios";
import { IPost } from "../../types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SSGPostIds } from "../../constants";
import { ParsedUrlQuery } from "querystring";

interface Props {
  post: IPost | null;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

const Post: NextPage<Props> = (props) => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(props.post);
  const [notFound, setNotFound] = useState(false);
  const { isLoading, isError, isIdle, data } = useQuery(
    `post${id}`,
    async () =>
      (
        await axios.get<IPost>(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        )
      ).data
  );

  useEffect(() => {
    // should handle other error types
    if (isError) {
      setNotFound(true);
    }

    if (!isLoading && !isError && !isIdle) {
      setPost(data);
    }
  }, [isLoading, isError, isIdle, data]);

  if (notFound) {
    // should return 404
    return (
      <main>
        <p>Not Found</p>
        <Link href="/posts">Back</Link>
      </main>
    );
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Post</h1>
      {isLoading && <p style={{ color: "red" }}>Fetching client-side</p>}
      <h2>{post.title}</h2>
      <h3>By user # {post.userId}</h3>
      <p>{post.body}</p>
      <Link href="/posts">Back</Link>
    </main>
  );
};

export default Post;

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { id } = context.params as Params;

  if (!SSGPostIds.includes(id)) {
    return {
      props: { post: null },
      revalidate: 60, // 1 minute
    };
  }

  let post = (
    await axios.get<IPost>(`https://jsonplaceholder.typicode.com/posts/${id}`)
  ).data;

  return {
    props: { post },
    revalidate: 60, // 1 minute
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Only post #1 to post #5 are generated at build time
    paths: SSGPostIds.map((id) => ({ params: { id } })),
    fallback: true,
  };
};

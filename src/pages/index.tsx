import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main>
      <h1>Welcome</h1>
      <Link href="/posts">View all posts</Link>
    </main>
  );
};

export default Home;

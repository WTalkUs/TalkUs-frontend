"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Card, Skeleton } from "@heroui/react";
import { getAllPosts } from "../../services/posts/getAll";
import PostSkeletonLoading from "./PostSkeletonLoading";

type PostUser = {
  uid: string;
  email: string;
  password: string;
  username: string;
};

type Post = {
  id: string;
  author_id: string;
  author: PostUser;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_flagged: boolean;
  forum_id: string;
  image_url: string;
  likes: number;
  dislikes: number;
};

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const result = await getAllPosts();

      if (result.success) {
        setPosts(
          result.data.map((post: any) => ({
            ...post,
            author: post.author ?? {
              uid: "",
              email: "",
              password: "",
              username: "",
            },
          }))
        );
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);
  if (loading) return <PostSkeletonLoading />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (posts.length === 0) return <p>No hay publicaciones</p>;
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          authorName={post.author.username}
          title={post.title}
          content={post.content}
          tags={post.tags}
          imageUrl={
            post.image_url
              ? post.image_url
              : "https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"
          }
          authorId={post.author_id}
          createdAt={post.created_at}
          likes={post.likes}
          dislikes={post.dislikes}
        />
      ))}
    </div>
  );
}

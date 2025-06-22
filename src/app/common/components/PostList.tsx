"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getAllPosts } from "@/app/services/posts/getAll";
import { getPostsByAuthorID } from "@/app/services/posts/getByAuthorID";
import PostSkeletonLoading from "./PostSkeletonLoading";
import { getPostsByILiked } from "@/app/services/posts/getByILiked";

type PostUser = {
  uid: string;
  email: string;
  username: string;
  profile_photo: string;
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

interface PostListProps {
  type?: "all" | "user-posts" | "saved-posts" | "liked-posts";
  userId?: string;
}

export default function PostsList({ type = "all", userId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let result;

      switch (type) {
        case "user-posts":
          if (userId) {
            result = await getPostsByAuthorID(userId);
          } else {
            result = { success: false, error: "ID de autor requerido" };
          }
          break;
        case "saved-posts":
          // TODO: Implementar servicio para posts guardados
          result = { success: true, data: [] };
          break;
        case "liked-posts":
          if (userId) {
            result = await getPostsByILiked(userId);
          } else {
            result = { success: false, error: "ID de usuario requerido" };
          }
          break;
        default:
          result = await getAllPosts();
          break;
      }

      if (result.success) {
        setPosts(
          (result.data || []).map((post: any) => ({
            ...post,
            author: post.author ?? {
              uid: "",
              email: "",
              password: "",
              username: "",
              profile_photo: "",
            },
          }))
        );
        setError(null);
      } else {
        setError(result.error || "Error desconocido");
      }
      setLoading(false);
    };

    fetchPosts();
  }, [type, userId]);

  if (loading) return <PostSkeletonLoading />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (posts.length === 0) {
    const messages = {
      all: "No hay publicaciones",
      "user-posts": "No has publicado nada aún",
      "saved-posts": "No tienes publicaciones guardadas",
      "liked-posts": "No has dado like a ninguna publicación",
    };
    return <p>{messages[type]}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          authorName={post.author.username}
          authorImage={post.author.profile_photo}
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

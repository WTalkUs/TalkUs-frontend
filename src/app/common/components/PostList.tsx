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
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 13H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 9H9H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {messages[type]}
        </h3>
        <p className="text-gray-500 max-w-md">
          {type === "user-posts" &&
            "Comienza a compartir tus ideas con la comunidad"}
          {type === "saved-posts" &&
            "Guarda las publicaciones que te interesen para leerlas más tarde"}
          {type === "liked-posts" &&
            "Da like a las publicaciones que te gusten para encontrarlas fácilmente"}
          {type === "all" && "Sé el primero en crear una publicación"}
        </p>
      </div>
    );
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

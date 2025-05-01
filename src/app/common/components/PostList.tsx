"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { CircularProgress } from "@heroui/react";

type Post = {
  id: string;             
  author_id: string;
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
    const [error, setError]   = useState<string | null>(null);
  
    useEffect(() => {
      fetch("http://localhost:8080/public/posts")
        .then(res => {
          if (!res.ok) throw new Error(`Error ${res.status}`);
          return res.json() as Promise<Post[]>;
        })
        .then(data => setPosts(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <CircularProgress aria-label="Loading..." color="secondary" />;
    if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;
    if (posts.length === 0) return <p>No hay publicaciones</p>;
    return (
      <div className="mt-0">
        {posts.map(post => (
          <PostCard
        key={post.id}
        id={post.id}
        title={post.title}
        content={post.content}
        imageUrl={post.image_url ? post.image_url : "https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"}
        authorId={post.author_id}
        createdAt={post.created_at}
        likes={post.likes}
        dislikes={post.dislikes}
          />
        ))}
      </div>
    );
  }
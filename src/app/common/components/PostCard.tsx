"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;             // doc.Ref.ID
  author_id: string;
  title: string;
  content: string;
  created_at: string;     // tu backend manda RFC3339
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
    fetch("http://localhost:8080/public/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json() as Promise<Post[]>;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando publicaciones…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No hay publicaciones</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} style={{ marginBottom: "1rem" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            Creado: {new Date(post.created_at).toLocaleString()} | Autor:{" "}
            {post.author_id}
          </small>
        </li>
      ))}
    </ul>
  );
}

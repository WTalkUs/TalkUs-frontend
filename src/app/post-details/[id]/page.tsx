"use client";
import { Avatar, Card } from "@heroui/react";
import Image from "next/image";

import styles from "../../page.module.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Tags from "../../common/components/Tags";

import { useEffect, useState } from "react";
import { getPostById, Post } from "../../services/posts/getById";
import React from "react";

export default function PostDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(props.params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then((resp) => {
        if (resp.success) {
          console.log("Post fetched:", resp.data);
          setPost(resp.data);
          setError(null);
        } else {
          setError(resp.error);
          setPost(null);
        }
      })
      .catch((err) => {
        setError(err.message);
        setPost(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  console.log("Post details:", post);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Cargando post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500">Error: {error}</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>No se encontró el post con ID: {id}</span>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Card className="w-full max-w-[770px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6 p-6 space-y-2">
          <div className="col-span-3 flex flex-col md:flex-row md:items-center gap-2">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src="https://heroui.com/avatars/avatar-1.png"
            />
            <div className="flex flex-col">
              <span className="text-default-900 font-semibold">
                Nombre del autor
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-default-900 mb-2">
                {post.title}
              </h2>
              <Tags tags={["Ciencia", "Programacion", "Literatura"]} />
            </div>
          </div>
          <p>{post.content}</p>
          <Image
            src={post.image_url || ""}
            width={746}
            height={746}
            alt="post image"
            className="rounded-2xl justify-center object-cover size-full col-span-1"
          />
          <div className="flex items-center mt-4">
            <div className="flex justify-start space-x-2 gap-2">
              <div className="flex gap-2">
                <ThumbUpIcon fontSize="medium" />
                <span>{post.likes}</span>
              </div>
              <div className="flex gap-2">
                <ThumbDownIcon fontSize="medium" />
                <span>{post.dislikes}</span>
              </div>
              <div className="flex gap-2">
                <CommentIcon fontSize="medium" />
                <span>0</span>
              </div>
            </div>
            <div className="flex justify-end ml-auto">
              <BookmarkIcon fontSize="medium" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

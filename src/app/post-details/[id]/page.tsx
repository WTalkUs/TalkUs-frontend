"use client";
import { Avatar, Button, Card } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import styles from "../../page.module.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Tags from "../../common/components/Tags";

import { getPostById, Post } from "../../services/posts/getById";
import { useAuth } from "@/app/contexts/AuthProvider";
import { ReactPostData } from "../../services/posts/react";
import { getUserVote } from "@/app/services/votes/getByUserId";
import { reactToPost } from "../../services/posts/react";

import { CommentList } from "@/app/comments/components/CommentList";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Reaction = "like" | "dislike" | "none";

export default function PostDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(props.params);
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [reaction, setReaction] = useState<Reaction>("none");
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then((resp) => {
        if (resp.success) {
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

  useEffect(() => {
    if (!user) return;
    const fetchVote = async () => {
      const resp = await getUserVote(id);
      if (resp.success) {
        setReaction(resp.data.type);
      } else if (resp.error === "not_found") {
        setReaction("none");
      } else {
        console.error("Error fetching vote:", resp.error);
        setReaction("none");
      }
    };
    fetchVote();
  }, [id, user]);

  const handleReactPost = async (action: "like" | "dislike") => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const isToggleOff = reaction === action;

    setCounts(({ likes: L, dislikes: D }) => {
      let likes = L,
        dislikes = D;

      if (reaction === "like") likes--;
      if (reaction === "dislike") dislikes--;

      // si no es toggle-off, suma la nueva
      if (!isToggleOff) {
        if (action === "like") likes++;
        else dislikes++;
      }

      return { likes, dislikes };
    });

    // Ajusta el estado de reacción local
    setReaction(isToggleOff ? "none" : action);

    const payload: ReactPostData = {
      postId: id,
      type: isToggleOff ? "none" : action,
      userId: user.uid,
    };

    try {
      const result = await reactToPost(payload);
      if (!result.success) {
        console.error(`Error ${action}ing post:`, result.error);
      }
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

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
        <Card className="w-full max-w-[770px] min-w-[770px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6 p-6 space-y-4">
          <div className="col-span-3 flex flex-col md:flex-row md:items-center gap-2">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={post.author.profile_photo}
            />
            <div className="flex flex-col">
              <span className="text-default-900 font-semibold">
                {post.author.username}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-default-900 mb-2">
                {post.post.title}
              </h2>
              <Tags tags={post.post.tags} />
            </div>
          </div>
          <div className="prose prose-invert prose-pre:bg-secondary-50 prose-pre:p-4 prose-code:text-secondary-900">
            <ReactMarkdown remarkPlugins={[]} rehypePlugins={[rehypeHighlight]}>
              {post.post.content}
            </ReactMarkdown>
          </div>
          {post.post.image_url && (
            <Image
              src={post.post.image_url}
              width={746}
              height={746}
              priority
              alt="post image"
              className="rounded-2xl justify-center object-cover size-full col-span-1"
            />
          )}
          <div className="flex justify-between space-x-2 gap-2">
            <div className="flex gap-2">
              {user ? (
                <div className="flex gap-3 items-center">
                  <div
                    onClick={() => handleReactPost("like")}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                  >
                    <ThumbUpIcon
                      fontSize="medium"
                      color={reaction === "like" ? "secondary" : "inherit"}
                    />
                    <span>{post.post.likes + counts.likes}</span>
                  </div>
                  <div
                    onClick={() => handleReactPost("dislike")}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                  >
                    <ThumbDownIcon
                      fontSize="medium"
                      color={reaction === "dislike" ? "secondary" : "inherit"}
                    />
                    <span>{post.post.dislikes + counts.dislikes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CommentIcon fontSize="medium" />
                    <span>0</span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex justify-end ml-auto">
              <BookmarkIcon fontSize="medium" />
            </div>
          </div>
        </Card>
        <section className="w-full max-w-[770px] mx-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
          <CommentList postId={id} />
        </section>
      </main>
    </div>
  );
}

"use client";
import styles from "../page.module.css";
import PostsList from "../common/components/PostList";
import UserCard from "./components/UserCard";
import { Tab, Tabs } from "@heroui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { getSavedPosts, Post } from "../services/posts/getPostsSaved";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("posts");
  const { user } = useAuth();
  
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  
    useEffect(() => {
      if (!user) return;
  
      (async () => {
        const resp = await getSavedPosts(user.uid);
        if (resp.success) {
          setSavedPosts(resp.posts);
        } else {
          console.error("Error fetching saved posts:", resp.error);
          setSavedPosts([]);
        }
      })();
    }, [user]);
  
    console.log("Saved posts:", savedPosts);

  let tabs = [
    {
      id: "posts",
      label: "Posts",
    },
    {
      id: "saved",
      label: "Saved",
    },
    {
      id: "liked",
      label: "Liked",
    },
  ];

  const getPostListType = (tabId: string) => {
    switch (tabId) {
      case "posts":
        return "user-posts";
      case "saved":
        return "saved-posts";
      case "liked":
        return "liked-posts";
      default:
        return "all";
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="flex flex-col items-start justify-center">
          <UserCard />
          <Tabs
            variant="underlined"
            size="lg"
            aria-label="Dynamic tabs"
            items={tabs}
            className="mt-2 ml-4"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <PostsList
                  type={getPostListType(item.id) as any}
                  userId={user?.uid}
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

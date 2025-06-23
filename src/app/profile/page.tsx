"use client";
import styles from "../page.module.css";
import PostsList from "../common/components/PostList";
import UserCard from "./components/UserCard";
import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("posts");
  const { user } = useAuth();

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
        <div className="flex flex-col items-start justify-center w-full">
          <UserCard />
          <div className="w-full mt-4">
            <Tabs
              variant="underlined"
              size="lg"
              aria-label="Dynamic tabs"
              items={tabs}
              className="ml-4"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              {(item) => (
                <Tab key={item.id} title={item.label}>
                  <div className="pt-4 min-w-[898px]">
                    <PostsList
                      type={getPostListType(item.id) as any}
                      userId={user?.uid}
                    />
                  </div>
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

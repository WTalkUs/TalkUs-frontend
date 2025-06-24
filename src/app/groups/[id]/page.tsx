"use client";
import styles from "@/app/page.module.css";
import { Tab, Tabs } from "@heroui/react";
import {  use, useState } from "react";
import GroupInfoCard from "../components/GroupInfoCard";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthProvider";
import PostsList from "@components/PostList";

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("posts");
  const { user } = useAuth();

  let tabs = [
    {
      id: "posts",
      label: "Posts",
    },
    {
      id: "warnings",
      label: "Warnings",
    },
    {
      id: "not-related",
      label: "Not Related",
    },
  ];

  const getPostListType = (tabId: string) => {
    switch (tabId) {
      case "posts":
        return "forum-posts";
      case "warnings":
        return "warnings-posts";
      case "not-related":
        return "not-related-posts";
      default:
        return "all";
    }
  };

  if (!id) {
    router.push("/groups");
    return null; // or a loading state
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <GroupInfoCard forumId={id} />
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
                    forumId={id}
                  />
                </div>
              </Tab>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

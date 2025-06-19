"use client";
import styles from "../page.module.css";
import PostsList from "../common/components/PostList";
import UserCard from "./components/UserCard";
import { useAuth } from "@/app/contexts/AuthProvider";
import { Tab, Tabs } from "@heroui/react";

export default function Profile() {
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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="flex flex-col items-start justify-center">
          <UserCard
            authorName={user?.displayName || ""}
            imageUrl={user?.photoURL || ""}
          />
          <Tabs
            variant="underlined"
            size="lg"
            aria-label="Dynamic tabs"
            items={tabs}
            className="mt-2 ml-4"
          >
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <PostsList />
              </Tab>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

"use client";
import styles from "@/app/page.module.css";
import { Tab, Tabs } from "@heroui/react";
import { use, useState, useEffect } from "react";
import GroupInfoCard from "../components/GroupInfoCard";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthProvider";
import PostsList from "@components/PostList";
import { getGroupById } from "@services/groups/getById";

type TabItem = {
  id: string;
  label: string;
  color: "default" | "warning" | "danger";
};

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("posts");
  const { user } = useAuth();
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!id || !user) return;

      try {
        const result = await getGroupById(id);
        if (result.success) {
          const isUserModerator = result.data.moderators.includes(user.uid);
          setIsModerator(isUserModerator);

          // Si no es moderador y está en una tab restringida, cambiar a posts
          if (
            !isUserModerator &&
            (selectedTab === "warnings" || selectedTab === "not-related")
          ) {
            setSelectedTab("posts");
          }
        }
      } catch (error) {
        console.error("Error fetching group info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupInfo();
  }, [id, user, selectedTab]);

  let tabs: TabItem[] = [
    {
      id: "posts",
      label: "Posts",
      color: "default",
    },
  ];

  // Solo agregar las tabs de moderador si el usuario es moderador
  if (isModerator) {
    tabs.push(
      {
        id: "warnings",
        label: "Warnings",
        color: "warning",
      },
      {
        id: "not-related",
        label: "Not Related",
        color: "danger",
      }
    );
  }

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

  // Mostrar loading mientras se verifica si es moderador
  if (isLoading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <GroupInfoCard forumId={id} />
          <div className="w-full mt-4">
            <div className="ml-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
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
            color={tabs.find((tab) => tab.id === selectedTab)?.color}
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

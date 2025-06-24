"use client";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { getAllGroups, Group } from "@services/groups/getAll";
import GroupCard from "@components/GroupCard";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await getAllGroups();
        setGroups(response.data || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="text-4xl font-bold">Groups</h1>
        <div className="container mx-auto p-4 columns-1 sm:columns-2 lg:columns-2 gap-10 space-y-4">
          {groups.map((group: Group) => (
            <div key={group.forumId} className="break-inside-avoid">
              <GroupCard
                forumId={group.forumId}
                title={group.title}
                description={group.description}
                categories={group.categories}
                createdAt={group.createdAt}
                updatedAt={group.updatedAt}
                isActive={group.isActive}
                createdBy={group.createdBy}
                bannerUrl={group.bannerUrl}
                iconUrl={group.iconUrl}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

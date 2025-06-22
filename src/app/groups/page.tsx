"use client";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { getAllGroups } from "@services/groups/getAll";

interface Group {
  forumId: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
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
    console.log("Groups fetched:", groups);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <h1 className="text-2xl font-bold mb-4">Groups</h1>
          <ul>
            {groups.map((group: Group) => (
              <li key={group.forumId} className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold">{group.title}</h2>
                <p className="text-gray-600">{group.description}</p>
                <p className="text-sm text-gray-500">
                  Category: {group.category}
                </p>
                <p className="text-sm text-gray-500">
                  Created by: {group.createdBy}
                </p>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(group.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Updated at: {new Date(group.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {group.isActive ? "Active" : "Inactive"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

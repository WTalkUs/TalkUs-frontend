"use client";
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
    }
    fetchGroups();
    console.log("Groups fetched:", groups);
  }
  , []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>
      <ul>
        
      </ul>
    </div>
  );
}
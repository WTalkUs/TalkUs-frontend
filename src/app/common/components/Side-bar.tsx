"use client";
import SideBarCards from "./SidebarCards";

import { useAuth } from "@/app/contexts/AuthProvider";
import { useEffect, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import { Group } from "@/app/services/groups/getByUserId";
import { getGroupsByUserId } from "@/app/services/groups/getByUserId";

export default function SideBar() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (user?.uid) {
      const fetchGroups = async () => {
        const response = await getGroupsByUserId(user.uid);
        console.log(response);
        setGroups(response.data || []);
      };
      fetchGroups();
    }
  }, [user]);

  return (
    <div className="fixed left-0 top-[75px] ml-4 space-y-5">
      {user ? (
        <>
          <SideBarCards
            title="PINNED GROUPS"
            items={groups.map((group) => ({
              id: group.forumId,
              title: group.title,
              image: group.iconUrl,
            }))}
          >
            <button
              className="w-full bg-secondary text-white py-2 rounded mb-2"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Create New Group
            </button>
          </SideBarCards>
          <CreateGroupModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </>
      ) : null}
    </div>
  );
}

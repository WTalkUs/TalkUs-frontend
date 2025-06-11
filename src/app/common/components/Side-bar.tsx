"use client";
import SideBarCards from "./SidebarCards";

import { mockDataGroup, mockDataMain } from "../utils/sideBarContent";
import { useAuth } from "@/app/contexts/AuthProvider";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

export default function SideBar() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="fixed left-0 top-[75px] ml-4 space-y-5">
      <SideBarCards items={mockDataMain} />
      {user ? (
        <>
          <SideBarCards title="PINNED GROUPS" items={mockDataGroup}>
            <button
              className="w-full bg-secondary text-white py-2 rounded mb-2"
              onClick={() => {
                setModalOpen(true)
                console.log("Create Group button clicked", modalOpen);
              }}
            >
              Create New Group
            </button>
          </SideBarCards>
          <CreateGroupModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      ) : null}
    </div>
  );
}

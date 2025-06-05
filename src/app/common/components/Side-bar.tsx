"use client";
import SideBarCards from "./SidebarCards";

import { mockDataGroup, mockDataMain } from "../utils/sideBarContent";
import { useAuth } from "@/app/contexts/AuthProvider";

export default function SideBar() {
  const { user } = useAuth();
  return (
    <div className="fixed left-0 top-[75px] ml-4 space-y-5 hidden lg:block">
      <SideBarCards items={mockDataMain} />
      {user ? (
        <SideBarCards title="Pinned Groups" items={mockDataGroup} />
      ) : null}
    </div>
  );
}

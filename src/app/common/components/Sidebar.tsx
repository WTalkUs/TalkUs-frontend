import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";
import SideBarCards from "./SidebarCards";

import { mockDataGroup, mockDataMain } from "../utils/sideBarContent";

export default function SideBar() {
  return (
    <div className="fixed left-0 top-[75px] ml-4 space-y-5 hidden lg:block">
      <SideBarCards items={mockDataMain} />
      <SideBarCards title="Pinned Groups" items={mockDataGroup} />
    </div>
  );
}

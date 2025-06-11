import { Card, CardHeader, CardBody } from "@heroui/react";
import CreateGroupModal from "./CreateGroupModal";

interface CardItem {
  id: number;
  name?: string;
  title?: string;
  description: string;
}

interface SideBarCardsProps {
  title?: string;
  items?: CardItem[];
  showImage?: boolean;
  children?: React.ReactNode;
}

export default function SideBarCards({
  title,
  items = [],
  children,
}: SideBarCardsProps) {
  return (
    <>
      <Card className="max-w-[400px] p-2 bg-background-2">
        {title && (
          <CardHeader className="pb-0 pt-2 px-4">
            <h4 className="font-bold text-large">{title}</h4>
          </CardHeader>
        )}
        <CardBody className="flex flex-col gap-3">
          {children && <div>{children}</div>}
          {items.map((item) => (
            <div key={item.id} className="flex flex-col">
              <p className="text-md font-medium">
                {item.title || item.name || ""}
              </p>
              <p className="text-small text-default-500">{item.description}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}

import { Card, CardHeader, CardBody, Avatar } from "@heroui/react";
import { useRouter } from "next/navigation";

interface CardItem {
  id: string;
  title?: string;
  image?: string;
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
  const router = useRouter();
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
            <div
              key={item.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-background-3 rounded-lg p-2"
              onClick={() => {
                router.push(`/groups/${item.id}`);
              }}
            >
              {item.image ? (
                <Avatar
                  size="sm"
                  isBordered
                  src={item.image}
                  className="bg-default-100"
                />
              ) : (
                <Avatar
                  className="bg-red-600 text-white font-bold"
                  name={`g/${item.title}`}
                  size="sm"
                  isBordered
                >
                  {item.title?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div className="flex flex-col">
                <p className="text-md font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.title || ""}
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}

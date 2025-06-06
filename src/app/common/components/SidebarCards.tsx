import { Card, CardHeader, CardBody } from "@heroui/react";

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
}

export default function SideBarCards({ title, items = [] }: SideBarCardsProps) {
  return (
    <Card className="max-w-[400px] p-2 bg-background-2">
      {title && (
        <CardHeader className="pb-0 pt-2 px-4">
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
      )}
      <CardBody className="flex flex-col gap-3">
        {/* {showImage && (
          <div className="flex gap-3 items-center">
            <Image
              alt="heroui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p key="title" className="text-md">
                HeroUI
              </p>
              <p key="description" className="text-small text-default-500">
                heroui.com
              </p>
            </div>
          </div>
        )} */}

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
  );
}

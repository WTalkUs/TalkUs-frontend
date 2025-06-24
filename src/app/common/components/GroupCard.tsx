import { Card, CardBody, CardHeader, Avatar, Image, Link } from "@heroui/react";
import NextImage from "next/image";
import Tags from "./Tags";

interface GroupCardProps {
  forumId: string;
  title: string;
  description: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string;
  bannerUrl?: string;
  iconUrl?: string;
}

export default function GroupCard({
  forumId,
  title: name,
  description,
  categories,
  createdAt,
  updatedAt,
  isActive,
  createdBy,
  bannerUrl,
  iconUrl,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${forumId}`} className="block h-full">
      <a className="block h-full"> {/* Hace que todo el Card sea clickeable */}
        <Card
          className="overflow-hidden p-0 h-[260px] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          id={forumId}
        >
          <CardHeader className="aspect-[4/1] w-full p-0 rounded-lg overflow-hidden">
            <Image
              src={bannerUrl || "/placeholder-banner.png"}
              as={NextImage}
              alt={`Banner for ${name}`}
              width={500}
              height={200}
              className="object-cover"
            />
          </CardHeader>

          <CardBody className="p-4 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {iconUrl ? (
                  <Avatar
                    size="lg"
                    isBordered
                    src={iconUrl}
                    className="bg-default-100"
                  />
                ) : (
                  <Avatar
                    className="bg-red-600 text-white font-bold"
                    name={`g/${name}`}
                    size="lg"
                    isBordered
                  >
                    {name.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-lg line-clamp-1">
                    g/{name}
                  </span>
                  <Tags tags={categories} />
                </div>
              </div>
              <p className="text-sm text-default-600 line-clamp-2">
                {description}
              </p>
            </div>
          </CardBody>
        </Card>
      </a>
    </Link>
  );
}

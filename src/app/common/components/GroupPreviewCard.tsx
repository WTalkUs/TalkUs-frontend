import { Card, CardBody, CardHeader, Avatar, Image } from "@heroui/react";
import NextImage from "next/image";

type GroupPreviewCardProps = {
  name: string;
  description: string;
  bannerUrl?: string;
  photoUrl?: string;
  members?: number;
  online?: number;
};

export default function GroupPreviewCard({
  name,
  description,
  bannerUrl = "/placeholder-banner.png",
  photoUrl,
  members = 1,
  online = 1,
}: GroupPreviewCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Banner */}
      <CardHeader className="aspect-[3/1] w-full p-0 rounded-lg overflow-hidden mb-4">
        <Image
          src={bannerUrl || "/placeholder-banner.png"}
          as={NextImage}
          alt={`Banner for ${name}`}
          width={500}
          height={200}
          className="object-cover w-full h-full"
        />
      </CardHeader>

      <CardBody className="p-4">
        <div className="flex items-center gap-3 mb-2">
          {photoUrl ? (
            <Avatar
              size="sm"
              isBordered
              src={photoUrl}
              className="bg-default-100"
            />
          ) : (
            <Avatar
              className="bg-red-600 text-white font-bold"
              name={`g/${name}`}
              size="sm"
              isBordered
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <div>
            <p className="font-semibold text-md">g/{name}</p>
            <p className="text-sm text-default-500">
              {members} member{members !== 1 ? "s" : ""} · {online} online
            </p>
          </div>
        </div>
        <p className="text-sm text-default-500">{description}</p>
      </CardBody>
    </Card>
  );
}

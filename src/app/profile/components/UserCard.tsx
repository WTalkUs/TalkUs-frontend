"use client";

import { Avatar, Button, Card } from "@heroui/react";

import PostModal from "@/app/common/components/PostModal";
import Image from "next/image";

type UserCardProps = {
  authorName: string;
  imageUrl: string;
};

export default function UserCard({ authorName, imageUrl }: UserCardProps) {
  return (
    <Card className="w-full max-w-[900px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6">
      <div className="relative">
        <div className="h-[250px] w-full relative overflow-hidden rounded-t-lg">
          <Image
            src="https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378143/samples/man-portrait.jpg"
            fill
            alt="banner"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-6 flex flex-col md:flex-row md:items-center gap-2 bg-background-1/50 backdrop-blur-sm p-2 pr-2 rounded-full">
            <Avatar
              isBordered
              radius="full"
              size="lg"
              src={imageUrl}
              className="border-white"
            />
            <div className="flex flex-col">
              <span className="text-white font-semibold text-lg">
                {authorName}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 space-x-4">
          <PostModal />
          <Button className="max-w-[100px] border-small border-white/50 p-2">
            Edit Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}

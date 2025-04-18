"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";

import Image from "next/image";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";

type PostCardProps = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
};

export default function PostCard({
  id,
  title,
  content,
  authorId,
  createdAt,
  likes,
  dislikes,
}: PostCardProps) {
  return (
    <Card className="w-full max-w-[900px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6">
      <div className="grid grid-cols-5 gap-4 p-6">
        <Image
          src="/modal_register.svg"
          width={156}
          height={156}
          alt="post image"
          className="rounded-2xl object-cover size-full col-span-1"
        />
        <div className="col-span-4 flex flex-col justify-between ">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-default-900">
                {title.length > 40 ? `${title.substring(0, 40)}...` : title}
              </h2>
              <p className="text-small text-default-400 mt-1">
                AQUI VAN LOS TAGS
              </p>
            </div>
            <div className="text-end ">
              <FavoriteIcon fontSize="medium" />
            </div>
          </div>

          <div className=" items-center mt-4 grid grid-cols-4">
            <div className="col-span-3 flex items-center gap-2">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://heroui.com/avatars/avatar-1.png"
              />
              <span className="text-default-900 font-semibold">
                Nombre del autor
                <span className="text-small text-default-400">
                  <br />
                  Hace{" "}
                  {(() => {
                    const diffMs = Date.now() - new Date(createdAt).getTime();
                    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
                    return diffH < 24
                      ? `${diffH} hora${diffH !== 1 ? "s" : ""}`
                      : `${Math.floor(diffH / 24)} día${
                          Math.floor(diffH / 24) !== 1 ? "s" : ""
                        }`;
                  })()}
                </span>
              </span>
            </div>
            <div className="flex justify-end gap-4 mt-4 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log(`Liked post ${id}`)}
              >
                <ThumbUpIcon fontSize="small" /> {likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log(`Disliked post ${id}`)}
              >
                <ThumbDownIcon fontSize="small" /> {dislikes}
              </Button>
              <Link color="foreground" href="#">
                Comentarios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

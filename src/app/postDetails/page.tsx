import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";
import Image from "next/image";

import styles from "../page.module.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Tags from "@/app/common/components/Tags";

export default function postDetails() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Card className="w-full max-w-[770px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6 p-6 space-y-2">
          <div className="col-span-3 flex flex-col md:flex-row md:items-center gap-2">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src="https://heroui.com/avatars/avatar-1.png"
            />
            <div className="flex flex-col">
              <span className="text-default-900 font-semibold">
                Nombre del autor
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-default-900 mb-2">
                Elpepe
              </h2>
              <Tags tags={["Ciencia", "Programacion", "Literatura"]} />
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Image
            src="https://res.cloudinary.com/ddto2dyb4/image/upload/v1745378145/cld-sample-2.jpg"
            width={746}
            height={746}
            alt="post image"
            className="rounded-2xl justify-center object-cover size-full col-span-1"
          />
          <p>651,324 Views</p>
          <div className="flex items-center mt-4">
            <div className="flex justify-start space-x-2 gap-2">
              <div className="flex gap-2">
                <ThumbUpIcon fontSize="medium" />
                <span>1,234 Likes</span>
              </div>
              <div className="flex gap-2">
                <ThumbDownIcon fontSize="medium" />
                <span>123 Dislikes</span>
              </div>
              <div className="flex gap-2">
                <CommentIcon fontSize="medium" />
                <span>1,234 Favorites</span>
              </div>
            </div>
            <div className="flex justify-end ml-auto">
              <BookmarkIcon fontSize="medium" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

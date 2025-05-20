"use client";

import {
  Avatar,
  Button,
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  ModalBody,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import Tags from "./Tags";
import Image from "next/image";
import EditPostModal from "./EditPostModal";

import { useAuth } from "@/app/contexts/AuthProvider";
import { deletePost } from "@/app/services/posts/delete";
import { editPost } from "@/app/services/posts/edit";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { IconButton } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";

type PostCardProps = {
  id: string;
  title: string;
  authorName: string;
  content: string;
  imageUrl: string;
  authorId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
};

export default function PostCard({
  id,
  title,
  authorName,
  content,
  authorId,
  imageUrl,
  createdAt,
  likes,
  dislikes,
}: PostCardProps) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const handleDelete = async () => {
    if (user) {
      const result = await deletePost(id);
      if (result.success) {
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post:", result.error);
      }
    } else {
      console.error("User not authenticated");
    }
    onCloseDelete();
  };

  return (
    <Card className="w-full max-w-[900px] bg-background-1 shadow-md rounded-lg border border-default-200 m-6">
      <div className="grid md:grid-cols-5 gap-4 p-6">
        <Image
          src={imageUrl}
          width={156}
          height={156}
          alt="post image"
          className="rounded-2xl object-cover size-full col-span-1 hidden md:block w-[156px] h-[156px]"
        />
        <div className="col-span-4 flex flex-col justify-between ">
          <div className="grid grid-cols-[4fr_1fr]">
            <div className="">
              <h2 className="text-2xl font-semibold text-default-900 mb-2">
                {title.length > 44 ? `${title.substring(0, 44)}...` : title}
              </h2>
              <Tags tags={["Ciencia", "Programacion", "Literatura"]} />
            </div>

            <div className="my-0 items-end max-h-[32px] text-right">
              <IconButton
                className="cursor-pointer h-32px !pt-0"
                color="inherit"
              >
                <FavoriteIcon fontSize="medium" />
              </IconButton>
              {user?.uid === authorId ? (
                <Dropdown className="!min-w-[140px]">
                  <DropdownTrigger>
                    <IconButton
                      className="cursor-pointer h-32px !pt-0"
                      color="inherit"
                    >
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      key="edit"
                      variant="light"
                    >
                      <Button
                        className="bg-gradient-to-br from-indigo-500 to-pink-500 w-full"
                        onPress={() => {
                        onOpen();
                      }}>
                        Edit
                      </Button>
                    </DropdownItem>
                    <DropdownItem key="delete" variant="light">
                      <Button
                        variant="solid"
                        className="bg-gradient-to-br from-danger-500 to-danger-100 w-full"

                        onPress={() => {
                        onOpenDelete();
                      }}
                      >
                        Delete
                      </Button>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : null}
            </div>
          </div>
          <div className=" items-center mt-4 grid grid-cols-4">
            <div className="col-span-3 flex flex-col md:flex-row md:items-center gap-2">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://heroui.com/avatars/avatar-1.png"
              />
              <div className="flex flex-col">
                <span className="text-default-900 font-semibold">
                  {authorName}
                </span>
                <span className="text-small text-default-400">
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
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                onClick={() => console.log(`Liked post ${id}`)}
                className="bg-transparent border-none cursor-pointer"
              >
                <ThumbUpIcon fontSize="small" /> {likes}
              </Button>
              <Button
                size="sm"
                onClick={() => console.log(`Disliked post ${id}`)}
                className="bg-transparent border-none cursor-pointer"
              >
                <ThumbDownIcon fontSize="small" /> {dislikes}
              </Button>
              {/* <Link color="foreground" href="#">
                Comentarios
              </Link> */}
            </div>
          </div>
        </div>
      </div>
      <EditPostModal
        isOpen={isOpen}
        onClose={onClose}
        post={{
          id, 
          title,
          content,
          imageUrl,}}
        onSaved={() => {
          onClose();
        }}
      />
       <Modal  isOpen={isOpenDelete}
      onOpenChange={(open) => { if (!open) onCloseDelete(); }}>
        <ModalContent>
          {(open) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Eliminar Post</ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleDelete}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}

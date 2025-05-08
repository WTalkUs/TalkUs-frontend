"use client";
import {
  Button,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  Form,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { FormEvent, useState } from "react";

export default function PostModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados independientes para cada campo
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [authorId, setAuthorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      return alert("Todos los campos son obligatorios");
    }

    setIsSubmitting(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (imageFile) fd.append("image", imageFile, imageFile.name);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/posts`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.text();
      setIsSubmitting(false);
      return alert("Error al crear post: " + err);
    }

    alert("Post creado con éxito");
    onClose();
    // limpia el formulario
    setTitle("");
    setContent("");
    setTag("");
    setImageFile(null);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30 max-w-[100px] p-2"
      >
        Create Post
      </Button>

      <Modal
        size="xl"
        className="shadow-md shadow-fuchsia-500"
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <ModalContent className="p-8 pt-0 space-y-6">
          <ModalHeader className="h-8 text-2xl font-semibold pt-0 mx-auto">
            Create a Post
          </ModalHeader>
          <Divider />
          <Form onSubmit={handlePost} className="space-y-4">
            <Input
              isRequired
              name="title"
              variant="underlined"
              type="text"
              label="Title"
              className="!w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content */}
            <Textarea
              isRequired
              name="content"
              label="Content"
              placeholder="Enter your content"
              className="!w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* <Select
              name="tags"
              label="Tag"
              placeholder="Select a tag"
              className="!w-full"
              value={tag}
              selectionMode="multiple"
              onValueChange={(val) => setTag(val)}
            >
              <SelectItem key="news"      />
              <SelectItem key="tutorial"  />
              <SelectItem key="opinion"  />
            </Select> */}

            <Input
              name="image"
              type="file"
              description="Upload an image for your post."
              className="!w-full"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />

            <Button
              type="submit"
              color="secondary"
              className="self-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Submit"}
            </Button>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}

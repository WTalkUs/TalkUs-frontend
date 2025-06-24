"use client";
import { Avatar, Button, Card, addToast } from "@heroui/react";

import PostModal from "@/app/common/components/PostModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { getGroupById } from "@services/groups/getById";
import { useRouter } from "next/navigation";
import { Group } from "@services/groups/getAll";
import { IconSettings } from "@tabler/icons-react";
import Tags from "@components/Tags";
import joinGroup from "@services/groups/join";
import leaveGroup from "@services/groups/leave";

export default function GroupInfoCard({ forumId }: { forumId: string }) {
  // Estados para manejar la información del grupo
  const [group, setGroup] = useState<Group | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [photoProfile, setPhotoProfile] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);

  // Estado para manejar la autenticación
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Espera a que termine la carga de auth
    const fetchGroup = async () => {
      setIsLoading(true);
      const result = await getGroupById(forumId);
      setGroup(result.data);
      setBanner(result.data.bannerUrl || "./placeholder-banner.png");
      setPhotoProfile(result.data.iconUrl || "./placeholder-icon.png");
      setDisplayName(result.data.title || "Grupo sin nombre");
      setIsModerator(result.data.moderators.includes(user?.uid));
      setIsMember(
        result.data.members?.includes(user?.uid) ||
          result.data.moderators.includes(user?.uid)
      );
      if (!result.success) {
        console.error("Error fetching group:", result.error);
        router.push("/groups");
      }
      setIsLoading(false);
    };
    fetchGroup();
  }, [forumId, router, authLoading]);

  const handleJoinGroup = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await joinGroup(forumId);
      if (response.success) {
        console.log("Successfully joined the group");
        setIsMember(true); // Actualiza el estado para reflejar que ahora es miembro
        addToast({
          title: "Joined Group",
          description: "You have successfully joined the group.",
          color: "success",
        });
      } else {
        console.error("Error joining group:", response.error);
        addToast({
          title: "Error Joining Group",
          description:
            (response.error as string) ||
            "An error occurred while joining the group.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Unexpected error joining group:", error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await leaveGroup(forumId);
      if (response.success) {
        console.log("Successfully left the group");
        setIsMember(false); // Actualiza el estado para reflejar que ya no es miembro
        addToast({
          title: "Left Group",
          description: "You have successfully left the group.",
          color: "success",
        });
      } else {
        console.error("Error leaving group:", response.error);
        addToast({
          title: "Error Leaving Group",
          description:
            (response.error as string) ||
            "An error occurred while leaving the group.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Unexpected error leaving group:", error);
    }
  };

  // Mostrar loading mientras se carga la autenticación o los datos
  if (authLoading || isLoading || !displayName || !photoProfile || !banner) {
    return (
      <Card className="lg:w-[900px] bg-background-1 shadow-md rounded-lg border border-default-200">
        <div className="relative">
          <div className="h-[250px] w-full relative overflow-hidden rounded-t-lg">
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="absolute bottom-4 left-6 flex flex-col md:flex-row md:items-center gap-2 bg-background-1/50 backdrop-blur-sm p-2 pr-2 rounded-full">
            <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex flex-col">
              <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className="col-span-2 animate-pulse rounded bg-gray-300"></div>
          <div className="pr-6 py-4 flex gap-2 flex-wrap">
            <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-36 h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className=" lg:w-[900px] bg-background-1 shadow-md rounded-lg border border-default-200">
      <div className="relative">
        <div className="h-[250px] w-full relative overflow-hidden rounded-t-lg">
          <Image
            src={banner}
            fill
            alt="banner"
            className="object-cover"
            priority
          />

          {/* Botón de editar banner */}
          {isModerator && (
            <div className="absolute top-4 right-4">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onClick={() => setIsEditing(true)}
                className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
              >
                <IconSettings size={24} />
              </Button>
            </div>
          )}

          <div className="absolute w-fit bottom-4 left-6 flex flex-col md:flex-row md:items-center gap-2 bg-background-1/50 backdrop-blur-sm p-2 pr-2 rounded-full">
            <Avatar
              isBordered
              radius="full"
              size="lg"
              src={photoProfile}
              className="border-white cursor-pointer hover:scale-105 transition-transform"
            />
            <div className="flex  flex-col">
              <span className="text-white font-semibold text-lg">
                {displayName}
              </span>
            </div>
          </div>
          <div className="absolute lg:bottom-2 lg:right-2 flex p-6 items-center gap-2">
            <Tags tags={group?.categories}></Tags>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">{group?.description}</div>
          <div className=" col-span-1 flex gap-2 flex-wrap justify-end">
            <PostModal />

            {/* Botón para cambiar email */}
            <Button
              className="max-w-[140px] border-small border-white/50"
              onClick={() => {
                if (isMember) {
                  handleLeaveGroup();
                } else {
                  handleJoinGroup();
                }
              }}
            >
              {isMember ? "Joined" : "Join"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

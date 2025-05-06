"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

//Components
import Login from "./Login";
import Register from "./register";

//Assets
import TalkUs from "../icons/TalkUs.svg";
import {
  IconSearch,
  IconHomeFilled,
  IconUsersGroup,
  IconBell,
} from "@tabler/icons-react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { logout } from "@/app/services/auth/logout";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getItemColor = (item: string) => {
    if (item === "Log Out") return "danger";
    if (item === "Help & Feedback") return "secondary";
    return "foreground";
  };

  const menuItemsNotLogged = [
    "Home",
    "Groups",
    "Login",
    "Register",
    "Help & Feedback",
  ];

  const { user , loading } = useAuth()

  const handleLogout = async () => {
    const { success, error } = await logout();
    if (success) {
      addToast({
        title: "Cierre de sesión",
        description: "Has cerrado sesión correctamente.",
        color: "success",
      });
    } else {
      console.error("Logout error:", error);
      addToast({
        title: "Error",
        description: "No se pudo cerrar sesión.",
        color: "danger",
      });
    }
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="w-full fixed bg-background-2 shadow-md"
    >
      <NavbarBrand className="flex items-center gap-4 flex-shrink-0 w-auto">
        <Image
          alt="Logo"
          className="min-w-[30px] min-h-[30px] w-[30px] h-[30px]"
          height={30}
          src={TalkUs}
          width={30}
        />
        <p className="hidden sm:flex font-bold text-inherit text-xl">TalkUs</p>

        <Button
          isIconOnly
          className="bg-background-3 rounded-lg hidden sm:flex"
        >
          <IconHomeFilled size={24} className="text-default-500" />
        </Button>

        <Button
          isIconOnly
          className="bg-background-3 rounded-lg hidden sm:flex"
        >
          <IconUsersGroup size={24} className="text-default-500" />
        </Button>
      </NavbarBrand>
      <NavbarContent justify="center" className="flex-1 lg:flex max-w-3xl px-4">
        <Input
          classNames={{
            base: "flex gap-4 h-10 w-full min-w-[150px]",
            mainWrapper: "h-full w-full",
            input: "text-small",
            inputWrapper:
              "h-full w-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          minLength={200}
          endContent={<IconSearch size={18} className="text-default-500" />}
          type="search"
        />
      </NavbarContent>
      {!user ? (
        <NavbarContent justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarItem className="hidden sm:flex">
            <Register />
          </NavbarItem>
          <NavbarItem className="hidden md:flex">
            <Login />
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent as="div" justify="end">
          <Button
            isIconOnly
            className="bg-background-3 rounded-lg hidden md:flex"
          >
            <IconBell size={24} className="text-default-500" />
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  isBordered
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
                <p className="font-bold text-inherit text-lg pl-2 hidden sm:flex">
                  Jose Luis
                </p>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="home" className="sm:hidden">
                Home
              </DropdownItem>
              <DropdownItem key="groups" className="sm:hidden">
                Groups
              </DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem key="notifications" className="md:hidden">
                Notifications
              </DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem onClick={() => handleLogout()} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
      <NavbarMenu>
        {menuItemsNotLogged.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={getItemColor(item)}
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
} from "@heroui/react";
import Image from "next/image";

//Components
import Login from "./Login";

//Assets
import TalkUs from "../icons/TalkUs.svg";
import { IconSearch } from "@tabler/icons-react";

export default function NavbarComponent() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Image
          alt="Logo"
          className="mr-4"
          height={24}
          src={TalkUs}
          width={24}
        />
        <p className="font-bold text-inherit">TalkUs</p>
      </NavbarBrand>
      <NavbarContent justify="center">
        <Input
          classNames={{
            base: "flex gap-4 h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<IconSearch size={18} className="text-default-500" />}
          type="search"
        />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Login />
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

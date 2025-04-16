import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  Spacer,
} from "@heroui/react";
import Image from "next/image";

//Components
import Login from "./Login";

//Assets
import TalkUs from "../icons/TalkUs.svg";
import {
  IconSearch,
  IconHomeFilled,
  IconUsersGroup,
} from "@tabler/icons-react";

export default function NavbarComponent() {
  return (
    <Navbar maxWidth="full" className="w-full fixed bg-background-2 shadow-md">
      <NavbarBrand className="flex items-center gap-4 flex-shrink-0 w-auto">
        <Image
          alt="Logo"
          className="min-w-[30px] min-h-[30px] w-[30px] h-[30px]"
          height={30}
          src={TalkUs}
          width={30}
        />
        <p className="hidden md:flex font-bold text-inherit text-xl">TalkUs</p>

        <Link href="#" className="flex items-center">
          <IconHomeFilled size={24} className="text-default-500" />
        </Link>

        <Link href="#" className="flex items-center">
          <IconUsersGroup size={24} className="text-default-500" />
        </Link>
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
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="secondary" href="#" variant="solid">
            Register
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Login />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

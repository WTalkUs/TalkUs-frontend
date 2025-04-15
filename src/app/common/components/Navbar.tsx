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
import {
  IconSearch,
  IconHomeFilled,
  IconUsersGroup,
} from "@tabler/icons-react";

export default function NavbarComponent() {
  return (
    <Navbar maxWidth="full" className="w-full fixed bg-background-2 shadow-md">
      <NavbarBrand className="flex gap-2 mr-2 pr-2">
        <Image
          alt="Logo"
          className="mr-4 min-w-[30px] min-h-[30px] w-[30px] h-[30px]"
          height={30}
          src={TalkUs}
          width={30}
        />
        <p className="hidden lg:flex font-bold text-inherit text-xl">TalkUs</p>
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem className="pl-8">
          <Link href="#" className="flex">
            <IconHomeFilled size={24} className="mr-4 text-default-500" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" className="flex">
            <IconUsersGroup size={24} className="mr-4 text-default-500" />
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center">
        <Input
          classNames={{
            base: "flex gap-4 h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full w-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
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
        <NavbarItem className="hidden lg:flex">
          <Login />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

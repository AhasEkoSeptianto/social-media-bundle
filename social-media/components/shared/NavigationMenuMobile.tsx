import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Menu1 } from "./Sidebar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function NavigationMenuMobile() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen shadow-lg bg-brand !justify-between">
        <NavigationMenuItem className="space-x-2 bg-brand rounded-lg w-full flex items-center justify-between text-highlight2">
          {Menu1.map((menu, idx) => (
            <NavigationMenuLink
              key={idx}
              className={`${navigationMenuTriggerStyle()}  ${pathname === menu.url ? "bg-brand5 text-white" : ""} font-semibold p-6`}
              render={
                <Link href={menu.url}>
                  <menu.icon />
                </Link>
              }
            />
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

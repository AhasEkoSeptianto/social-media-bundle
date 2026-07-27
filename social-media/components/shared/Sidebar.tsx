"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  Bookmark,
  Compass,
  Home,
  LogOut,
  MessageCircleMore,
  Settings,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { useUser } from "@/hooks/auths/useUser";
import { useEffect } from "react";
import { logout } from "@/lib/api/auth.api";
import { useRouter } from "next/navigation";

export const Menu1 = [
  { title: "Home", url: "/", icon: Home },
  { title: "Explore", url: "/explore", icon: Compass },
  { title: "Message", url: "/message", icon: MessageCircleMore, badge: 24 },
  { title: "Activity", url: "/activity", icon: Bell },
  { title: "Profile", url: "/profile", icon: UserRound },
];

export const MenuMobile = [
  { title: "Home", url: "/", icon: Home },
  { title: "Explore", url: "/explore", icon: Compass },
  { title: "Message", url: "/message", icon: MessageCircleMore, badge: 24 },
  { title: "Activity", url: "/activity", icon: Bell },
  { title: "Profile", url: "/profile", icon: UserRound },
];

export const Menu2 = [
  { title: "Saved", url: "#", icon: Bookmark },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, mutate } = useUser();
  const handleLogout = async () => {
    await logout();
    await mutate();
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="bg-[#0d0d12]">
        <div className="py-4">
          <p className="text-4xl  text-highlight2 font-bold">Prism</p>
          <div className="h-1 w-14 rounded-full bg-gradient-to-r from-orange-500 to-purple-600" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#0d0d12] text-white">
        <SidebarGroup>
          <SidebarMenu>
            {Menu1.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<a href={item.url} />}
                  size="lg"
                  isActive={pathname === item.url}
                  className="
                        hover:bg-[#1E1935]/50 hover:text-white text-highlight2
                        data-active:bg-[#1E1935]
                        data-active:text-highlight2
                        data-active:hover:bg-[#1E1935]
                        text-lg
                    "
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <Separator className="mb-2 bg-white/10" />
        <SidebarGroup>
          <SidebarMenu>
            {Menu2.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<a href={item.url} />}
                  size="lg"
                  isActive={pathname === item.url}
                  className="
                        hover:bg-[#1E1935]/50 hover:text-white text-highlight2
                        data-active:bg-[#1E1935]
                        data-active:text-highlight2
                        data-active:hover:bg-[#1E1935]
                        text-lg
                    "
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#0d0d12]">
        <Separator className="mb-2 bg-white/10" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-[#1E1935]/50">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-white">{user?.name}</span>
                <span className="text-xs text-neutral-400">
                  {user?.username}
                </span>
              </div>
            </SidebarMenuButton>
            <SidebarMenuAction
              onClick={handleLogout}
              className="hover:cursor-pointer"
            >
              <LogOut className="size-4 text-neutral-400 hover:text-red-500 " />
            </SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

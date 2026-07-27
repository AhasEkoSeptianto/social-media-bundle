"use client";

import EditProfileForm from "@/components/forms/EditProfileForm";
import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/auths/useUser";
import { logout } from "@/lib/api/auth.api";
import { nextFetcher } from "@/lib/fetcher";
import {
  ArrowLeft,
  Bookmark,
  Camera,
  Grid2X2,
  LogOut,
  Play,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface ExploreItem {
  id: string;
  src: string;
  alt: string;
  isVideo?: boolean;
  span?: "tall"; // buat item yang row-span-2
}

const items: ExploreItem[] = [
  { id: "1", src: "/images/post1.avif", alt: "Mountain sunset", span: "tall" },
  { id: "2", src: "/images/post2.avif", alt: "Green sofa" },
  { id: "3", src: "/images/post3.avif", alt: "Restaurant dish", isVideo: true },
  { id: "4", src: "/images/post4.avif", alt: "Dog closeup" },
  { id: "5", src: "/images/post5.avif", alt: "Eiffel tower", isVideo: true },
  { id: "6", src: "/images/post6.avif", alt: "Pool float" },
  { id: "7", src: "/images/post7.avif", alt: "Ocean waves" },
  { id: "8", src: "/images/post8.avif", alt: "Man portrait" },
];
export default function ProfilePage() {
  const router = useRouter();
  const { user, mutate } = useUser();
  const [onSetting, setOnSetting] = useState(false);
  const [loading, setLoading] = useState({
    getPost: true,
    logoutMobile: false,
  });
  const onLogout = async () => {
    setLoading((prev) => ({ ...prev, logoutMobile: true }));
    await logout();
    await mutate();
    router.push("/login");
    setLoading((prev) => ({ ...prev, logoutMobile: false }));
  };
  const [myPostList, setMyPostList] = useState([]);

  const getMyPost = async () => {
    setLoading((prev) => ({ ...prev, getPost: true }));
    const myPost = await nextFetcher(`/api/posts/get?myPost=true&images=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      setMyPostList(resp?.data?.posts);
    });
    setLoading((prev) => ({ ...prev, getPost: false }));
  };

  useEffect(() => {
    getMyPost();
  }, []);
  if (onSetting) {
    return (
      <div className="absolute z-50 h-screen w-screen bg-brand p-4 space-y-2">
        <div className="flex items-center space-x-4">
          <ArrowLeft onClick={() => setOnSetting(false)} />
          <p className="text-2xl">Settings</p>
        </div>
        <Separator className="h-3" />
        <div
          className="flex items-center space-x-2 text-danger "
          onClick={onLogout}
        >
          <LogOut />
          <p>{loading.logoutMobile ? <Spinner /> : "Keluar"} </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="fixed bottom-0 left-0 z-30 lg:hidden">
        <NavigationMenuMobile />
      </div>

      <div className="absolute top-8 right-8 text-black z-40 lg:hidden">
        <Button size="lg" onClick={() => setOnSetting(true)}>
          <Settings className="rounded-lg" size={50} />
        </Button>
      </div>

      <main className="w-full lg:grid grid-cols-12 p-4 gap-8 ">
        <div className="col-span-2"></div>
        <div className="col-span-9 container space-y-8">
          <div className="relative h-70">
            <div className="bg-[url(/images/post1.avif)] rounded-lg w-full h-60 bg-cover">
              <div className="absolute bottom-0 left-10">
                {user?.avatarUrl ? (
                  <div className="h-32 w-32 rounded-full relative overflow-hidden">
                    <Image src={user?.avatarUrl} alt="prof" fill={true} />
                  </div>
                ) : (
                  <Skeleton className="h-32 w-32 rounded-full" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="lg:flex justify-between items-center space-x-2">
                {user?.name ? (
                  <h1 className="text-2xl lg:text-4xl lg:min-w-36">
                    {user?.username ?? user?.name}
                  </h1>
                ) : (
                  <Skeleton className="h-10 w-40 mt-2" />
                )}
                <EditProfileForm />
              </div>
              <p>{user?.bio}</p>

              <div className="space-x-2">
                {user?.tag
                  ? user?.tag.map((val: string, idx: number) => (
                      <Badge
                        key={idx}
                        className="bg-highlight text-highlight2 font-bold"
                      >
                        {val}
                      </Badge>
                    ))
                  : null}
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-10 text-center">
              <div>
                <h2 className="lg:text-3xl font-bold">
                  {user?.postCount ?? 0}
                </h2>
                <p className="text-sm lg:text-base text-white/60">Posts</p>
              </div>
              <div>
                <h2 className="lg:text-3xl font-bold">
                  {user?.followerCount ?? 0}
                </h2>
                <p className="text-xs lg:text-base text-white/60">Followes</p>
              </div>
              <div>
                <h2 className="lg:text-3xl font-bold">
                  {user?.followingCount ?? 0}
                </h2>
                <p className="text-xs lg:text-base text-white/60">Following</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="preview">
            <TabsList variant="line">
              <TabsTrigger value="preview" className="data text-white text-lg">
                <Grid2X2 />
                Post
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-white text-lg">
                <Bookmark />
                Saved
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              {loading.getPost ? (
                <div className="place-content-center h-96 w-full">
                  <Spinner className="mx-auto size-8" />
                </div>
              ) : myPostList?.length === 0 ? (
                <div className="place-content-center h-96 w-full">
                  <Camera className="mx-auto" size={100} />
                  <p className="text-center text-2xl">No Share Photos</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 auto-rows-[200px]">
                  {myPostList?.map((item: any, idx: number) => (
                    <div
                      key={item._id}
                      className={`relative overflow-hidden rounded-lg bg-neutral-900`}
                    >
                      <Image
                        src={item.images}
                        fill
                        className="object-cover"
                        alt={`images ${idx}`}
                        sizes="(max-width: 768px) 33vw, 300px"
                        loading="eager"
                      />
                      {/* {item.isVideo && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                        <Play className="h-3 w-3 fill-white text-white" />
                      </div>
                    )} */}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved">
              <div className="grid grid-cols-3 gap-2 auto-rows-[200px]">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-lg bg-neutral-900 ${
                      item.span === "tall" ? "row-span-2" : ""
                    } ${idx > 2 ? "hidden" : ""}`}
                  >
                    <Image
                      src={item.src}
                      fill
                      className="object-cover"
                      alt={item.alt}
                      sizes="(max-width: 768px) 33vw, 300px"
                      loading="eager"
                    />
                    {item.isVideo && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                        <Play className="h-3 w-3 fill-white text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
}

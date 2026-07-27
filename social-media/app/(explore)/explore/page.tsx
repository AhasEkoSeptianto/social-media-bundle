"use client";

import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/auths/useUser";
import { following } from "@/lib/api/follow.api";
import { searchUsers } from "@/lib/api/users.api";
import { nextFetcher } from "@/lib/fetcher";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

const tagMenu = [
  "All",
  "Photografy",
  "Music",
  "Travel",
  "Food",
  "Design",
  "Sport",
  "Art",
  "Tech",
];

export default function ExplorePage() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({ follow: "" });
  const { user: myUser } = useUser();
  const {
    data: users,
    isLoading,
    mutate,
  } = useSWR(`/api/users?search=${search}`, searchUsers, {
    shouldRetryOnError: false,
  });

  const HandleFollow = async (following_id: string) => {
    setLoading((prev) => ({ follow: following_id }));

    try {
      let resp = await following(following_id);
      mutate();
    } catch (error) {
      console.log(error);
    }

    setLoading((prev) => ({ follow: "" }));
  };

  const searchDebounce = useDebouncedCallback((value) => setSearch(value), 500);

  return (
    <SidebarProvider className="">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="fixed bottom-0 left-0 z-30 lg:hidden">
        <NavigationMenuMobile />
      </div>
      <main className="w-full lg:grid grid-cols-12 p-4 gap-8 ">
        <div className="col-span-2"></div>
        <div className="col-span-9 lg:container space-y-8">
          <div className="lg:flex items-center justify-between space-y-4 lg:space-y-0">
            <Field orientation="horizontal" className="bg-brand w-full lg:w-60">
              <Input
                type="search"
                placeholder="Search people,tag,place"
                onChange={(e) => searchDebounce(e.target.value)}
              />
              <Button variant="secondary" className="bg-brand5">
                Search
              </Button>
            </Field>
            <div
              className={`flex flex-wrap items-center space-x-2 ${search ? "hidden" : ""}`}
            >
              {tagMenu.map((tag, idx) => (
                <Button
                  size="lg"
                  variant="secondary"
                  className={`rounded-full ${tag === selectedTag ? "bg-highlight2" : ""} cursor-pointer`}
                  key={idx}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {search ? (
            <div className="space-y-2">
              {isLoading
                ? Array.from({ length: 8 }).map((i, idx) => (
                    <Skeleton className="h-10 w-full" key={idx} />
                  ))
                : users?.data?.map((user: any, idx: number) => (
                    <div
                      className={`flex items-center justify-between hover:bg-brand4 rounded-lg p-2 ${user?._id === myUser?.id ? "hidden" : ""}`}
                      key={idx}
                    >
                      <div className="flex items-center gap-2 ">
                        <Avatar size="lg">
                          <AvatarImage src={user?.avatar_url} alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{user?.name}</p>
                          <p>{user?.username}</p>
                        </div>
                      </div>
                      <Button
                        className="bg-brand5 text-white"
                        onClick={() => HandleFollow(user?._id)}
                        variant={user?.isFollow ? "outline" : "default"}
                      >
                        {loading.follow === user?._id ? (
                          <Spinner />
                        ) : user?.isFollow ? (
                          "Unfollow"
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    </div>
                  ))}
            </div>
          ) : (
            <PreviewPosts />
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}

const PreviewPosts = () => {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState({ getPosts: true });
  const getPosts = async () => {
    setLoading((prev) => ({ ...prev, getPosts: true }));
    const myPost = await nextFetcher(`/api/posts/get?images=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      setPostList(resp?.data?.posts);
    });

    setLoading((prev) => ({ ...prev, getPosts: false }));
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 auto-rows-[200px]">
      {loading.getPosts ? (
        <Fragment>
          {Array.from({ length: 3 }).map((i: any, idx: number) => (
            <Skeleton key={idx} className="h-60 w-full" />
          ))}
        </Fragment>
      ) : (
        postList?.map((item: any, idx) => (
          <div
            key={item._id}
            className={`relative overflow-hidden rounded-lg bg-neutral-900 `}
          >
            <Image
              src={item.images}
              fill
              className="object-cover"
              alt={`image ${idx}`}
              sizes="(max-width: 768px) 33vw, 300px"
              loading="eager"
            />
            {/* {item.isVideo && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                    <Play className="h-3 w-3 fill-white text-white" />
                  </div>
                )} */}
          </div>
        ))
      )}
    </div>
  );
};

"use client";

import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { following } from "@/lib/api/follow.api";
import { getNotification } from "@/lib/api/notification.api";
import dayjs from "@/lib/day";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

const dummyData = [
  {
    picture: "/images/person1.avif",
    name: "Riana",
    time: "2 minutes ago",
    activity: {
      type: "love",
      post_image: "/images/post1.avif",
      post_comment: "",
    },
  },
  {
    picture: "/images/person2.avif",
    name: "Sinta",
    time: "6 minutes ago",
    activity: {
      type: "follow",
      post_image: "",
      post_comment: "",
    },
  },
  {
    picture: "/images/person3.avif",
    name: "Mirja",
    time: "10 minutes ago",
    activity: {
      type: "comment",
      post_image: "/images/post3.avif",
      post_comment: "Fire shot!! 🔥",
    },
  },
  {
    picture: "/images/person4.avif",
    name: "Kina",
    time: "30 minutes ago",
    activity: {
      type: "repost",
      post_image: "/images/post5.avif",
      post_comment: "",
    },
  },
];

export default function ActivityPage() {
  const {
    data,
    mutate,
    isLoading: loadingFetch,
  } = useSWR("/api/notification/get", getNotification, {
    shouldRetryOnError: false,
  });
  const [loading, setLoading] = useState({ follow: "" });

  const HandleFollow = async (following_id: string) => {
    setLoading((prev) => ({ ...prev, follow: following_id }));
    try {
      await following(following_id);
      mutate();
    } catch (error) {
      throw new Error("");
    }

    setLoading((prev) => ({ ...prev, follow: "" }));
  };

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
        <div className="col-span-6 container space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl">Activity</h1>
              {/* <Badge className="bg-highlight2  text-hightlight dark:bg-blue-950 dark:text-blue-300">
                3 New
              </Badge> */}
            </div>
            {/* <Button variant="ghost" className="text-highlight2 cursor-pointer">
              Mark all as read
            </Button> */}
          </div>

          {loadingFetch ? (
            Array.from({ length: 4 }).map((a, i) => (
              <Skeleton className="h-20 w-full" key={i} />
            ))
          ) : data?.data?.length === 0 ? (
            <div className="place-content-center h-96 w-full text-center">
              <Bell className="mx-auto" size={70} />
              <p>No recent activity yet</p>
            </div>
          ) : (
            <Card className="bg-brand text-white">
              <CardContent className="space-y-2">
                {data?.data?.map((activity: any, idx: number) => (
                  <div key={idx}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar size="lg">
                          <AvatarImage
                            src={activity?.actor?.avatar_url}
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-2xl">
                            {activity?.actor?.username ?? activity?.actor?.name}{" "}
                            <span className="opacity-50 text-sm">
                              {activity.type === "like"
                                ? "like your photo"
                                : activity.type === "follow"
                                  ? "started following you"
                                  : activity.type === "comment"
                                    ? `commented: ${activity?.comment?.content}`
                                    : activity.type === "repost"
                                      ? "reposted your photo"
                                      : null}
                            </span>
                          </p>
                          <p className="opacity-50 text-sm">
                            {dayjs(activity.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>

                      <div>
                        {activity.type === "follow" ? (
                          <Button
                            className="bg-highlight2 rounded text-white"
                            onClick={() => HandleFollow(activity.actor._id)}
                            variant={
                              activity?.isFollowBack ? "outline" : "default"
                            }
                            disabled={loading.follow === activity.actor._id}
                          >
                            {loading.follow === activity?.actor._id ? (
                              <Spinner />
                            ) : activity?.isFollowBack ? (
                              "Unfollow"
                            ) : (
                              "Follow"
                            )}
                          </Button>
                        ) : ["like", "repost", "comment"].includes(
                            activity.type,
                          ) && activity?.post?.images ? (
                          <Image
                            src={activity?.post.images}
                            width={60}
                            height={60}
                            alt={`${activity.name}'s post`}
                            className="rounded-md object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                    <Separator className="mb-2 bg-white/10" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}

"use client";

import Image from "next/image";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import StoryFeed from "@/components/shared/StoryFeed";
import PostStory from "@/components/shared/PostStory";
import Feed from "@/components/freatures/feed/feed";
import { FeedTypes } from "@/type/components/features/feed";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import TrendingSection from "@/components/shared/TrendingSection";
import SuggestedSection from "@/components/shared/SuggestedSection";
import { usePosts } from "@/hooks/posts/usePosts";
import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import LoadingFeed from "@/components/freatures/feed/LoadingFeed";
import { useInfiniteScrollTrigger } from "@/hooks/auths/useInfinityScrollTrigger";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { posts, isLoading, isLoadingMore, isReachingEnd, loadMore } =
    usePosts();

  const sentinelRef = useInfiniteScrollTrigger({
    onLoadMore: loadMore,
    hasMore: !isReachingEnd,
    isLoading: isLoadingMore,
  });

  return (
    <SidebarProvider>
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="fixed bottom-0 left-0 z-30 lg:hidden">
        <NavigationMenuMobile />
      </div>
      <main className="w-full lg:grid grid-cols-12 p-4 lg:gap-8 ">
        <div className="col-span-2"></div>
        <div className="col-span-6 container space-y-4">
          <StoryFeed />
          <PostStory />
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <LoadingFeed key={idx} />
              ))
            : posts.map((post: FeedTypes, idx) => <Feed key={idx} {...post} />)}

          {/* Elemen sentinel -- kosong secara visual, cuma dipakai untuk deteksi scroll */}
          <div ref={sentinelRef} className="h-4" />

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}

          {isReachingEnd && posts.length > 0 && (
            <p className="text-center text-white/50 py-4">end the posts</p>
          )}
        </div>

        <div className="hidden lg:block col-span-3 py-4 space-y-4">
          <Field orientation="horizontal" className="bg-brand">
            <Input type="search" placeholder="Search in prism" />
            <Button variant="secondary" className="bg-brand5 cursor-pointer">
              Search
            </Button>
          </Field>

          <TrendingSection />
          <SuggestedSection />

          <div className="flex items-center flex-wrap space-x-4 text-lg text-highlight2">
            <p className="cursor-pointer hover:text-white">
              <a>Privasi</a>
            </p>
            <p className="cursor-pointer hover:text-white">
              <a>Trems</a>
            </p>
            <p className="cursor-pointer hover:text-white">
              <a>Cookies</a>
            </p>
            <p className="cursor-pointer hover:text-white">
              <a>Ads</a>
            </p>
            <p className="cursor-pointer hover:text-white">
              <a>About</a>
            </p>
          </div>
          <p className="text-sm text-highlight2">© 2026 Prism Inc.</p>
        </div>
      </main>
    </SidebarProvider>
  );
}

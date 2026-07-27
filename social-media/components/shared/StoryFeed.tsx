import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";

const stories = [
  { name: "Ariana", img: "/images/person1.avif", hasStory: true },
  { name: "Marco", img: "/images/person2.avif", hasStory: true },
  { name: "Marco", img: "/images/person4.avif", hasStory: false },
  { name: "Ariana", img: "/images/person5.avif", hasStory: false },
  { name: "Marco", img: "/images/person6.avif", hasStory: false },
  { name: "Ariana", img: "/images/person7.avif", hasStory: false },
  { name: "Marco", img: "/images/person1.avif", hasStory: false },
  // ...
];

export default function StoryFeed() {
  return (
    <Card className="bg-brand text-white p-4">
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={`relative rounded-full p-[2px] ${"bg-neutral-600"}`}
            >
              <div className="rounded-full p-[2px] bg-[#0d0d12]">
                <Image
                  src={"/images/person3.avif"}
                  width={60}
                  height={60}
                  alt="prof"
                  className="rounded-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 ring-2 ring-[#0d0d12]">
                <Plus className="h-3 w-3 text-white" />
              </div>
            </div>
            <span className="text-xs text-purple-300">your story</span>
          </div>
          {stories.map((story, idx) => (
            <div
              key={`${story.name} ${idx}`}
              className="relative flex flex-col items-center gap-1 shrink-0"
            >
              <div
                className={`rounded-full p-[2px] ${
                  story.hasStory
                    ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500"
                    : "bg-neutral-600"
                }`}
              >
                <div className="rounded-full p-[2px] bg-[#0d0d12]">
                  <Image
                    src={story.img}
                    width={60}
                    height={60}
                    alt="prof"
                    className="rounded-full"
                  />
                </div>
              </div>
              <span className="text-xs text-purple-300">{story.name}</span>
            </div>
          ))}{" "}
        </div>
      </CardContent>
    </Card>
  );
}

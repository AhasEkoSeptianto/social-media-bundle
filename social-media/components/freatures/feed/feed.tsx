import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/auths/useUser";
import { usePosts } from "@/hooks/posts/usePosts";
import { deletePost, likePost } from "@/lib/api/posts.api";
import { FeedTypes } from "@/type/components/features/feed";
import {
  Ellipse,
  Ellipsis,
  Heart,
  MessageCircleMore,
  SendHorizonal,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import dayjs from "@/lib/day";
import CommentPostForm from "@/components/forms/CommentPostForm";
import Comment from "../comment/Comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Feed(props: FeedTypes) {
  const { user, mutate } = useUser();
  const { mutate: mutatePost } = usePosts();
  const [loading, setLoading] = useState({
    delete: false,
    like: false,
  });
  const [openComment, setOpenComment] = useState(false);

  const deletePostFunction = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    try {
      let resp = await deletePost(props._id);
      mutatePost();
      toast.success("Success", { position: "top-center" });
    } catch (error) {
      console.log(error);
    }

    setLoading((prev) => ({ ...prev, delete: false }));
  };

  const handleLikePost = async () => {
    setLoading((prev) => ({ ...prev, like: true }));
    try {
      await likePost(props._id);
      console.log("updated");
      mutatePost();
    } catch (error) {
      console.log(error);
    }

    setLoading((prev) => ({ ...prev, like: false }));
  };

  return (
    <Card className="bg-brand text-white">
      <CardHeader className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar size="lg">
            <AvatarImage
              src={props.author.avatarUrl}
              alt={`profile ${props.author.avatarUrl}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-lg">{props.author.name}</p>
            <p className="opacity-50"> {dayjs(props.createdAt).fromNow()}</p>
          </div>
        </div>
        {user?.id === props.author._id ? (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  aria-label="Popover options post"
                  className="cursor-pointer"
                  variant="ghost"
                />
              }
            >
              <Ellipsis />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-42 px-0">
              <div className=" ">
                <Button
                  aria-label="Delete post"
                  variant="ghost"
                  className="p-2  text-danger cursor-pointer font-bold w-full"
                  onClick={() => deletePostFunction()}
                >
                  <span className="text-left w-full">
                    {loading.delete ? <Spinner /> : "Delete"}
                  </span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </CardHeader>
      <CardContent className="bg-brand space-y-4">
        <p>{props.postContext}</p>
        {props.images ? (
          <div className="relative w-full h-96 overflow-hidden">
            <Image
              className="rounded"
              src={props.images}
              fill
              alt="prof"
              sizes="(max-width: 768px) 100vw, 500px"
            />{" "}
          </div>
        ) : null}

        <div>
          <Button
            variant="ghost"
            className="cursor-pointer text-lg"
            aria-label="Like post"
            onClick={handleLikePost}
          >
            <Heart
              size={40}
              className={` ${props.isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <p>{props.likesCount}</p>
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer text-lg"
            onClick={() => setOpenComment(true)}
          >
            <MessageCircleMore size={40} />
            <p>{props.commentsCount}</p>
          </Button>
          <Button variant="ghost" className="cursor-pointer text-lg">
            <Share2 size={40} />
            <p>{props.sharesCount}</p>
          </Button>
        </div>
      </CardContent>
      {openComment ? (
        <CardFooter className="bg-brand">
          <div className="w-full space-y-2">
            <Comment post_id={props._id} />
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}

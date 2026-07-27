import CommentPostForm from "@/components/forms/CommentPostForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getComment } from "@/lib/api/posts.api";
import dayjs from "dayjs";
import Image from "next/image";
import useSWR from "swr";

interface Props {
  post_id: string;
}
export default function Comment(props: Props) {
  const { data, isLoading, mutate } = useSWR(
    `/api/posts/${props.post_id}/comment`,
    getComment,
    {
      shouldRetryOnError: false, // jangan retry kalau 401 (belum login)
      refreshInterval: 20000,
    },
  );

  return (
    <div className="space-y-2">
      {isLoading ? (
        <Loading />
      ) : (
        data?.data?.map((comment: any, idx: number) => (
          <div key={idx} className="flex space-x-2">
            <Avatar size="sm">
              <AvatarImage src={comment?.author?.avatarUrl} alt={comment?.id} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p>
                <span className="font-bold">{comment?.author?.name}</span>{" "}
                <span className="text-white/90">{comment?.content}</span>
              </p>
              <p className="opacity-50 textsm">
                {" "}
                {dayjs(comment.createdAt).fromNow()}
              </p>
            </div>
          </div>
        ))
      )}
      <CommentPostForm
        post_id={props.post_id}
        onSuccessComment={() => mutate()}
      />
    </div>
  );
}

const Loading = () => {
  return (
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="w-full space-y-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/5" />
      </div>
    </div>
  );
};

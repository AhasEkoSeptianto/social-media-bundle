import { SendHorizonal } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCommentPostFormData,
  createCommentPostSchema,
} from "@/lib/schemas/post.schema";
import { Button } from "../ui/button";
import { useState } from "react";
import { createComment } from "@/lib/api/posts.api";
import { Spinner } from "../ui/spinner";

interface props {
  post_id: string;
  onSuccessComment: () => void;
}
export default function CommentPostForm(props: props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCommentPostFormData>({
    resolver: zodResolver(createCommentPostSchema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateCommentPostFormData) => {
    setLoading(true);
    try {
      let resp = await createComment(props.post_id, data.content);
      reset();
      props.onSuccessComment();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <form
        className="flex items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input placeholder="comment.." {...register("content")} />
        <Button type="submit" variant="ghost" aria-label="Submit comment">
          {loading ? <Spinner /> : <SendHorizonal />}
        </Button>
      </form>
      {errors.content && (
        <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
      )}
    </div>
  );
}

import { ArrowRight, Image as IconImage } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/hooks/auths/useUser";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createStory } from "@/lib/api/posts.api";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface Props {
  onSuccess: () => void;
}
export default function CreateStoryForm(props: Props) {
  const [imagePost, setImagePost] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [step, setStep] = useState<"getImageStory" | "descriptionStory">(
    "getImageStory",
  );
  const { user } = useUser();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImagePost(acceptedFiles[0]);
    },
  });

  const handleSubmit = async () => {
    if (!imagePost) return;
    setLoading(true);
    try {
      await createStory({ image: imagePost, content: content });
      toast.success("Success");
      props.onSuccess();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div>
      <div className="text-lg flex items-center justify-between p-2">
        <p>Create Post Story</p>

        {imagePost ? (
          <Button
            variant="ghost"
            size={"lg"}
            className="flex items-center space-x-1 text-lg"
            onClick={() =>
              step === "getImageStory"
                ? setStep("descriptionStory")
                : handleSubmit()
            }
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <p>{step === "getImageStory" ? "Next" : "Post Story"}</p>
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        ) : null}
      </div>
      <form
        className={`grid ${step === "getImageStory" ? "" : "grid-cols-12"}`}
      >
        <div
          {...getRootProps()}
          className={`${imagePost ? "aspect-[1] " : "min-h-92"}  place-content-center text-center relative overflow-hidden ${step === "getImageStory" ? "" : "col-span-8"}`}
        >
          {imagePost ? (
            <>
              <Image
                className="rounded object-contain"
                src={URL.createObjectURL(imagePost)}
                fill
                alt="prof"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </>
          ) : (
            <>
              <input {...getInputProps()} />
              <IconImage className="mx-auto mb-1" size={40} />
              <p className="text-lg">Drag and drop image here</p>
            </>
          )}
        </div>
        <div
          className={`${step === "getImageStory" ? "hidden" : "col-span-4 p-5 space-y-2"}`}
        >
          <div className="flex items-center gap-2">
            <Avatar size="lg">
              <AvatarImage
                src={user?.avatarUrl || "/images/person3.avif"}
                alt="post feed"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-lg">{user?.username ?? user?.name}</p>
          </div>
          <Textarea
            placeholder=""
            // {...register("content")}
            // aria-invalid={errors.content ? "true" : "false"}
          />
        </div>
      </form>
    </div>
  );
}

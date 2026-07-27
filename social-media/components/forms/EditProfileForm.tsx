import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileFormData,
  updateProfileSchema,
} from "@/lib/schemas/profile.schema";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { ButtonGroup } from "../ui/button-group";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { updateProfile } from "@/lib/api/profile.api";
import { toast } from "sonner";
import { useUser } from "@/hooks/auths/useUser";
import { Spinner } from "../ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function EditProfileForm() {
  const { user, mutate } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<updateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });
  const [loading, setLoading] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [tagList, setTagList] = useState<any>([]);
  const [tempAddTag, setTempAddTag] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string>("");

  const onSubmit = async (data: updateProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile(data.name, imageUpload, data.description, tagList);

      toast.success("Success", { position: "top-center" });
      mutate();
      setOpenSheet(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const DetectOpen = (open: boolean) => {
    reset({
      name: user?.username ?? user?.name,
      description: user?.bio,
    });
    setImageUpload(null);
    setPreviewImg("");
    if (user?.tag) {
      setTagList(user?.tag);
    }

    setOpenSheet(open);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Sheet onOpenChange={DetectOpen} open={openSheet}>
        <SheetTrigger
          render={<Button variant="outline">Edit Profile</Button>}
        />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
          </SheetHeader>
          <div>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              {/* <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Url profile picture</Label>
                <Input
                  id="sheet-demo-name"
                  aria-invalid={errors.image_url ? "true" : "false"}
                  {...register("image_url")}
                />
                {errors.image_url && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.image_url.message}
                  </p>
                )}
              </div> */}
              <div className="flex items-center gap-5">
                <Avatar size="lg">
                  <AvatarImage
                    src={previewImg || user?.avatarUrl}
                    alt="user profile"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUpload(file);
                    setPreviewImg(URL.createObjectURL(file));
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Username</Label>
                <Input
                  id="sheet-demo-name"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Description</Label>
                <Input
                  id="sheet-demo-username"
                  aria-invalid={errors.description ? "true" : "false"}
                  {...register("description")}
                />{" "}
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="mb-2">Tag</Label>
                <div className="flex flex-wrap gap-2">
                  {tagList?.length === 0 ? (
                    <p className="text-sm">Empty tag</p>
                  ) : (
                    tagList?.map((tag: string, idx: number) => (
                      <ButtonGroup key={idx}>
                        <Button variant="outline">{tag}</Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setTagList((prev: any) =>
                              prev.filter((i: string) => i !== tag),
                            )
                          }
                        >
                          <XIcon />
                        </Button>
                      </ButtonGroup>
                    ))
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Type to and add tag"
                    value={tempAddTag}
                    onChange={(e) => setTempAddTag(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="secondary"
                      onClick={() => {
                        setTagList((prev: any) => [...prev, tempAddTag]);
                        setTempAddTag("");
                      }}
                    >
                      Add Tag
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Save changes"}
            </Button>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </form>
  );
}

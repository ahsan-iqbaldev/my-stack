"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getProfile, updateProfile } from "@/store/slices/profileSlice";
import { toast } from "@/components/ui/use-toast";
// import { updateUser } from "@/lib/actions/user.action";

interface Props {
  clerkId: string;
  profile: any;
}

const Profile = ({ clerkId, profile }: Props) => {
  console.log(profile, "profilebyahsan");
  const type = "";
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userId = clerkId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<any>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState(
    profile?.profileImage
  );

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        userName: profile.userName || "",
        portfolioWebsite: profile.portfolioWebsite || "",
        location: profile.location || "",
        bio: profile.bio || "",
        tags: profile.tags || [],
      });
      // setProfileLoaded(true);
    }
  }, [profile]);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
  });
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setProfileImageFile(file);

    const blobUrl = URL.createObjectURL(file);
    setCurrentProfileImage(blobUrl);
  };

  function onSubmit(values: any) {
    // setIsSubmitting(true);

    console.log(profileImageFile, "profileImageFile");
    if (profileImageFile != null) {
      values.profileImage = profileImageFile;
    } else {
      values.profileImage = currentProfileImage;
    }

    dispatch(
      updateProfile({
        values,
        userId,
        onSuccess: () => {
          dispatch(
            getProfile({
              userId,
            })
          );
          toast({
            title: `Profile updated successfully`,
          });
        },
      })
    );

    // try {
    //   await updateUser({
    //     clerkId,
    //     updateData: {
    //       name: values.name,
    //       username: values.username,
    //       portfolioWebsite: values.portfolioWebsite,
    //       location: values.location,
    //       bio: values.bio,
    //     },
    //     path: pathname,
    //   });

    //   router.back();
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      console.log(tagValue, "tagValue");

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };
  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);

    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className="relative">
            <img
              src={currentProfileImage || profile?.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />

            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
            >
              Change
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div></div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 mb-3">
                Tags
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    // disabled={type === "Edit"}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {field?.value?.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field?.value?.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={
                            () =>
                              // type !== "Edit"
                              //   ?
                              handleTagRemove(tag, field)
                            //   : () => {}
                          }
                        >
                          {tag}
                          {/* {type !== "Edit" && ( */}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="Close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                          {/* )} */}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add 2 tags to describe about you. You need to press enter to add
                a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's special about you?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;

"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
// import { useUser } from "@clerk/nextjs";
// import { handleUser } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        console.log(route, pathname);
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { User } = useSelector((state: any) => state.authentication);
  // const { user } = useUser();

  const [initialized, setInitialized] = useState(false);

  // useEffect(() => {
  //   if (!initialized && !User) {
  //     const userId = user?.id;

  //     if (userId) {
  //       const payload = {
  //         userId: userId,
  //         profileImage: user?.imageUrl,
  //         userName: user?.username,
  //         email: user?.primaryEmailAddress?.emailAddress,
  //         verified: user?.primaryEmailAddress?.verification?.status,
  //       };

  //       dispatch(
  //         handleUser({
  //           payload,
  //           onSuccess: (res: string) => {
  //             toast.success(res);
  //           },
  //         })
  //       );

  //       console.log("User ID:", userId);
  //       console.log("User:", user);

  //       setInitialized(true);
  //     }
  //   }
  // }, [initialized, user, dispatch]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;

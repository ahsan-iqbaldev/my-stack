"use client";
import { Button } from "@/components/ui/button";
import { URLProps } from "@/types";
// import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect } from "react";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswersTab from "@/components/shared/AnswersTab";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getProfile } from "@/store/slices/profileSlice";
import moment from "moment";
// import { auth } from "@clerk/nextjs/server";

const Page = ({ params, searchParams }: URLProps) => {
  const { user } = useSelector((state: any) => state.authentication);
  const { profile } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  if (!user) redirect("/sign-in");

  const userId = user?.userId;
  const userInfo = {
    user: {
      id: "98309483984",
      picture: "/assets/images/logo.png",
      name: "Ahsan Iqbal",
      username: "ahsaniqbal",
      portfolioWebsite: "codebyahsan.pro",
      location: "Islamabad",
      joinedAt: new Date(),
      bio: "Hy I Am Ahsan Iqbal",
      clerkId: "98098340921830981293",
    },
    reputation: 3,
    totalQuestions: 54,
    totalAnswers: 45,
    badgeCounts: {
      GOLD: 2,
      SILVER: 4,
      BRONZE: 5,
    },
  };

  useEffect(() => {
    dispatch(
      getProfile({
        userId,
      })
    );
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={profile?.profileImage}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{profile?.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{profile?.userName}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {profile?.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={profile?.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={profile?.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={moment
                  .unix(profile?.createdAt?.seconds)
                  .format("DD-MMM-YYYY")}
              />
            </div>

            {profile?.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {profile?.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {userId === userId && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Stats
        reputation={userInfo.reputation}
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
      />

      {/* <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo.user.id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo.user.id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div> */}
    </>
  );
};

export default Page;

// import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import RenderTag from "../RenderTag";

interface Props {
  user: {
    id: string;
    profileImage: string;
    name: string;
    userName: string;
    tags: any;
  };
}

const UserCard =  ({ user }: Props) => {
  const interactedTags = [
    { id: "83492809438", name: "Ahsan Iqbal" },
    { id: "93480923840982348", name: "Ahsan" },
  ];

  return (
    <Link
      href={`/profile/${user?.id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user?.profileImage}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user?.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user?.userName}
          </p>
        </div>

        <div className="mt-5">
          {user?.tags?.length > 0 ? (
            <div className="flex items-center gap-2">
              {user?.tags?.map((tag: any, index: any) => (
                <RenderTag key={index} id={index} name={tag} />
              ))}
            </div>
          ) : (
            <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;

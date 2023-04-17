import Image from "next/image";
import Link from "next/link";

const Card = ({ name, img, url }) => {
  return (
    <Link href={url}>
      <div className="bg-zinc-800 p-4 rounded-md max-w-[360px] max-h-[320px]">
        <h1 className="text-2xl text-zinc-300 mb-4">{name}</h1>
        <Image
          src={img}
          alt="img"
          width={320}
          height={260}
          className="object-cover h-[220px]"
        />
      </div>
    </Link>
  );
};

export default Card;

import Link from "next/link";
import Image from "next/image";
import BeerIcon from "@/public/beerIcon.svg";

export default function Header() {
  return (
    <header className="bg-[#2C3E50] text-[#ffffff] h-18  flex items-center justify-center">
      <Link href="/">
        <div className="flex flex-row font-bold text-2xl">
          幹事くん
          <Image src={BeerIcon} alt="beer" height={36} width={36} priority />
        </div>
      </Link>
    </header>
  );
}

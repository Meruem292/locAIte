import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary">
      <Image src="/locaiteLogo.jpg" alt="LocAIte Logo" width={32} height={32} className="h-8 w-8 rounded-full" />
    </Link>
  );
}

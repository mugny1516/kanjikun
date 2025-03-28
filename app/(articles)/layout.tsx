import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ArticlesLayout({ children }: Props) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto my-8 px-4">
        <main>{children}</main>
      </div>
    </div>
  );
}

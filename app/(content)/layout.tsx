import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ContentLayout({ children }: Props) {
  return (
    <div className="max-w-3xl mx-auto my-8 sm:my-12 px-4 sm:px-6 lg:px-8">
      <article>{children}</article>
    </div>
  );
}

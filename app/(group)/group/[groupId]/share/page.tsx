import { CopyButton } from "@/app/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";

export default async function SharePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/group/${groupId}`;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">イベントが作成されました</h1>
      <p className="text-gray-600">
        以下のURLを共有して参加者に出欠入力を依頼しましょう
      </p>

      <div className="flex">
        <Input value={shareUrl} readOnly className="flex-1 rounded-r-none" />
        <CopyButton textToCopy={shareUrl} />
      </div>

      <Button asChild className="w-full ">
        <a href={`/group/${groupId}`}>
          <LinkIcon className="mr-2 h-4 w-4" />
          グループページへ移動
        </a>
      </Button>
    </div>
  );
}

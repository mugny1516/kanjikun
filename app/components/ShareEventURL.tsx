import { Input } from "@/components/ui/input";
import { CopyButton } from "@/app/components/CopyButton";

type ShareEventURLProps = {
  shareUrl: string;
};

export default function ShareEventURL({ shareUrl }: ShareEventURLProps) {
  return (
    <div className="space-y-4">
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="md:text-lg font-semibold">
          このイベントのURLをメンバーに共有する
        </h3>
        <div className="flex mt-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 rounded-r-none bg-white"
          />
          <CopyButton textToCopy={shareUrl} />
        </div>
      </div>
    </div>
  );
}

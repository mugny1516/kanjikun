import { formatDate } from "@/app/lib/utils";

type Props = {
  date: string;
};

export default function PublishedDate({ date }: Props) {
  return <time dateTime={date}>{formatDate(date)}</time>;
}

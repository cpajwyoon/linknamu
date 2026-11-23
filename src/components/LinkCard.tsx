"use client";

import type { LinkItem } from "@/data/profile";

type Props = {
  link: LinkItem;
  count: number;
  onClick: (id: string) => void;
};

export default function LinkCard({ link, count, onClick }: Props) {
  const handleClick = () => onClick(link.id);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onAuxClick={(e) => e.button === 1 && handleClick()}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:translate-y-0 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500"
    >
      <div className="min-w-0">
        <p className="truncate font-semibold text-neutral-900 dark:text-neutral-50">
          {link.title}
        </p>
        {link.description && (
          <p className="mt-0.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
            {link.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="text-xs tabular-nums text-neutral-400 dark:text-neutral-500"
          aria-label={`클릭 ${count}회`}
        >
          {count.toLocaleString("ko-KR")}회
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-500"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </a>
  );
}

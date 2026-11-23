"use client";

import { useCallback, useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { LinkItem } from "@/data/profile";

type Counts = Record<string, number>;

// 클릭 수는 줄어들지 않으므로, 서버 값과 화면 값 중 큰 쪽을 남깁니다.
// (조회 응답이 클릭 직후에 늦게 도착해도 숫자가 뒤로 가지 않음)
function mergeMax(prev: Counts, next: Counts): Counts {
  const merged = { ...prev };
  for (const [id, n] of Object.entries(next)) merged[id] = Math.max(merged[id] ?? 0, n);
  return merged;
}

export default function LinkList({ links }: { links: LinkItem[] }) {
  // 데이터를 받기 전에는 모두 0회로 표시합니다.
  const [counts, setCounts] = useState<Counts>(() =>
    Object.fromEntries(links.map((l) => [l.id, 0])),
  );

  // 페이지가 열리면 모든 링크의 클릭 수를 한 번에 가져옵니다.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clicks", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts?: Counts } | null) => {
        if (data?.counts) setCounts((prev) => mergeMax(prev, data.counts!));
      })
      .catch(() => {}); // 실패하면 0회 그대로 둡니다.
    return () => controller.abort();
  }, []);

  const handleClick = useCallback((id: string) => {
    // 먼저 화면에서 1 올리고(낙관적 업데이트), 서버가 돌려준 실제 값으로 맞춥니다.
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true, // 같은 탭에서 이동해도 요청이 끝까지 전송되도록
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count?: number } | null) => {
        if (typeof data?.count === "number") {
          setCounts((prev) => mergeMax(prev, { [id]: data.count! }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ul className="mt-10 flex flex-col gap-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} count={counts[link.id] ?? 0} onClick={handleClick} />
        </li>
      ))}
    </ul>
  );
}

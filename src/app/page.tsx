import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/data/profile";
import { getClickCounts } from "@/lib/clicks";

// 클릭 수가 항상 최신이도록 요청마다 렌더링합니다.
export const dynamic = "force-dynamic";

async function loadCounts(): Promise<Record<string, number> | null> {
  if (!process.env.MONGODB_URI) return null; // DB 미설정 시 클릭 수 숨김
  try {
    return await getClickCounts(profile.links.map((l) => l.id));
  } catch (err) {
    console.error("클릭 수 조회 실패:", err);
    return null;
  }
}

// 와이어프레임 구성: 원형 프로필 사진 → 이름 → 한 줄 소개 → 링크 카드 세로 목록
export default async function Home() {
  const counts = await loadCounts();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-12 pt-14 sm:pt-20">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* 상단: 프로필 */}
      <ProfileHeader name={profile.name} bio={profile.bio} image={profile.image} />

      {/* 하단: 링크 카드 */}
      <ul className="mt-10 flex flex-col gap-4">
        {profile.links.map((link) => (
          <li key={link.id}>
            <LinkCard link={link} initialCount={counts ? (counts[link.id] ?? 0) : undefined} />
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-12 text-center text-xs text-neutral-400 dark:text-neutral-600">
        🌳 링크나무
      </footer>
    </main>
  );
}

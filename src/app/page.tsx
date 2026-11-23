import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/data/profile";

// 와이어프레임 구성: 원형 프로필 사진 → 이름 → 한 줄 소개 → 링크 카드 세로 목록
export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-12 pt-14 sm:pt-20">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* 상단: 프로필 */}
      <ProfileHeader name={profile.name} bio={profile.bio} image={profile.image} />

      {/* 하단: 링크 카드 (클릭 수는 페이지가 열린 뒤 브라우저에서 한 번에 불러옴) */}
      <LinkList links={profile.links} />

      <footer className="mt-auto pt-12 text-center text-xs text-neutral-400 dark:text-neutral-600">
        🌳 링크나무
      </footer>
    </main>
  );
}

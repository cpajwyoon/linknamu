import { NextResponse } from "next/server";
import { getClickCounts, incrementClick } from "@/lib/clicks";
import { profile } from "@/data/profile";

// 빌드 시점에 GET 응답이 정적으로 굳지 않도록 매 요청마다 실행합니다.
export const dynamic = "force-dynamic";

const validIds = new Set(profile.links.map((l) => l.id));

const noStore = { "Cache-Control": "no-store" };

// 모든 링크의 클릭 수를 한 번에 조회: { counts: { [id]: number } }
export async function GET() {
  try {
    const counts = await getClickCounts([...validIds]);
    if (!counts) {
      return NextResponse.json(
        { error: "MONGODB_URI가 설정되지 않았습니다." },
        { status: 503, headers: noStore },
      );
    }
    return NextResponse.json({ counts }, { headers: noStore });
  } catch (err) {
    console.error("클릭 수 조회 실패:", err);
    return NextResponse.json(
      { error: "클릭 수를 불러오지 못했습니다." },
      { status: 500, headers: noStore },
    );
  }
}

// 링크 클릭 1회 기록: body { id: string } → { count: number }
export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof id !== "string" || !validIds.has(id)) {
    return NextResponse.json({ error: "존재하지 않는 링크입니다." }, { status: 400 });
  }

  try {
    const count = await incrementClick(id);
    if (count === null) {
      return NextResponse.json({ error: "MONGODB_URI가 설정되지 않았습니다." }, { status: 503 });
    }
    return NextResponse.json({ count }, { headers: noStore });
  } catch (err) {
    console.error("클릭 기록 실패:", err);
    return NextResponse.json({ error: "클릭을 기록하지 못했습니다." }, { status: 500 });
  }
}

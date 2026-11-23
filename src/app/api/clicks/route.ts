import { NextResponse } from "next/server";
import { getClickCounts, incrementClick } from "@/lib/clicks";
import { profile } from "@/data/profile";

const validIds = new Set(profile.links.map((l) => l.id));

// 링크별 클릭 수 조회
export async function GET() {
  try {
    const counts = await getClickCounts([...validIds]);
    return NextResponse.json({ counts });
  } catch (err) {
    console.error("클릭 수 조회 실패:", err);
    return NextResponse.json({ error: "클릭 수를 불러오지 못했습니다." }, { status: 500 });
  }
}

// 링크 클릭 1회 기록: body { id: string }
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
    const saved = await incrementClick(id);
    if (!saved) {
      return NextResponse.json({ error: "MONGODB_URI가 설정되지 않았습니다." }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("클릭 기록 실패:", err);
    return NextResponse.json({ error: "클릭을 기록하지 못했습니다." }, { status: 500 });
  }
}

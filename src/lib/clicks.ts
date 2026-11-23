import { getMongoClient } from "@/lib/mongodb";

type ClickDoc = { _id: string; count: number };

const DB_NAME = process.env.MONGODB_DB ?? "linknamu";

async function getCollection() {
  const clientPromise = getMongoClient();
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(DB_NAME).collection<ClickDoc>("clicks");
}

/** 클릭 수를 1 늘리고 늘어난 값을 반환합니다. DB 미설정 시 null. */
export async function incrementClick(linkId: string): Promise<number | null> {
  const col = await getCollection();
  if (!col) return null;
  const doc = await col.findOneAndUpdate(
    { _id: linkId },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return doc?.count ?? 1;
}

/** 여러 링크의 클릭 수를 한 번의 쿼리로 가져옵니다. 기록이 없는 링크는 0. */
export async function getClickCounts(linkIds: string[]): Promise<Record<string, number> | null> {
  const col = await getCollection();
  if (!col) return null;
  const docs = await col.find({ _id: { $in: linkIds } }).toArray();
  const counts: Record<string, number> = Object.fromEntries(linkIds.map((id) => [id, 0]));
  for (const d of docs) counts[d._id] = d.count;
  return counts;
}

import { getMongoClient } from "@/lib/mongodb";

type ClickDoc = { _id: string; count: number };

const DB_NAME = process.env.MONGODB_DB ?? "linknamu";

async function getCollection() {
  const clientPromise = getMongoClient();
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(DB_NAME).collection<ClickDoc>("clicks");
}

export async function incrementClick(linkId: string): Promise<boolean> {
  const col = await getCollection();
  if (!col) return false;
  await col.updateOne({ _id: linkId }, { $inc: { count: 1 } }, { upsert: true });
  return true;
}

export async function getClickCounts(linkIds: string[]): Promise<Record<string, number>> {
  const col = await getCollection();
  if (!col) return {};
  const docs = await col.find({ _id: { $in: linkIds } }).toArray();
  return Object.fromEntries(docs.map((d) => [d._id, d.count]));
}

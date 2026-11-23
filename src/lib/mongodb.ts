import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

// 개발 모드에서 핫 리로드 때마다 연결이 새로 생기지 않도록 전역에 캐시합니다.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

/** MONGODB_URI가 없으면 null을 반환합니다 (클릭 집계 없이도 페이지는 동작). */
export function getMongoClient(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (!globalForMongo._mongoClientPromise) {
    const promise = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect();
    // 연결에 실패하면 캐시를 비워서 다음 요청 때 다시 시도합니다.
    promise.catch(() => {
      if (globalForMongo._mongoClientPromise === promise) {
        globalForMongo._mongoClientPromise = undefined;
      }
    });
    globalForMongo._mongoClientPromise = promise;
  }
  return globalForMongo._mongoClientPromise;
}

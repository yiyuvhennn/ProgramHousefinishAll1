import type { House } from "@/typ/house";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const http = axios.create({
  baseURL,
  timeout: 15000,
});

export async function fetchHouses(): Promise<House[]> {
  const res = await http.get<House[]>("/houses");
  return res.data;
}

export async function fetchHouseBySlug(slug: string): Promise<House | null> {
  const res = await http.get<House[]>("/houses", {
    params: { slug },
  });
  return res.data[0] ?? null;
}

// 搜尋建案
export async function searchHouses(q: string): Promise<House[]> {
  const kw = (q ?? "").trim();
  if (!kw) return fetchHouses();

  const res = await http.get<House[]>("/houses", {
    params: { q: kw },
  });
  return res.data;
}

// 新增建案
export async function createHouse(data: Omit<House, "id">): Promise<House> {
  const res = await http.post<House>("/houses", data);
  return res.data;
}

// 編輯建案
export async function updateHouse(id: number, data: Partial<House>): Promise<House> {
  const res = await http.patch<House>(`/houses/${id}`, data);
  return res.data;
}

// 刪除建案
export async function deleteHouse(id: number): Promise<void> {
  await http.delete(`/houses/${id}`);
}

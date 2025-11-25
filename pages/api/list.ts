import type { NextApiRequest, NextApiResponse } from "next";
import { fetchMockData } from "@/mocks/mock";
import { DemoItem } from "@/interfaces/Demo.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DemoItem[]>
) {
  const delay = Number(req.query.delay) || 300;
  const data = await fetchMockData(delay);
  res.status(200).json(data);
}

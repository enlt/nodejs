import { NextApiRequest, NextApiResponse } from 'next';

// API 路由处理器
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 返回 anime 数据
    res.status(200).json({ message: 'Anime API working!' });
  } else {
    // 不允许的请求方法
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
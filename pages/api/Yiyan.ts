import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 允许跨域请求的中间件
const setCorsHeaders = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// 根据类型获取文本文件的远程 URL
const getTextLink = (type: string): string => {
    const baseUrl = 'https://api.luoh-an.me/storage/json/text/';
    return `${baseUrl}${type}.txt`;
};

// 从远程 URL 获取文件内容，并随机返回一行
const getRandomLine = async (url: string): Promise<string | null> => {
    try {
        const response = await axios.get(url);
        const lines = response.data.split(/\r?\n/).filter((line: string) => line.trim() !== '');
        return lines.length > 0 ? lines[Math.floor(Math.random() * lines.length)] : null;
    } catch (error) {
        console.error('Error fetching remote file:', error);
        return null;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 设置跨域头
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // 对 OPTIONS 请求直接返回 200
    }

    const { t: type } = req.query;

    if (type && typeof type === 'string') {
        const textLink = getTextLink(type);
        const randomLine = await getRandomLine(textLink);

        if (randomLine) {
            res.status(200).send(randomLine);
        } else {
            res.status(400).send("该类型不存在或无法获取数据");
        }
    } else {
        res.status(400).send("参数错误");
    }
}
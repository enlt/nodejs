import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import axios from 'axios';
import { createCanvas, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';
import os from 'os';

// 星座与编号的映射
const zodiacMap: Record<string, string> = {
    "白羊": "1",
    "金牛": "2",
    "双子": "3",
    "巨蟹": "4",
    "狮子": "5",
    "处女": "6",
    "天秤": "7",
    "天蝎": "8",
    "射手": "9",
    "摩羯": "10",
    "水瓶": "11",
    "双鱼": "12"
};

// 自定义 trim 函数
const myTrim = (str: string): string => {
    return str.replace(/\s+/g, '');
};

// 远程加载字体并注册
const loadAndRegisterFont = async () => {
    const FONT_URL = 'https://api.luoh.my.to/storage/ttf/font.ttf';
    const response = await axios.get(FONT_URL, { responseType: 'arraybuffer' });
    const fontBuffer = Buffer.from(response.data);

    const tempFontPath = path.join(os.tmpdir(), 'customFont.ttf');
    fs.writeFileSync(tempFontPath, fontBuffer);

    registerFont(tempFontPath, { family: 'CustomFont' });
};

// 生成图像
const returnImage = (response: Record<string, string>, res: NextApiResponse) => {
    const width = 400;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 绘制背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#000000';
    
    // 绘制文本
    let text = '';
    for (const [key, value] of Object.entries(response)) {
        text += `${key}: ${value}\n`;
    }
    
    // 使用加载的远程字体
    ctx.font = '20px "CustomFont"';
    ctx.fillText(text, 10, 30);

    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer('image/png'));
};

// 主处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const returnType = req.query.return === 'image' ? 'image' : 'json';
    const name = req.query.msg as string || '';
    
    if (!name) {
        const response = { status: '400', message: "抱歉，输入为空。" };
        returnType === 'json' ? res.status(400).json(response) : returnImage(response, res);
        return;
    }

    const cleanedName = name.replace('座', '');
    const zodiacKey = zodiacMap[cleanedName];

    if (!zodiacKey) {
        const response = { status: '400', message: "不存在此类型，请查证后重试。" };
        returnType === 'json' ? res.status(400).json(response) : returnImage(response, res);
        return;
    }

    const horoscopeUrl = `http://cal.meizu.com/android/unauth/horoscope/gethoroscope.do?type=${zodiacKey}&date=${new Date().toISOString().split('T')[0]}&searchType=0`;
    
    try {
        // 为 horoscopeResponse 指定类型
        const horoscopeResponse = await fetch(horoscopeUrl).then(res => res.json()) as {
            direction: string;
            friends: string;
            numbers: string;
            lucklyColor: string;
            contentLove: string;
            contentFortune: string;
            contentCareer: string;
            contentAll: string;
            shorts: string;
        };

        // 加载并注册远程字体
        await loadAndRegisterFont();

        const response = {
            "星座": cleanedName,
            "贵人方位": horoscopeResponse.direction,
            "贵人星座": horoscopeResponse.friends,
            "幸运数字": horoscopeResponse.numbers,
            "幸运颜色": horoscopeResponse.lucklyColor,
            "爱情运势": horoscopeResponse.contentLove,
            "财富运势": horoscopeResponse.contentFortune,
            "事业运势": horoscopeResponse.contentCareer,
            "整体运势": horoscopeResponse.contentAll,
            "提示": horoscopeResponse.shorts
        };

        returnType === 'json' ? res.status(200).json({ status: '200', data: response }) : returnImage(response, res);
    } catch (error) {
        const response = { status: '500', message: "服务端错误" };
        returnType === 'json' ? res.status(500).json(response) : returnImage(response, res);
    }
}
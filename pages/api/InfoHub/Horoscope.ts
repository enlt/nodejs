import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { createCanvas } from 'canvas';

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
    
    ctx.font = '20px Arial';
    ctx.fillText(text, 10, 30);

    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer('image/png'));
};

// 主处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const returnType = req.query.return === 'image' ? 'image' : 'json';
    const name = req.query.msg as string || '';
    
    if (!name) {
        const response = { status: 400, message: "抱歉，输入为空。" };
        returnType === 'json' ? res.status(400).json(response) : returnImage(response, res);
        return;
    }

    const cleanedName = name.replace('座', '');
    const zodiacKey = zodiacMap[cleanedName];

    if (!zodiacKey) {
        const response = { status: 400, message: "不存在此类型，请查证后重试。" };
        returnType === 'json' ? res.status(400).json(response) : returnImage(response, res);
        return;
    }

    const horoscopeUrl = `http://cal.meizu.com/android/unauth/horoscope/gethoroscope.do?type=${zodiacKey}&date=${new Date().toISOString().split('T')[0]}&searchType=0`;
    
    try {
        const response = await fetch(horoscopeUrl);
        const data = await response.text();
        const matches = /{"contentAll":"(.*?)","contentCareer":"(.*?)","contentFortune":"(.*?)","contentHealth":"(.*?)","contentLove":"(.*?)","contentTravel":"(.*?)","date":(.*?),"direction":"(.*?)","enemies":"(.*?)","friends":"(.*?)","horoscopeType":(.*?),"id":(.*?),"lucklyColor":"(.*?)","lucklyTime":"(.*?)","mark":(.*?),"numbers":(.*?),"pointAll":(.*?),"pointCareer":(.*?),"pointFortune":(.*?),"pointHealth":(.*?),"pointLove":(.*?),"pointTravel":(.*?),"shorts":"(.*?)"}/.exec(data);

        if (!matches) {
            const response = { status: 500, message: "抱歉，获取出错。" };
            returnType === 'json' ? res.status(500).json(response) : returnImage(response, res);
            return;
        }

        const horoscopeResponse = {
            "星座": cleanedName,
            "贵人方位": matches[8],
            "贵人星座": matches[10],
            "幸运数字": matches[16],
            "幸运颜色": matches[13],
            "爱情运势": matches[5],
            "财富运势": matches[3],
            "事业运势": matches[2],
            "整体运势": matches[1],
            "提示": matches[23]
        };

        returnType === 'json' ? res.status(200).json({ status: 200, data: horoscopeResponse }) : returnImage(horoscopeResponse, res);
    } catch (error) {
        const response = { status: 500, message: "服务端错误" };
        returnType === 'json' ? res.status(500).json(response) : returnImage(response, res);
    }
}
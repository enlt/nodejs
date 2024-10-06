import { NextApiRequest, NextApiResponse } from 'next';

// 获取 JSON 链接
const getJsonLink = (): string => {
    return 'https://api.luoh.my.to/storage/json/image/other/.json';
};

// 获取图片链接
const getImageLink = (value: string): string => {
    return `https://new-api-1.pages.dev/image/other/${value}`;
};

// 获取图片 MIME 类型
const getMimeType = (imageName: string): string => {
    const extension = imageName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        webp: 'image/webp',
        png: 'image/png',
        jpg: 'image/jpg',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
};

// 处理错误响应
const handleError = (res: NextApiResponse, status: number, message: string) => {
    return res.status(status).json({
        status: status.toString(),
        error: message,
    });
};

// 主处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const returnType = req.query.r as string || 'image';

    const jsonLink = getJsonLink();

    let jsonData: string;
    try {
        const response = await fetch(jsonLink);
        if (!response.ok) throw new Error('远程获取失败');
        jsonData = await response.text();
    } catch {
        return handleError(res, 404, '未找到指定类型的 JSON 数据');
    }

    let imageList: string[];
    try {
        imageList = JSON.parse(jsonData);
    } catch {
        return handleError(res, 500, '服务端错误：无法解析 JSON 数据');
    }

    if (!Array.isArray(imageList) || imageList.length === 0) {
        return handleError(res, 500, '远程获取值失败：无可用数据');
    }

    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    const imageUrl = getImageLink(randomImage);

    if (returnType === 'json') {
        return res.status(200).json({ status: '200', url: imageUrl });
    } else if (returnType === 'image') {
        try {
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) throw new Error('服务端错误，无法获取图片');
            const buffer = await imageResponse.buffer();
            const mimeType = getMimeType(randomImage);
            res.setHeader('Content-Type', mimeType);
            return res.send(buffer);
        } catch {
            return handleError(res, 500, '服务端错误：无法获取图片');
        }
    } else {
        return handleError(res, 400, '参数错误：无效的返回类型');
    }
}
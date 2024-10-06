import { NextApiRequest, NextApiResponse } from 'next';

const getMimeType = (extension: string): string => {
    const mimeTypes: { [key: string]: string } = {
        webp: 'image/webp',
        png: 'image/png',
        jpg: 'image/jpg',
    };
    return mimeTypes[extension] || 'application/octet-stream';
};

const getJsonLink = (): string => {
    return 'https://api.luoh.my.to/storage/json/image/other/.json';
};

const getImageLink = (value: string): string => {
    return `https://new-api-1.pages.dev/image/other/${value}`;
};

const handleError = (res: NextApiResponse, message: string): void => {
    res.status(400).json({ status: '400', url: message });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const returnType = req.query.r as string || 'image';

    const jsonLink = getJsonLink();

    let jsonData;
    try {
        const response = await fetch(jsonLink);
        if (!response.ok) {
            throw new Error("远程获取失败");
        }
        jsonData = await response.json();
    } catch {
        return handleError(res, "远程获取失败");
    }

    if (!Array.isArray(jsonData)) {
        return handleError(res, "服务端错误");
    }

    const randomImage = jsonData[Math.floor(Math.random() * jsonData.length)];
    const imageUrl = getImageLink(randomImage);

    if (returnType === 'json') {
        res.status(200).json({ status: 200, url: imageUrl });
    } else if (returnType === 'image') {
        try {
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
                throw new Error("服务端错误");
            }
            const imageContent = await imageResponse.buffer();
            const extension = randomImage.split('.').pop() || '';
            const mimeType = getMimeType(extension);
            res.setHeader('Content-Type', mimeType);
            return res.send(imageContent);
        } catch {
            return handleError(res, "服务端错误");
        }
    } else {
        return handleError(res, "参数错误");
    }
}
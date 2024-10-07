import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// 获取 JSON 链接
const getJsonLink = (type: string): string => {
  const baseUrl = 'https://api.luoh-an.me/storage/json/image/emoticon/';
  return `${baseUrl}${type}/.json`;
};

// 获取图片链接
const getImageLink = (type: string, value: string): string => {
  const baseUrl = 'https://new-api-1.pages.dev/image/emoticon/';
  return `${baseUrl}${type}/${value}`;
};

// 从 JSON 内容中随机获取值
const getRandomValueFromJson = (jsonContent: string): string | null => {
  const values = JSON.parse(jsonContent);
  return Array.isArray(values) && values.length > 0 
    ? values[Math.floor(Math.random() * values.length)]
    : null;
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
  const type = req.query.t as string;
  const returnType = (req.query.r as string) || 'image';

  if (!type || !returnType) {
    return handleError(res, 400, '参数错误：缺少必要参数');
  }

  const jsonLink = getJsonLink(type);
  
  let jsonContent: string;
  try {
    const response = await fetch(jsonLink);
    if (!response.ok) throw new Error('请求失败，无法获取 JSON 数据');
    jsonContent = await response.text();
  } catch (error) {
    return handleError(res, 404, '未找到指定类型的 JSON 数据');
  }

  const randomValue = getRandomValueFromJson(jsonContent);
  if (!randomValue) {
    return handleError(res, 500, '远程获取值失败：无可用数据');
  }

  const imageLink = getImageLink(type, randomValue);

  if (returnType === 'image') {
    try {
      const imageResponse = await fetch(imageLink);
      if (!imageResponse.ok) throw new Error('服务端错误，无法获取图片');
      const buffer = await imageResponse.buffer();
      const mimeType = getMimeType(randomValue);
      res.setHeader('Content-Type', mimeType);
      return res.send(buffer);
    } catch (error) {
      return handleError(res, 500, '服务端错误：无法获取图片');
    }
  } else if (returnType === 'json') {
    return res.status(200).json({ status: '200', url: imageLink });
  } else {
    return handleError(res, 400, '参数错误：无效的返回类型');
  }
}
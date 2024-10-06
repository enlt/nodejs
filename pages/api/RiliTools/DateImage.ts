import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { createCanvas, loadImage, registerFont } from 'canvas';
import os from 'os';
import type { NextApiRequest, NextApiResponse } from 'next';

// 使用远程字体的 URL
const FONT_URL = 'https://api.luoh.my.to/storage/ttf/font.ttf';
const IMAGE_DIR = path.join(__dirname, '../../storage/daysign/images');

// 调整图像尺寸
async function resizeImage(imagePath: string, newWidth: number, newHeight: number): Promise<string> {
    const newImagePath = imagePath.replace(/(\.[\w\d]+)$/, '_resized$1'); // 生成新的图片路径

    await sharp(imagePath)
        .resize(newWidth, newHeight)
        .toFile(newImagePath);

    return newImagePath;
}

// 在图片上添加文字
async function addTextToImage(imagePath: string, textParams: Array<{ text: string, size: number, position: string, positionsite: number, x_offset: number, color: number[] }>) {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // 绘制图片
    ctx.drawImage(image, 0, 0);

    // 加载并使用远程字体
    const fontData = await axios.get(FONT_URL, { responseType: 'arraybuffer' });
    const fontBuffer = Buffer.from(fontData.data);

    // 保存缓冲区为临时字体文件
    const tempFontPath = path.join(os.tmpdir(), 'customFont.ttf');
    fs.writeFileSync(tempFontPath, fontBuffer);
    registerFont(tempFontPath, { family: 'CustomFont' });

    textParams.forEach(textParam => {
        const { text, size, position, positionsite, x_offset, color } = textParam;

        // 设置字体
        ctx.font = `${size}px "CustomFont"`;
        ctx.fillStyle = `rgb(${color.join(',')})`;

        const textWidth = ctx.measureText(text).width;
        let x: number;

        if (x_offset < 0) {
            x = -x_offset;
        } else if (x_offset > 0) {
            x = image.width - textWidth - x_offset;
        } else {
            x = (image.width - textWidth) / 2;
        }

        let y: number;
        switch (position) {
            case 'top':
                y = positionsite;
                break;
            case 'middle':
                y = (image.height / 2) + (size / 2);
                break;
            case 'bottom':
            default:
                y = image.height - positionsite;
                break;
        }

        ctx.fillText(text, x, y);
    });

    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(imagePath, buffer);
}

// cURL 请求获取日期信息
async function curlGetRequest(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
}

// 默认导出 API 路由处理函数
export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const day = await curlGetRequest("https://api.luoh.my.to/New/RiliTools/DateInfo/");
        const textParams = [
            {
                text: day.dateD,
                size: 180,
                position: 'bottom',
                positionsite: 600,
                x_offset: -80,
                color: [255, 255, 255]
            },
            {
                text: `${day.dateMC}月 ${day.dateY}`,
                size: 50,
                position: 'bottom',
                positionsite: 590,
                x_offset: -80,
                color: [255, 255, 255]
            },
            {
                text: day.hseb,
                size: 50,
                position: 'bottom',
                positionsite: 510,
                x_offset: -80,
                color: [255, 255, 255]
            }
        ];

        const text = day.text.length > 21 ? [
            { text: day.text.substring(0, 21), size: 35, position: 'bottom', positionsite: 300, x_offset: -80, color: [255, 255, 255] },
            { text: day.text.substring(21), size: 35, position: 'bottom', positionsite: 250, x_offset: -30, color: [255, 255, 255] }
        ] : [
            { text: day.text, size: 35, position: 'bottom', positionsite: 300, x_offset: -80, color: [255, 255, 255] }
        ];

        const allTextParams = [...textParams, ...text];

        const images = fs.readdirSync(IMAGE_DIR).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        const randomImage = path.join(IMAGE_DIR, images[Math.floor(Math.random() * images.length)]);
        const resizedImagePath = await resizeImage(randomImage, 1080, 1277);
        await addTextToImage(resizedImagePath, allTextParams);

        // 返回成功响应
        res.status(200).json({ message: 'Image created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the image.' });
    }
};
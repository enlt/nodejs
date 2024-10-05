const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const getJsonLink = (type) => {
    const baseUrl = 'https://api.luoh.my.to/storage/json/image/ecy/';
    return `${baseUrl}${type}/.json`;
};

const getImageLink = (type, value) => {
    const baseUrl = 'https://new-api-2.pages.dev/image/ecy/';
    return `${baseUrl}${type}/${value}`;
};

const getRandomValueFromJson = (jsonContent) => {
    const values = JSON.parse(jsonContent);
    if (Array.isArray(values) && values.length > 0) {
        return values[Math.floor(Math.random() * values.length)];
    }
    return null;
};

const getMimeType = (imageName) => {
    const extension = path.extname(imageName).toLowerCase();
    const mimeTypes = {
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpg'
    };
    return mimeTypes[extension] || 'application/octet-stream';
};

const handleError = (res, message) => {
    res.status(400).json({
        status: '400',
        url: message
    });
};

app.get('/', async (req, res) => {
    const type = req.query.t;
    const returnType = req.query.r || 'image';

    if (!type || !returnType) {
        return handleError(res, "参数错误");
    }

    try {
        const jsonLink = getJsonLink(type);
        const jsonResponse = await axios.get(jsonLink);
        const randomValue = getRandomValueFromJson(JSON.stringify(jsonResponse.data));

        if (!randomValue) {
            return handleError(res, "远程获取值失败");
        }

        const imageLink = getImageLink(type, randomValue);

        if (returnType === 'image') {
            const imageResponse = await axios.get(imageLink, { responseType: 'arraybuffer' });
            const mimeType = getMimeType(randomValue);
            res.setHeader('Content-Type', mimeType);
            res.send(imageResponse.data);
        } else if (returnType === 'json') {
            res.json({
                status: '200',
                url: imageLink
            });
        } else {
            return handleError(res, "参数错误");
        }
    } catch (error) {
        return handleError(res, "此类型不存在或服务端错误");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
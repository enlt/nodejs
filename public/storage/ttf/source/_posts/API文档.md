---
abbrlink: 5a8a6c8d
ai:
- 本教程介绍了如何在博客中安装基于Hexo主题的安知鱼主题，并提供了安装、应用主题、修改配置文件、本地启动等详细步骤及技术支持方式。教程的内容针对最新的主题版本进行更新，如果你是旧版本教程会有出入。
categories: []
cover: https://pic.chino.my.to/i/2024/08/23/460580.webp
date: '2024-07-31T11:25:00+08:00'
tags:
- api
title: API文档
updated: '2024-08-23T09:45:36.982+08:00'
---
# 1.前言

本文是对于[luohAPI](https://api.luoh.my.to/New)的文档介绍，便于更方便的使用

---

# 2.介绍

## 2.1 InfoHub

### 2.1.1 HistoryToday

{% folding blue open, 历史上的今天 %}
**接口地址**  <span id="HistoryToday" onclick="CopyApiLink()">`https://api.luoh.my.to/New/InfoHub/HistoryToday/`</span> <br>
**请求方法** `GET` <br>
**请求参数说明**

|  名称  | 必填 |  类型  |                                                                 说明                                                                 |
| :----: | :--: | :----: | :-----------------------------------------------------------------------------------------------------------------------------------: |
|  date  |  否  | string | `{month}{day}` <br> 例如 `1010` 及表示 `十月十日`的历史 <br> `0101` 即表示 `一月一日` 的历史 <br> 不填写时默认为今日日期 |

<br>

**返回示例**

```json
{
    "year": "1731",
    "title": "英国化学家和物理学家 卡文迪许 出生",
    "festival": "辛亥革命纪念日",
    "type": "诞生",
    "desc": "卡文迪许是英国化学家和物理学家。他出生贵族，继承了叔伯和父亲的遗产后成为英国巨富之一。但他生活简朴，全心投身于科学研究，在物理化学领域获得了杰出成就，硝酸就是他发现的。",
    "cover": true,
    "recommed": true,
    "pic_caledar": "http://baike.bdimg.com/cms/rc/r/image/2014-08-31/c83fa196d6f0d95fbd1292d0ecd11e22_80_80.jpg",
    "pic_share": "http://baike.bdimg.com/cms/rc/r/image/2014-08-31/a04b2298b06e097a216d053b888c10fe_360_212.jpg",
    "pic_idex": "http://baike.bdimg.com/cms/rc/r/image/2014-08-31/23c0660eb476f5e8ac614f9dea4a048c_134_100.jpg",
    "baike": "http://baike.baidu.com/subview/19638/14698117.htm"
}
```

<br>

**返回参数说明**
| 名称 | 类型 | 说明 |
| :-: | :-: | :-: |
| year | string | 年份 |
| title | string | 该历史精简概括 |
| festival | string | 节日 |
| type | string | 历史类型 |
| desc | string | 详细介绍 |
| cover | boolean | 是否有图片 |
| recommed | boolean | 是否推荐 |
| baike | string | 百科链接 |

<br>

**请求示例** <span id="HistoryToday" onclick="CopyApiLink()">`https://api.luoh.my.to/New/InfoHub/HistoryToday/`</span> <br>

 {% endfolding %}













<!--
{% folding blue open, 历史上的今天 %}
**接口地址**  <span id="HistoryToday" onclick="CopyApiLink()">`https://api.luoh.my.to/New/InfoHub/HistoryToday/`</span> <br>
**请求方法** `GET` <br>
**返回格式** `image` `json` <br>
**请求参数说明**

|  名称  | 必填 |  类型  |                                                                 说明                                                                 |
| :----: | :--: | :----: | :-----------------------------------------------------------------------------------------------------------------------------------: |
|  type  |  是  | string | 需要获取的图片类型 可选为:<br> `first` `second` `third` `genshin` `mobile` <br> 其中后二者为 <br> `原神类` `手机尺寸类` |
| return |  否  | string |                                             指定返回类型，可选为:<br> `image` `json`                                             |

<br>

**返回示例**

```json
直接返回图片
----------
{ "status": "200", "imageurl": "https://i1.wp.com/new-api-2.pages.dev/image/ecy/anime/first/7d7494e0413c29f5.webp" }
```

<br>

**返回参数说明**

|   名称   |  类型  |                      | 说明 |
| :------: | :----: | :------------------: | :--: |
|  status  | string |        状态码        |      |
| imageurl | string | 图片链接 或 错误信息 |      |

<br>

**请求示例** <span id="animePHPE" onclick="CopyApiLink()">`https://api.luoh.my.to/anime.php?type=first&return=image`</span> <br>
![anime.webp](https://api.luoh.my.to/anime.php?type=first&return=image)

 {% endfolding %}

---

### 头像

{% folding cyan, 获取随机的头像类图片 %}
**接口地址**  <span id="avatarPHP" onclick="CopyApiLink()">`https://api.luoh.my.to/avatar.php`</span> <br>
**请求方法** `GET` <br>
**返回格式** `image` `json` <br>
**请求参数说明**

|  名称  | 必填 |  类型  |                                                                  说明                                                                  |
| :----: | :--: | :----: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|  type  |  是  | string | 需要获取的图片类型 可选为:<br> `dm` `gf` `kt` `ka` `random` <br> 其分别对应 <br> `动漫` `古风` `卡通` `可爱` `随机` |
| return |  否  | string |                                              指定返回类型，可选为:<br> `image` `json`                                              |

<br>

**返回示例**

```json
直接返回图片
----------
{ "status": "200", "imageurl": "https://i1.wp.com/new-api-2.pages.dev/二次元/avatar/dongman/90d635bd248701e4.webp" }
```

<br>

**返回参数说明**

|   名称   | 类型 |        |   说明   |
| :------: | :--: | :----: | :------: |
|  status  |  是  | string |  状态码  |
| imageurl |  是  | string | 图片链接 |

<br>

**请求示例** <span id="avatarPHPE" onclick="CopyApiLink()">`https://api.luoh.my.to/avatar.php?type=dm&return=image`</span> <br>
![avatar.webp](https://api.luoh.my.to/avatar.php?type=dm&return=image)

 {% endfolding %}

---

### 三次元

{% folding green, 获取随机的三次元类图片 %}
**接口地址**  <span id="scyPHP" onclick="CopyApiLink()">`https://api.luoh.my.to/scy.php`</span> <br>
**请求方法** `GET` <br>
**返回格式** `image` `json` <br>
**请求参数说明**

|  名称  | 必填 |  类型  |                                      说明                                      |
| :----: | :--: | :----: | :-----------------------------------------------------------------------------: |
|  type  |  是  | string | 需要获取的图片类型 可选为<br> `cat` `fj` <br> 其分别为 <br> `猫` `风景` |
| return |  否  | string |                  指定返回类型，可选为:<br> `image` `json`                  |

<br>

**返回示例**

```json
直接返回图片
----------
{ "status": 200, "imageurl": "https://i1.wp.com/new-api-1.pages.dev/image/三次元/cat/ea78b37bce6ac049.png" }
```

<br>

**返回参数说明**

|   名称   | 类型 |        |   说明   |
| :------: | :--: | :----: | :------: |
|  status  |  是  | string |  状态码  |
| imageurl |  是  | string | 图片链接 |

<br>

**请求示例** <span id="scyPHPE" onclick="CopyApiLink()">`https://api.luoh.my.to/scy.php?type=cat&return=image`</span> <br>
![cat.webp](https://api.luoh.my.to/scy.php?type=cat&return=image)

 {% endfolding %}

---

### 表情包

{% folding yellow, 获取随机的表情包类图片 %}
**接口地址**  <span id="emoticonPHP" onclick="CopyApiLink()">`https://api.luoh.my.to/emoticon.php`</span> <br>
**请求方法** `GET` <br>
**返回格式** `image` `json` <br>
**请求参数说明**

|  名称  | 必填 |  类型  |                                                                                                                                                       说明                                                                                                                                                       |
| :----: | :--: | :----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  type  |  是  | string | 需要获取的图片类型 可选为：<br> `scymm` `ecybqb` `sej` `sxly` `sxlyhb` `cjm` `hj` `xmt` `mmckb` `gcmm` `lx` `lt` <br> 其分别为 <br> `三次元猫猫` `二次元表情包` `兽耳酱` `塞西莉娅` `塞西莉娅黑白` `柴郡猫` `滑稽` `熊猫头` `猫猫虫咖波` `甘城猫猫` `罗翔` `龙图` |
| return |  是  | string |                                                                                                                                   指定返回类型，可选为:<br> `image` `json`                                                                                                                                   |

<br>

**返回示例**

```json
直接返回图片
----------
{ "status": "200", "imageurl": "https://i1.wp.com/new-api-1.pages.dev/image/bqb/cjm/12ab959dfb54797b.png" }
```

<br>

**返回参数说明**

|   名称   | 类型 |        |   说明   |
| :------: | :--: | :----: | :------: |
|  status  |  是  | string |  状态码  |
| imageurl |  是  | string | 图片链接 |

<br>

**请求示例** <span id="emoticonPHPE" onclick="CopyApiLink()">`https://api.luoh.my.to/emoticon.php?type=cjm&return=image`</span> <br>
![emoticon.webp](https://api.luoh.my.to/emoticon.php?type=cjm&return=image)

 {% endfolding %}
-->

<script>
function CopyApiLink() {
    var element = event.target;
    var textarea = document.createElement('textarea');
    textarea.value = element.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
</script>

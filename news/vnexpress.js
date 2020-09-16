const Parser = require('rss-parser');
const fetch = require('node-fetch');

function getStr(str, start, end) {
    if(!str) return  null;

    let regex = start + "([\\s\\S]*?)" + end;
    let match = str.match(regex);

    return match ? match[1] : null
}

function getAllStr(str, start, end) {
    if(!str) return  null;

    let regex = new RegExp(start + '([\\s\\S]*?)' + end, 'g');
    let match = str.match(regex);

    if (match) {
        return match;
    }

    return null;
}

function VnExpress() {
    let linkRSSs = [
        "https://vnexpress.net/rss/the-gioi.rss",
        "https://vnexpress.net/rss/thoi-su.rss",
        "https://vnexpress.net/rss/kinh-doanh.rss",
        "https://vnexpress.net/rss/giai-tri.rss",
        "https://vnexpress.net/rss/the-thao.rss",
        "https://vnexpress.net/rss/phap-luat.rss",
        "https://vnexpress.net/rss/giao-duc.rss",
        "https://vnexpress.net/rss/suc-khoe.rss",
        "https://vnexpress.net/rss/khoa-hoc.rss",
        "https://vnexpress.net/rss/so-hoa.rss",
        "https://vnexpress.net/rss/oto-xe-may.rss"
    ];
    const random = Math.floor(Math.random() * linkRSSs.length);
    const linkRSS = linkRSSs[random];
    const minLength = 500;
    const maxLength = 1500;

    this.get = async() => {
        let parser = new Parser();
        let feed = await parser.parseURL(linkRSS);
        let news = [];
        for (const rss of feed.items) {
            if(rss.link.includes('https://vnexpress.net')) { //not get news from english/photo page
                let imgLink = getStr(rss.content, '<img src="','"');
                if (imgLink && !imgLink.includes('gif')) {
                    let description = getStr(rss.content, '</a></br>', ']');
                    let response = await fetch(rss.link);
                    let content = await response.text();
                    let article = getStr(content, '<article', '</article');
                    let caption = getDescription(article);
                    let category = getCategory(linkRSS);
                    if (description) {
                        //description = description.replace(`  `,' ');
                        news.push({
                            title: rss.title,
                            img: imgLink,
                            description: description,
                            caption: caption,
                            category: category,
                        });
                    }
                }


            }
        }

        return news;
    };

    const getDescription = (content) => {
        let descriptions = getAllStr(content, '<p', '</p>');

        if (!descriptions) return null;
        let descReturn = '';
        let currentlength = 0;
        for(const description of descriptions) {
            let desc = description.replace(/(<([^>]+)>)/ig,"");
            let length = desc.length;
            if (length >= minLength && !description.includes('videoplayer') && !description.includes('image')) {
                if (length + currentlength < maxLength) {
                    descReturn += `${desc} `;
                    currentlength += length;
                } else {
                    break;
                }
            }
        }

        return descReturn ? descReturn.replace(/>/,'') : null;
    }

    const getCategory = (url) => {
        let c = getStr(url, 'https://vnexpress.net/rss/', '.rss');
        switch(c){
            case "the-gioi":
            cate = "BẢNG TIN THẾ GIỚI";
                break;
            case "thoi-su":
            cate = "BẢNG TIN THỜI SỰ";
                break;
            case "kinh-doanh":
            cate = "BẢNG TIN KINH DOANH";
                break;
            case "giai-tri":
            cate = "BẢNG TIN GIẢI TRÍ";
                break;
            case "the-thao":
            cate = "BẢNG TIN THỂ THAO";
                break;
            case "suc-khoe":
            cate = "BẢNG TIN SỨC KHỎE";
                break;
            case "phap-luat":
            cate = "BẢNG TIN PHÁP LUẬT";
                break;
            case "the-thao":
            cate = "BẢNG TIN THỂ THAO";
                break;
            case "giao-duc":
            cate = "BẢNG TIN GIÁO DỤC";
                break;
            case "khoa-hoc":
            cate = "BẢNG TIN KHOA HỌC";
                break;
            case "so-hoa":
            cate = "BẢNG TIN SỐ HÓA";
                break;
            case "oto-xe-may":
            cate = "BẢNG TIN ÔTÔ XE MÁY";
                break;
            default:
                break;
        }
    }
    return cate;
}

module.exports = VnExpress;

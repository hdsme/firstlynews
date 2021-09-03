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
function getCategory(url){
        
    let c = getStr(url, 'https://vnexpress.net/rss/', '.rss');
    let cate;
    switch(c){
        case "the-gioi":
        cate = "BẢN TIN THẾ GIỚI";
            break;
        case "thoi-su":
        cate = "BẢN TIN THỜI SỰ";
            break;
        case "kinh-doanh":
        cate = "BẢN TIN KINH DOANH";
            break;
        case "giai-tri":
        cate = "BẢN TIN GIẢI TRÍ";
            break;
        case "the-thao":
        cate = "BẢN TIN THỂ THAO";
            break;
        case "suc-khoe":
        cate = "BẢN TIN SỨC KHỎE";
            break;
        case "phap-luat":
        cate = "BẢN TIN PHÁP LUẬT";
            break;
        case "the-thao":
        cate = "BẢN TIN THỂ THAO";
            break;
        case "giao-duc":
        cate = "BẢN TIN GIÁO DỤC";
            break;
        case "khoa-hoc":
        cate = "BẢN TIN KHOA HỌC";
            break;
        case "so-hoa":
        cate = "BẢN TIN SỐ HÓA";
            break;
        case "oto-xe-may":
        cate = "BẢN TIN ÔTÔ XE MÁY";
            break;
        default:
            break;
    }
    return cate;
}

function VnExpress() {
    const linkRSSs = [
        "https://vnexpress.net/rss/the-gioi.rss",
        "https://vnexpress.net/rss/thoi-su.rss",
        //"https://vnexpress.net/rss/kinh-doanh.rss",
        //"https://vnexpress.net/rss/giai-tri.rss",
        //"https://vnexpress.net/rss/the-thao.rss",
        "https://vnexpress.net/rss/phap-luat.rss",
        "https://vnexpress.net/rss/giao-duc.rss",
        "https://vnexpress.net/rss/suc-khoe.rss",
        "https://vnexpress.net/rss/khoa-hoc.rss",
        //"https://vnexpress.net/rss/so-hoa.rss",
        "https://vnexpress.net/rss/oto-xe-may.rss"
    ];
    let random = Math.floor(Math.random() * linkRSSs.length);
    const linkRSS = linkRSSs[random];
    console.log(linkRSS);
    //const linkRSS = 'https://vnexpress.net/rss/tin-moi-nhat.rss';
    const category = getCategory(linkRSS);
    console.log(category);
    const minWord =50;
    const maxWord = 350;

    this.get = async() => {
        let parser = new Parser();
        let feed = await parser.parseURL(linkRSS);
        let news = [];
        for (const rss of feed.items) {

            if(rss.link.includes('https://vnexpress.net')) { //not get news from english/photo page
                let imgLink = getStr(rss.content, '<img src="','"');
                let title = (rss.content).split('></a></br>')[1];
                    
                    //console.log('1' + title);
                    //console.log('1' + imgLink);
                if (imgLink && title && category && !imgLink.includes('gif')) {
                    title = title.trim();
                    //console.log(title);
                    //console.log(imgLink);
                    let response = await fetch(rss.link);
                    let content = await response.text();
                    let article = getStr(content, '<article', '</article');
                    let description = getDescription(article);
                    if (description) {
                        description = description.replace(`  `,' ');
                        description = description.replace('\n','');
                        news.push({
                            category: category,
                            title: title,
                            img: imgLink,
                            description: description,
                        });
                       
                       console.log(news.length);
                        break;
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
        let currentNumWord = 0;
        for(const description of descriptions) {
            let desc = description.replace(/(<([^>]+)>)/ig,"");
            let numWord = desc.split(' ').length;
            if (numWord >= minWord && !description.includes('videoplayer') && !description.includes('image')) {
                if (numWord + currentNumWord < maxWord) {
                    descReturn += `${desc} `;
                    currentNumWord += numWord;
                } else {
                    break;
                }
            }
        }

        return descReturn ? descReturn.replace(/>/,'') : null;
    }
}

module.exports = VnExpress;

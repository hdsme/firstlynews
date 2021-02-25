require('dotenv').config();
const CreateImage = require('./create-image');
const VnExpress = require('./news/vnexpress');
const Facebook = require('./facebook');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const generator = async () => {
    let vnExpress = new VnExpress();
    let news = await vnExpress.get();

    let createImage = new CreateImage();
    let images = [];
    let random = Math.floor(Math.random() * news.length);
    let feed = news[0];
    let hashtags= ["#tríchdẫn #thanhxuan #buồn #tâmtrang #buon #tinhyêu #yêuthuong #nhớ #thanhxuân #trichdanhay #trichdan #trichdanphim #yêu #congai #tamtrang #suutâm #ngôntình #ngontinh #ngontinhquotes #donphuong #codon #tinhyeu #buon #vietquote #vietquotes #saigon #hanoi #hanoifood #saigonfood","#huonggiang #chipu #tranthanh #phodibo #phuonglyharuharu #hoaminzy #topcomments #vui #vuivẻ #hàihước #haihuoc #anhhai #ảnhchế #buoncuoi #giaitri #anhche #tríchdẫn #nhớ #quotevietnam #tamsu #vuive #trichdansach #buồn #tríchdẫnhay #chiatay #yêuthuong #độcthânvuitính #docthanvuitinhlaemhai #buon #cuoi","#haivl #cuoiia #cười #hài #meme #cuoichamchovui #anhthe #ảnhthẻ #anhdaden #anhdađen #hocsinh #cap3 #suutam #tinhyeu #thanhxuan #congai #bua #sinhvien #badao #giảitrí #buồncười #anhdavang #hàihước #buồncười #videohay #videongontinh #tinhcam #camdong #ngôntìnhtrungquốc #quotes","#nguoiloncodon #ngontinhquotes #ngôntìnhtrungquốc #nhớ #itaewonclass #goodmorning #tríchdẫnhay #tuổitrẻ #thờithanhxuân #truyệnngôntình #chungtacuasaunay","#tiktokmoi #tiktokchina #tiktokngontinh #ngontinh #langman #ýnghĩa #chuyencuachungminhne #chuyenchungminh #chuyenhomnay #chuyencuatui #trichdanhay #missyouguys #chuyện #nắng #quotestonghop #quotestoliveby #quotesvn #tâmtrạng #buồn #sadstory",];
    let indexhash = Math.floor(Math.random() * hashtags.length);
    let hashtag = hashtags[indexhash];
    let message = (feed.description) + "\n" + hashtag;
    console.log(message);
    console.log(feed.title);
    //for (const feed of news) {
        images.push(await createImage.create(feed.img, feed.category, feed.title));
    console.log(images);
    //    break;
    //}

    let facebook = new Facebook(process.env.ACCESS_TOKEN, process.env.GROUP_ID);

    if (process.env.PAGE_ID) {
        facebook.postAsPage(process.env.PAGE_ID)
    }
    facebook.postNews(images,message);

};

app.use((req, res, next) => {
    //BASIC AUTHENTICATION
    const auth = {login: process.env.BASIC_USER, password: process.env.BASIC_PASSWORD};

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next()
    }
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

app.get('/fb-news', (req, res) => {
    generator(); //no need wait done and no need return anything
    res.send('Hello Facebook!!!')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

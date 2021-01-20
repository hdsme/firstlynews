const { createCanvas, loadImage } = require('canvas');

function CreateImage() {
    const MAX_WIDTH_CANVAS = 1080; // Width = 1080px
    const POST_TYPE = Math.floor(Math.random() * 2); // 2 type post
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';

        for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);

        return y;
    }

    this.create = async (imgLink, title, description) => {
        const background = await loadImage('background.png');
        const canvasSource = [];
        const margin = 20;
        const spaceBetweenCanvas = margin * 2 * 3; //marginTop and marginBottom 10px x 3 canvas
        let imageCanvas = await createImageCanvas(imgLink);
        let descriptionCanvas = await createDescriptionCanvas(description);

        let titleCanvas = createTitleCanvas(title);

        canvasSource.push(imageCanvas);
        canvasSource.push(titleCanvas);
        canvasSource.push(descriptionCanvas);

        let maxWidth = 0;
        let height = 0;

        canvasSource.map(item => {
            if (maxWidth < item.width) maxWidth = item.width;
            height += item.height;
        });

        //const canvas = createCanvas(maxWidth, height + spaceBetweenCanvas);
        const canvas = createCanvas(MAX_WIDTH_CANVAS,MAX_WIDTH_CANVAS);
        const ctx = canvas.getContext('2d');
        switch(POST_TYPE){
            case 0:
                        ctx.drawImage(background, 0, 0, background.width, background.height);
                        ctx.drawImage(imageCanvas.canvas, 0, 0, imageCanvas.canvas.width, imageCanvas.canvas.height);
                break;
           
            case 1:
                        ctx.drawImage(background, 0, 0, background.width, background.height);
                        ctx.drawImage(imageCanvas.canvas, 0, 0, imageCanvas.canvas.width, imageCanvas.canvas.height);
                        ctx.drawImage(titleCanvas.canvas, 0,  imageCanvas.canvas.height, titleCanvas.canvas.width, titleCanvas.canvas.height);
                        ctx.drawImage(descriptionCanvas.canvas, 0, imageCanvas.canvas.height + titleCanvas.height, descriptionCanvas.canvas.width, descriptionCanvas.canvas.height);
                        //ctx.drawImage(descriptionCanvas.canvas, 0, 50 + margin, descriptionCanvas.canvas.width, descriptionCanvas.canvas.height);
                        //ctx.drawImage(ribonNew, maxWidth - (ribonNew.width/3) + 17, -17, ribonNew.width/3, ribonNew.height/3);

                break;
           
           default: 
           
        }
        return canvas.toBuffer('image/png');
    };

    const createTitleCanvas = (title) => {
        const canvas = createCanvas(MAX_WIDTH_CANVAS, 80);
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 50px Helvetica, Arial, sans-serif';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(title, 0,0);
        const paddingLeft = 50;
        const paddingRight = 50;
        let heightText = wrapText(ctx, title, paddingLeft, 60, canvas.width - paddingRight, 0);

        return {canvas, height: heightText, width: MAX_WIDTH_CANVAS};
    };

    const createDescriptionCanvas = async (description) => {
        const canvas = createCanvas(MAX_WIDTH_CANVAS, 230);
        const ctx = canvas.getContext('2d');
        const paddingLeft = 50;
        const paddingRight = 50;

        ctx.font = '37px arial,sans-serif-light,sans-serif';
        ctx.fillStyle = "#ffffff";
        //ctx.fillText(description, 0,0);
        let heightText = wrapText(ctx, description.toUpperCase(), paddingLeft, 65, canvas.width - paddingRight, 45);
        return {canvas, height: heightText, width: MAX_WIDTH_CANVAS};
    };

    const createImageCanvas = async (url) => {
        let canvasHeight;
        switch (POST_TYPE)
        {
            case 0 : // Bài đăng hình ảnh đơn
                const canvasHeight = 1080;
                break;
            
            case 1 :  // Bài đăng hình ảnh
                const canvasHeight = 770;
                break;
            
            default :
        }
        const img = await loadImage(url);
        const canvas = createCanvas(MAX_WIDTH_CANVAS, canvasHeight);
        const ctx = canvas.getContext('2d');
        //ctx.fillStyle = "#9b9b9b";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        let cordFitImage = getFitImage(img, canvas.height, canvas.width);

        ctx.drawImage(img, cordFitImage.x, cordFitImage.y, cordFitImage.max_width, cordFitImage.max_height);

        return {canvas, height: canvasHeight, width: MAX_WIDTH_CANVAS};
    };

    const getCordFitImage = (image, height, width) => {
        // get the scale
        let scale = Math.min(width / image.width, height / image.height);

        // get the top left position of the image
        let x = (width / 2) - (image.width / 2) * scale;
        let y = (height / 2) - (image.height / 2) * scale;

        return {scale, x, y};
    }
    
    const getFitImage = (image, height, width) => {
        // get the scale
        let ratio = image.width / image.height;
        let max_height = height;
        let max_width = ratio*height;
        
        // get the top left position of the image
        let x = (width - max_width)/2
        let y = (height - max_height)/2;
        
        return {ratio, x, y, max_width, max_height};
    }
}


module.exports = CreateImage;

import KNN from "./knn";
import { colors_16 } from "./data";
import Jimp from "jimp";


const decolorize = filename => {

    return Jimp.read(filename).then(image => {
        const knn = new KNN(1, colors_16.data, colors_16.labels);

        const { width, height } = image.bitmap;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const HexPixelColor = image.getPixelColor(x, y);
               // console.log({ hexaColor: HexPixelColor });
                const RGBpixelColor = Jimp.intToRGBA(HexPixelColor);
               
                const pixelPoint = [RGBpixelColor.r, RGBpixelColor.g, RGBpixelColor.b];
                const closestPixelColor = knn.predict(pixelPoint);
                 
                const newColor = colors_16.data[colors_16.labels.indexOf(closestPixelColor.label)];
                const newColorHex = Jimp.rgbaToInt(newColor[0], newColor[1], newColor[2], 255);

                image.setPixelColor(newColorHex, x, y);
            }
        }

        const ext = image.getExtension();
        image.write(`./decolorized/${filename}`);
    }).catch(err => console.log(err));
}



export default decolorize;
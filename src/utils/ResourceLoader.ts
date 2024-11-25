import * as PIXI from "pixi.js";

import {ResourceMap} from "../types/types";
import atlasjson from "../assets/images/atlas.json";
import image from "../assets/images/atlas.png";
import Font from "../assets/fonts/Chango-Regular.ttf";

export default class Resources {
    private textures: ResourceMap;
    constructor() {
        this.textures = {};
    }
    public async loadResources(): Promise<void> {
        const font = new FontFace('Chango', `url(${Font})`);
        font.load().then(function(loadedFont) {
            window.document.fonts.add(loadedFont);
        });

        const atlas = await PIXI.Assets.load(atlasjson);
        const img = await PIXI.Assets.load(image);
        const sprite_sheet = new PIXI.Spritesheet(img, atlas);
        await sprite_sheet.parse();
        Object.entries(sprite_sheet.textures).forEach(([key,texture]) => {
            this.textures[key] = texture;
        });
    }

    public getResources(): ResourceMap {
        return this.textures;
    }
}
import {ResourceMap, UIConfig} from "../types/types";
import {Container, Graphics, Sprite, TextStyleAlign, Text} from "pixi.js";

export default class UI extends Container {
    private texts: {[key: string]: Text} = {};
    private timer: any;
    private timerFill: any;
    constructor(config: UIConfig, resources: ResourceMap) {
        super();
        Object.values(config.images).forEach(image => {
                const sprite = new Sprite(resources[image.texture]);
                sprite.position.set(image.position.x, image.position.y);
                this.addChild(sprite);
        });
        this.addTexts(config);
        this.addTimer(config);
    }

    public updateTimer(percent: number): void {
        this.timerFill.x = (percent - 1) * this.timerFill.width;
    }

    public updateCount(value: number): void {
        this.texts.text_counter.text = `${value}`;
    }

    private addTexts(config: UIConfig): void {
        Object.entries(config.texts).forEach(([key, value]) => {
            const text = new Text(value.text, {
                    fontFamily: value.font.name,
                    fontSize: value.font.size,
                    fill: value.color
                });
            if(value.stroke_color) text.style.stroke = { color: value.stroke_color, width: value.stroke_width  }

            text.style.align = value.font.align as TextStyleAlign;
            text.position.set(value.position.x, value.position.y);
            this.texts[key] = text;
            this.addChild(text);
        })
    }

    private addTimer(config: UIConfig): void {
        const cont = new Container();
        cont.position.set(config.timer.position.x, config.timer.position.y);
        const bg = new Graphics()
            .roundRect(0, 0, config.timer.width, config.timer.height, config.timer.round)
            .fill(config.timer.bg_color);
        const fill = new Graphics()
            .roundRect(0, 0, config.timer.width, config.timer.height, config.timer.round)
            .fill(config.timer.fill_color);

        cont.addChild(bg);
        cont.addChild(fill);
        this.timer = cont;
        this.timerFill = fill;
        this.addChild(cont);
        const mask = new Graphics()
            .roundRect(0, 0, config.timer.width, config.timer.height, config.timer.round)
            .fill(config.timer.bg_color);
        this.timer.addChild(mask);
        this.timer.mask = mask;
    }

}
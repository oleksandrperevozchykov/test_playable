import {Container, Sprite, Text, TextStyleAlign} from "pixi.js";
import {ButtonConfig, ResourceMap} from "../types/types";

export default class Button extends Container {
    private pressed: boolean = false;
    private press_scale: number = 1;
    constructor(config: ButtonConfig, resources: ResourceMap) {
        super();
        this.position.set(config.position.x, config.position.y)
        this.pivot.set(0.5, 0.5);
        this.press_scale = config.press_scale;
        const sprite = new Sprite(resources[config.image]);
        sprite.anchor.set(0.5,0.5);
        sprite.position.set(0,0);
        this.addChild(sprite);
        if(config.text) {
            const text = new Text(config.text.text, {
                fontFamily: config.text.font.name,
                fontSize: config.text.font.size,
                fill: config.text.color
            });
            if(config.text.stroke_color) text.style.stroke = { color: config.text.stroke_color, width: config.text.stroke_width  }
            text.style.align = config.text.font.align as TextStyleAlign;
            text.anchor.set(0.5,0.5);
            text.position.set(0, 0);
            this.addChild(text);
        }
        this.addListeners();
    }

    public enable(): void {
        this.interactive = true;
    }

    public disable(): void {
        this.interactive = false;
    }

    private addListeners():void {
        this.onpointerdown = () => {
            this.pressed = true;
            this.scale.set(this.press_scale, this.press_scale);
        }

        this.onpointerleave = () => {
            this.pressed = false;
            this.scale.set(1, 1);
        }

        this.onpointerup = () => {
            if(this.pressed) {
                this.scale.set(1, 1);
                this.pressed = false;
                this.emit("pressed");
            }
        }

    }
}
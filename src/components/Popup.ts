import {AnimationConfig, FontConfig, PopupConfig, ResourceMap} from "../types/types";
import { gsap } from "gsap";
import {Container, ContainerChild, Graphics, Sprite, Text, TextStyleAlign} from "pixi.js";
import Button from "./Button";

export default class Popup extends Container {
    private main_container: Container<ContainerChild>;
    private sprites: {[key: string]: Sprite } = {};
    private text: Text | null = null;
    private button: Button | null = null;
    private bg_shadow: Graphics;
    private animations: {[key: string]: AnimationConfig} = {};
    constructor(config: PopupConfig, resources: ResourceMap) {
        super();
        this.main_container = new Container();

        this.bg_shadow = this.bg();
        this.addChild(this.bg_shadow);
        Object.entries(config.images).forEach(([key, value]) => {
            const sprite = new Sprite(resources[value.texture]);
            console.log(resources[value.texture])
            sprite.position.set(value.position.x, value.position.y);
            this.main_container.addChild(sprite);
            this.sprites[key] = sprite;
        })
        if(config.text) {
            this.text = this.addText(config.text);
            this.main_container.addChild(this.text);
        }
        this.addChild(this.main_container);
        if(config.button) {
            this.button = new Button(config.button, resources);
            this.addChild(this.button);
        }
        if(config.animations) this.animations = config.animations;
        this.main_container.pivot.set(540,960);
        this.main_container.position.set(540,960);
        this.visible = false;
    }

    public async show(): Promise<void> {
        return new Promise(async resolve => {
            this.main_container.scale.set(1,1);
            if(this.button) this.button.scale.set(1,1);
            this.visible = true;
            await this.playAnimation('show');
            if(this.button) {
                this.button.addListener("pressed", () => {
                    this.button?.removeListener("pressed");
                    resolve();
                })
                this.button.enable();
            } else {
                resolve();
            }

        })
    }

    public async hide(): Promise<void> {
        await this.playAnimation('hide');
        this.visible = false;
    }

    private bg(): Graphics {
        const bg = new Graphics()
            .rect(0, 0, 1080, 1920)
            .fill('black');
        bg.alpha = 0.8;
        return bg
    }

    private async playAnimation(animation:string): Promise<void> {
        return new Promise(resolve => {
            const anim = this.animations[animation];
            if(!anim) resolve();
            else {
               Object.entries(anim.parts).forEach(([part, anim]) => {
                   let o;
                   Object.entries(this).forEach(([k,v]) => {
                       if (k == part) o = v;
                   });
                   if(!o) o = this.main_container;
                   const obj = anim.scale != null ? o.scale : o;
                   const conf: {[key: string]: any} = {};
                   Object.entries(anim).forEach(([key, value]) => {
                       if((key == "x" || key == "y") && anim.scale != null) {
                           conf[key] = anim.scale;
                       } else if(key == "isLast") {
                           if(value) conf["onComplete"] = () => resolve();
                       } else if(key == 'isText' || key == 'to' || key == 'scale') {
                           //skip
                       } else {
                           conf[key] = value;
                       }
                   });
                   if(anim.isText && obj instanceof Text) {
                       let arr = obj.text.split('');
                       let text = '';
                       conf["text"] = text;
                       conf["onComplete"] = () =>{
                           if(arr.length > 0) {
                               conf['delay'] = 0;
                               conf["text"] = text;
                               text += arr.shift();
                               animateText();
                           } else {
                               if(anim.isLast) resolve();
                           }
                       };
                       const animateText = () => {
                           if(anim.to) {
                               gsap.to(obj,conf);
                           } else {
                               gsap.from(obj,conf);
                           }
                       }
                       animateText();
                   } else {
                       if(anim.to) {
                           gsap.to(obj,conf);
                       } else {
                           gsap.from(obj,conf);
                       }
                   }
               })
            }
        })
    }

    private addText(value: FontConfig): Text {
        const text = new Text(value.text, {
            fontFamily: value.font.name,
            fontSize: value.font.size,
            fill: value.color,
            wordWrap: true,
            wordWrapWidth: 914
        });
        if(value.stroke_color) text.style.stroke = { color: value.stroke_color, width: value.stroke_width  }
        text.style.align = value.font.align as TextStyleAlign;
        text.pivot.set(0.5, 0.5);
        text.anchor.set(0.5, 0.5);
        text.position.set(value.position.x + text.width/2, value.position.y + text.height/2);
        return text;
    }
}


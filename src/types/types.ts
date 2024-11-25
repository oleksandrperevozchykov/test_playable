import * as PIXI from "pixi.js";
import {EmitterConfigV3} from "@barvynkoa/particle-emitter/lib/EmitterConfig";

export interface Config {
    app: AppConfig,
    model: ModelConfig,
    popup: {[key: string]: PopupConfig},
    ui: UIConfig,
    tile: TileConfig
}
export interface PopupConfig {
    name: string,
    button?: ButtonConfig,
    images: {
        [key: string]: ImageConfig
    }
    text?: FontConfig
    animations?: {
        [key: string]: AnimationConfig
    }
}

export interface AppConfig {
    width: number,
    height: number,
    background_color: string,
    bg_image: string
}

export interface TileConfig {
    position: Position,
    tile_textures: {
        [key: string]: number
    },
    step: number,
    bg_texture: string
    particle: EmitterConfigV3

}
export interface ButtonConfig {
    position: Position,
    press_scale: number,
    image: string,
    text?: FontConfig
}

export interface AnimationConfig {
    parts: { [key: string]: AnimationPartConfig }
}
export interface AnimationPartConfig {
    to: boolean,
    isText?:boolean,
    isLast: boolean,
    x?: number,
    y?: number,
    alpha?: number,
    scale?: number,
    ease?: string,
    duration: number,
    delay?: number
}
export interface ImageConfig {
    texture: string,
    position: {
        x: number,
        y: number
    }
}
export interface ResourceMap {
    [key: string]: PIXI.Texture;
}

export interface FontStyle {
    name: string,
    size: number,
    align: string
}

export interface FontConfig {
    position: Position,
    text: string,
    color: string,
    stroke_color?: string
    stroke_width?: number
    font: FontStyle
}

export interface TimerConfig {
    bg_color: string,
    fill_color: string,
    position: Position,
    width: number,
    height: number,
    round: number

}

export  interface UIConfig {
    images: {
        [key: string]: ImageConfig
    },
    texts: {
        [key: string]: FontConfig
    },
    timer: TimerConfig
}

export interface Position {
    x: number,
    y: number
}

export interface TilePosition {
    row: number,
    col: number
}

export interface ModelConfig {
    tiles: number[],
    rows: number,
    cols: number,
    time: number

}
export enum Direction {
    left,
    right,
    up,
    down
}
import {Position, ResourceMap, TileConfig} from "../types/types";
import {Application, Container, ContainerChild, Point, Sprite, Texture} from "pixi.js";
import {Emitter} from "@barvynkoa/particle-emitter";
import { gsap } from "gsap";
export default class Tile extends Container {
    private tile_sprite: Sprite;
    private tile_cont: Container<ContainerChild>;
    private bg: Sprite;
    public  readonly column: number;
    public readonly row: number;
    private particle_emitter: Emitter;
    private isSelected: boolean = false;
    public readonly origin_position: Position;
    private app: Application;
    constructor(config: TileConfig, resources: ResourceMap, row: number, col: number, value: number, app: Application) {
        super();
        this.app = app;
        this.column = col;
        this.row = row;
        this.bg = new Sprite(resources[config.bg_texture]);
        this.origin_position = { x :config.step * col + this.bg.width/2, y: config.step * row + this.bg.height/2 }
        this.bg.anchor.set(0.5, 0.5);
        const tile_textures: { [key: number]: Texture } = {}
        Object.entries(config.tile_textures).forEach(([texture, num]) => {
            tile_textures[num] = resources[texture];

        })
        this.tile_sprite = new Sprite();
        this.tile_sprite.texture = tile_textures[value];
        this.tile_sprite.anchor.set(0.5, 0.5);
        this.tile_cont = new Container();
        this.tile_cont.addChild(this.bg);
        this.tile_cont.addChild(this.tile_sprite);
        this.addChild(this.tile_cont);
        this.addListeners();
        this.position.set(this.origin_position.x, this.origin_position.y);
        const particle_cont = new Container();
        this.addChild(particle_cont);
        const particle_conf = config.particle;

        particle_conf.behaviors.push({
            type: 'textureSingle',
                config: {
                    texture: tile_textures[value],
                }
        })
        this.particle_emitter = new Emitter(
            particle_cont,
            particle_conf
        );
    }

    public enable(): void {
        this.interactive = true;
    }

    public disable(): void {
        this.interactive = false;
    }



    public reset(): void {
        this.position.set(this.origin_position.x, this.origin_position.y);
        this.tile_cont.scale.set(1, 1);
        this.visible = true;
    }

    private addListeners(): void {
        let x = 0;
        let y = 0;

        this.onpointerdown = (event) => {
            this.isSelected = true;
            this.parent?.setChildIndex(this, this.parent?.children?.length - 1);
            const pos = this.parent?.toLocal(event.global);
            x = pos.x;
            y = pos.y;
            this.app.stage.emit('tile_selected', this);
        }
        this.onpointerup =  async () => {
            this.isSelected = false;
            x = 0;
            y = 0;
            this.app.stage.emit('tile_dropped', this);

        }
        this.onpointerleave = ()  => {
            this.moveToPosition();
            this.isSelected = false;
            x = 0;
            y = 0;
        };
        this.onpointermove = (event) => {
            if(this.isSelected) {
                const pos = this.parent?.toLocal(event.global);
                this.x += pos.x - x;
                this.y += pos.y - y;
                x = pos.x;
                y = pos.y;

            }
        };
    }


    public async hide(): Promise<void> {
        return new Promise(resolve => {
            gsap.to(this.tile_cont.scale, {x: 0, y: 0, ease: "bounce.in", duration: 0.2, onComplete: ()=> {
                    this.particle_emitter.autoUpdate = true;
                    this.particle_emitter.playOnce(() => resolve());
                }});
        });
    }

    public async moveToPosition(pos?: Position): Promise<void> {
        const newPos = pos ? pos : this.origin_position
        return new Promise(resolve => {
            gsap.to(this, {x: newPos.x, y: newPos.y, ease: "elastic.out", duration: 0.2, onComplete: ()=> {
                resolve();
            }});
        });
    }
}
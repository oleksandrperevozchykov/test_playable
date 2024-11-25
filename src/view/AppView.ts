import {AppConfig, Config, ImageConfig, Position, ResourceMap, UIConfig} from "../types/types";
import UI from "../components/UI";
import Tile from "../components/Tile";
import Popup from "../components/Popup";
import {Application, Container, ContainerChild, Sprite} from "pixi.js";
export default class AppView {
    private app: Application;
    private ui: UI;
    private mainContainer: Container<ContainerChild>;
    private popup_container: Container<ContainerChild>;
    private tiles: Tile[] = [];
    private popups: {[key: string]: Popup} = {};

    constructor(config: Config, resources: ResourceMap, app: Application) {
        this.app = app;
        this.mainContainer = new Container();
        this.popup_container = new Container();

        this.app.stage.addChild(this.mainContainer);
        this.addChild(new Sprite(resources[config.app.bg_image]));

        this.ui = new UI(config.ui, resources);
        this.addChild(this.ui);
        this.createTiles(config,resources);
        Object.entries(config.popup).forEach(([name, config]) => {
            const popup = new Popup(config, resources);
            this.popup_container.addChild(popup);
            this.popups[name] = popup;
        })
        this.addChild(this.popup_container);
    }

    public updateTimer(time: number, time_ref: number): void {
        this.ui.updateTimer(time/time_ref);
    }

    public resetTiles(): void {
        this.tiles.forEach(tile => tile.reset());
    }

    public disableTiles(): void {
        this.tiles.forEach(tile => tile.disable());
    }
    public enableTiles(): void {
        this.tiles.forEach(tile => tile.enable());
    }

    public getCoveredTiles(tile: Tile): number[] {
        const coveredTiles: number[] = [];
        const getVertices = (t: Tile) => {
            return {
                minx: t.x,
                maxx: t.x + t.width,
                miny: t.y,
                maxy: t.y + t.height
            }
        }
        const st = getVertices(tile);
        this.tiles.forEach((value, i) => {
            if(tile != value) {
                const ct = getVertices(value);
                if((ct.minx <= st.minx && st.minx <= ct.maxx) || (ct.minx <= st.maxx && st.maxx <= ct.maxx)) {
                    if((ct.miny <= st.miny && st.miny <= ct.maxy) || (ct.miny <= st.maxy && st.maxy <= ct.maxy))
                    {
                        coveredTiles.push(i);
                    }
                }
            }
        })
        return coveredTiles;
    }

    public async showPopup(name: string): Promise<void> {
        const popup = this.popups[name];
        await popup.show();
        await popup.hide();
    }


    private addChild(child: any): void {
        this.mainContainer.addChild(child);
    }
    private createTiles(config: any, resources: ResourceMap) {
        const tilesContainer = new Container({
            isRenderGroup: true
        });
        tilesContainer.position.set(config.tile.position.x, config.tile.position.y);
        for(let i = 0; i < config.model.cols; i++) {
            for(let j = 0; j < config.model.rows; j++) {
                const index = j + (config.model.cols * i);
                const tile = new Tile(config.tile, resources, j, i, config.model.tiles[index], this.app);
                tilesContainer.addChild(tile);
                this.tiles[index] = tile;
            }
        }
        this.addChild(tilesContainer);
    }

    public async destroyTiles(sti: number, mti: number):Promise<void>  {
        await this.tiles[sti].moveToPosition(this.tiles[mti].origin_position);
        this.tiles[mti].visible = false;
        await this.tiles[sti].hide();
    }

    public updateCount(count: number): void {
        this.ui.updateCount(count);
    }
}

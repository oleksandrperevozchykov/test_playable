import AppModel from '../model/AppModel';
import AppView from '../view/AppView';
import {AppConfig, Config, ResourceMap} from "../types/types";
import {Application, Ticker} from "pixi.js";
import Tile from "../components/Tile";


export default class MainController {
    private app: Application;
    private config: Config;
    private model: AppModel;
    private view: AppView;
    private play: boolean = false;

    constructor(config: Config, resources: ResourceMap) {
        this.app = new Application();
        this.config = config;
        this.model = new AppModel(config);
        this.view = new AppView(config, resources, this.app);
        this.addListeners();
        this.init();
    }

    private async init(): Promise<void> {
        await this.initApp(this.config.app);
        await this.startGame();
    }

    private async startGame(): Promise<void> {
        await this.view.showPopup('start');
        this.startPlay();
        this.startTimer();
    }

    private startPlay(): void {
        this.play = true;
        this.view.enableTiles();
    }

    private startTimer(): void{
        this.app.ticker.add((ticker) => this.onTimeUpdate(ticker));
    }

    private addListeners(): void {
        this.app.stage.addListener('tile_selected', (tile) => this.model.selectTile(tile.column * 4 + tile.row));
        this.app.stage.addListener('tile_dropped',  async (tile) => this.tryPlay(tile));

    }

    private async tryPlay(tile: Tile): Promise<void> {
        if(!this.play) return;
        this.view.disableTiles();
        const matches = this.view.getCoveredTiles(tile);
        if(matches.length) {
            const sti = tile.column * 4 + tile.row;
            let mti;
            matches.forEach(match => {
                if (this.model.checkMatch(match)) mti = match;
            });
            if(mti != null) {
                this.model.destroyTiles([sti,mti]);
                this.model.countUp();
                await this.view.destroyTiles(sti, mti);
                this.view.updateCount(this.model.getCount());
            } else {
                tile.moveToPosition();
            }
        } else {
            tile.moveToPosition();
        }
        this.model.unselectedTile();
        if(this.model.checkWin()) {
            this.play = false;
            this.view.showPopup('win');
        } else {
            this.view.enableTiles();
        }
    }

    private onTimeUpdate(dt: Ticker): void {
        if(this.play){
            if (this.model.getTime() > 0) {
                this.model.updateTime(dt.deltaTime / 60);
                this.view.updateTimer(this.model.getTime(), this.model.time_ref);
            } else {
                this.play = false;
                this.view.disableTiles();
                this.stopGame();
            }
        }
    }

    private async initApp(config: AppConfig): Promise<void> {
        await this.app.init({width: config.width, height: config.height, background: config.background_color, resizeTo: window});
        document.body.appendChild(this.app.canvas);
        this.onResize();
        window.addEventListener('resize',() =>  this.onResize());
    }

    private onResize(): void {
        if(window.innerHeight < this.app.stage.height) {
            const scale = window.innerHeight/this.app.stage.height;
            this.app.stage.scale.set(scale, scale);
        }
        this.app.stage.position.set(window.innerWidth/2 - this.app.stage.width/2,
            window.innerHeight/2 - this.app.stage.height/2);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    private async stopGame(): Promise<void> {
        await this.view.showPopup('fail');
        this.model.resetCount();
        this.model.resetTime();
        this.model.resetTiles();
        this.view.resetTiles();
        this.view.updateTimer(1,1);
        this.view.updateCount(0);
        this.startPlay();

    }
}

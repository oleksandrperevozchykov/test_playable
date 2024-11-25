import {ModelConfig} from "../types/types";

export default class AppModel {
    private config: ModelConfig;
    private tiles: TileModel[] = [];
    private selected_tile: TileModel | null = null;
    public readonly time_ref: number;
    private time_left: number;
    private count: number = 0;

    constructor(config: any) {
        this.config = config.model;
        this.time_ref = this.config.time;
        this.time_left = this.config.time;
        this.resetTiles();
    }

    public selectTile(index: number): void {
        this.selected_tile = this.tiles[index];
    }

    public countUp(): void {
        this.count++;
    }

    public getCount(): number {
        return this.count;
    }

    public unselectedTile(): void {
        this.selected_tile = null;
    }

    public destroyTiles(tiles: number[]): void {
        tiles.forEach(index => this.tiles[index].is_destroyed = true);
    }

    public checkMatch(tile: number): boolean {
        return this.selected_tile != null && !this.tiles[tile].is_destroyed && this.selected_tile.value == this.tiles[tile].value;
    }

    public resetTime(): void {
        this.time_left = this.time_ref;
    }

    public updateTime(dt: number): void {
        this.time_left -= dt;
    }

    public getTime(): number {
        return this.time_left;
    }

    public resetCount(): void {
        this.count = 0;
    }


    public resetTiles(): void {
        this.tiles = this.config.tiles.map((value, index) => {
            return {index, value, is_destroyed: false} as TileModel;
        });
        this.unselectedTile();
    }

    public checkWin(): boolean {
        let win = true;
        this.tiles.forEach(t => {
            if(!t.is_destroyed) win = false;
        })
        return win;
    }
}

interface TileModel {
    index: number,
    value: number,
    is_destroyed: boolean
}

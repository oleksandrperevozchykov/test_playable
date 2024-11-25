import MainController  from './controller/MainController';
import rawConfig from './config/config.json';
import Resources from "./utils/ResourceLoader";
let config: any;

if (typeof rawConfig === 'string') {
    let d: string = rawConfig;
    config = JSON.parse(atob(d.split(',')[1]));
} else {
    config = rawConfig;
}

class Game {
    private rm: Resources;
    constructor() {
        this.rm = new Resources();

    }
    async start(): Promise<void> {
        await this.rm.loadResources();
        new MainController(config, this.rm.getResources());

    }
}
const game = new Game();
game.start();



import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import Loader from './components_mobile/Loader';
import Home from './components_mobile/Home';
import MainGame from './components_mobile/MainGame';
import Functions from './Functions';

export default class Game {
    public app: PIXI.Application;
    private overallticker: PIXI.Ticker;
    //components
    private homeComponent: Home;
    private gameComponent: MainGame;
    //others
    private slideshowTicker: Boolean = true;
    private play: Boolean = true;
    private bubbles: Array<any> = [];
    private bubblesSprites: Array<PIXI.Sprite> = [];
    private protection: number = 0;
    //read only
    private readonly baseWidth: number = 1920;
    private readonly baseHeight: number = 1080;
    

    constructor() {
        this.app = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight, antialias: false});
        window.document.body.appendChild(this.app.view);
        new Loader(this.app, this.init.bind(this));

    }
    private init(){
        this.overallticker = new PIXI.Ticker();
        this.overallticker.autoStart = false;
        this.overallticker.add(this.allAnimations.bind(this));
        this.overallticker.start();
        this.createHome();
    }

    private createMainGame(){
        this.gameComponent = new MainGame(this.app);
        this.app.stage.addChild(this.gameComponent.container);
    }

    private createHome(){
        let counter = 0;
        this.homeComponent = new Home(this.app);
        this.app.stage.addChild(this.homeComponent.container);

        //play button controller
        this.homeComponent.homeplaybtn.addListener("pointerdown", () => {
            this.homeComponent.homeplaybtn.removeListener('mouseover');
            this.homeComponent.homeplaybtn.removeListener('mouseout');
            this.homeComponent.homeplaybtn.animationSpeed = .7;
            // this.playSound(9)
            if(this.play){
                this.play = false;
                this.homeComponent.homeplaybtn.onLoop = () => {
                    counter++;
                    if(counter == 2){
                        this.homeComponent.stopMyanimations();
                        this.slideshowTicker = false;
                        this.createBubbles();
                        this.animateBubbles();
                        this.createMainGame();
                        let transition = gsap.to(this.homeComponent.container, {
                            alpha: 0,
                            duration: 1.3,
                            onComplete: () => {
                                this.app.stage.removeChild(this.homeComponent.container);
                                this.bubblesSprites.forEach((element, index) => {
                                    let delay = .005 * index;
                                    let gsapper = gsap.to(element, {
                                        delay: delay,
                                        duration: .05,
                                        alpha: 0,
                                        onStart: () => {
                                            if(index == 0){
                                                let transition2 = gsap.to(this.gameComponent.container, {
                                                    alpha: 1,
                                                    duration: 1.5,
                                                    onComplete: () => {
                                                        transition2.kill();
                                                    }
                                                });
                                            }
                                        },
                                        onComplete: () =>{
                                            this.app.stage.removeChild(element);
                                            if(index == this.bubblesSprites.length - 1){
                                                this.bubbles = [];
                                                this.bubblesSprites = [];
                                            }
                                            gsapper.kill();
                                        }
                                    });
                                });
                                this.overallticker.destroy();
                                transition.kill();
                            }
                        });
                    }
                }
            }
        });
    }

    private createBubbles(){
        while(this.bubbles.length < 300){
            let bubble = {
                x: Math.round(Functions.getRandomInt(-100, this.app.screen.width)),
                y: Math.round(Functions.getRandomInt(-100, this.app.screen.height)),
                size: Math.round(Functions.getRandomInt(50, 350))
            }

            let overlapping = false;
            for(let j = 0; j < this.bubbles.length; j++){
                let other = this.bubbles[j];
                if (bubble.x < other.x + other.size &&
                    bubble.x + bubble.size > other.x &&
                    bubble.y < other.y + other.size &&
                    bubble.size + bubble.y > other.y) {
                    overlapping = true;
                    break;
                 }
            }

            if(!overlapping){
                this.bubbles.push(bubble);
            }

            this.protection++;
            if(this.protection > 10000){
                break;
            }
        }
    }

    private animateBubbles(){
        let duration = 7;
        this.bubbles.forEach((element, index) => {
            let interval = duration * index;
            let show = setTimeout(() => {
                const sprite = Functions.loadSprite(this.app.loader, 'spritesgamescene', 'bubble.png', false);
                sprite.width = element.size;
                sprite.height = element.size;
                sprite.x = element.x;
                sprite.y = element.y;
                this.bubblesSprites.push(sprite);
                this.app.stage.addChild(sprite);
                clearTimeout(show);
            }, interval);
        });
    }

    private allAnimations(){
        //slideshow start
        if(this.slideshowTicker){
            this.homeComponent.slidetimer++;
            if(this.homeComponent.slidetimer >= 400){
                let gsapperalpha0 = gsap.to(this.homeComponent.slideshow[this.homeComponent.lastindex], {
                    alpha: 0,
                    duration: 2,
                    ease:'ease-in',
                    onComplete: () => {
                        this.homeComponent.slideshow[this.homeComponent.lastindex].alpha = 0;
                        gsapperalpha0.kill();
                    }
                });
                this.homeComponent.slidetimer = 0;
                this.homeComponent.lastindex += 1;
                if(this.homeComponent.lastindex == this.homeComponent.slideshow.length){
                    this.homeComponent.lastindex = 0;
                }
                let gsapperalpha1 = gsap.to(this.homeComponent.slideshow[this.homeComponent.lastindex], {
                    alpha: 1,
                    duration: 2,
                    ease:'ease-in',
                    onComplete: () => {
                        this.homeComponent.slideshow[this.homeComponent.lastindex].alpha = 1;
                        gsapperalpha1.kill();
                    }
                });
            }
        }
        //slideshow end
    }
}
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import Loader from './components_mobile/Loader';
import Home from './components_mobile/Home';
import MainGame from './components_mobile/MainGame';
import Functions from './Functions';
import {Howler} from 'howler';


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

    //sound 
    private sound:Array<any>;
    private globalSound:Boolean = false;
    private ambientCheck:Boolean
    private sfxCheck:Boolean;
    public load:Loader;

    constructor() {
        this.app = new PIXI.Application({ width: this.baseWidth, height: this.baseHeight, antialias: false});
        window.document.body.appendChild(this.app.view);
       this.load = new Loader(this.app, this.init.bind(this),this.sounds.bind(this), this.playSound.bind(this));
    }
    private init(){
        this.overallticker = new PIXI.Ticker();
        this.overallticker.autoStart = false;
        this.overallticker.add(this.allAnimations.bind(this));
        this.overallticker.start();
        this.createHome();
        document.addEventListener("visibilitychange", ()=> {
            if (document.hidden){
                Howler.mute(true)
            } else {
              
                Howler.mute(false)
            }
        });
    }

    // sounds methods
    private sounds(soundInit:Boolean,soundArray:Array<any>){
        this.sound = soundArray;
        this.globalSound = soundInit;
        console.log(this.sound, "test");

        // prevent background music from stacking when click multiple times
        if(!this.sound[1].playing() || !this.sound[21].playing(21)){
            this.playSound(1);
        }
    }
    private playSound(index:number){
        this.sound[index].play();
        this.soundVolume(index)
    }

    private soundStop(index:number){
        this.sound[index].stop()
    }

    private soundVolume(index:number){ 
        if(index == 4 || index == 21) // sound plinko ball collide
            this.sound[index].volume(0.2)
        if(index == 4) // sound plinko ball collide
            this.sound[index].volume(0.2)
        if(index == 6 || index == 9) //sound for button click and hover
            this.sound[index].volume(0.3)
        if(index == 8 || index == 10) //sound for reel spin
            this.sound[index].volume(0.4)
        if(index == 0) //sound bgm
            this.sound[index].volume(0.5)
        if(index == 12 || index == 13 || index == 14 ) //sound for bonus, wild, jackot impact
            this.sound[index].volume(0.5)
        if(index == 25)
            this.sound[23].volume(0.1)  
        if(index == 50)
            this.sound[23].volume(1)     
    }

    private muteSound(type:string,bol:Boolean){
        if(type === 'all'){
            if(bol){
                Howler.mute(true)
            
            }else{
                Howler.mute(false)
                this.sound[0].mute(false)
                this.sound[1].mute(false)
                this.sound[2].mute(false)
                this.sound[3].mute(false)
                this.sound[4].mute(false)
                this.sound[5].mute(false)
                this.sound[6].mute(false)
                this.sound[7].mute(false)
                this.sound[8].mute(false)
                this.sound[9].mute(false)
                this.sound[10].mute(false)
                this.sound[11].mute(false)
                this.sound[12].mute(false)
                this.sound[13].mute(false)
                this.sound[14].mute(false)
                this.sound[15].mute(false)
                this.sound[16].mute(false)
                this.sound[17].mute(false)
                this.sound[18].mute(false)
                this.sound[19].mute(false)
                this.sound[20].mute(false)
                this.sound[21].mute(false)    
                this.sound[22].mute(false)  
                this.sound[23].mute(false)         
                this.sound[24].mute(false)  
                this.sound[25].mute(false)  
                this.sound[26].mute(false)  
            }
        }else if(type === 'ambient'){
            if(bol){
                //ambient mute
                this.ambientCheck = bol
                this.sound[26].mute(true)
            }else{
                //ambient unmute
                // this.controller.sound_button.texture = this.soundOnTexture
                this.ambientCheck = bol
                this.sound[26].mute(false)
            }

            // if(this.ambientCheck){
            //     Howler.mute(true)
            //     this.controller.sound_button.texture = this.soundOffTexture.texture;
            // }else{
            //     Howler.mute(false)
            //     this.controller.sound_button.texture = this.soundOnTexture.texture;
            // }
        }else if(type === 'sfx'){
            if(bol){
                //sfx mute
                // this.sfxCheck = bol
                this.sound[1].mute(true)
                this.sound[2].mute(true)
                this.sound[3].mute(true)
                this.sound[4].mute(true)
                this.sound[5].mute(true)
                this.sound[6].mute(true)
                this.sound[7].mute(true)
                this.sound[8].mute(true)
                this.sound[9].mute(true)
                this.sound[10].mute(true)
                this.sound[11].mute(true)
                this.sound[12].mute(true)
                this.sound[13].mute(true)
                this.sound[14].mute(true)
                this.sound[15].mute(true)
                this.sound[16].mute(true)
                this.sound[17].mute(true)
                this.sound[18].mute(true)
                this.sound[19].mute(true)
                this.sound[20].mute(true)
                this.sound[21].mute(true)
                this.sound[22].mute(true)
                this.sound[23].mute(true)
                this.sound[24].mute(true)
                this.sound[25].mute(true)
                
            }else{
                //sfx unmute
                // this.controller.sound_button.texture = this.soundOnTexture
                // this.sfxCheck = bol
                this.sound[1].mute(false)
                this.sound[2].mute(false)
                this.sound[3].mute(false)
                this.sound[4].mute(false)
                this.sound[5].mute(false)
                this.sound[6].mute(false)
                this.sound[7].mute(false)
                this.sound[8].mute(false)
                this.sound[9].mute(false)
                this.sound[10].mute(false)
                this.sound[11].mute(false)
                this.sound[12].mute(false)
                this.sound[13].mute(false)
                this.sound[14].mute(false)
                this.sound[15].mute(false)
                this.sound[16].mute(false)
                this.sound[17].mute(false)
                this.sound[18].mute(false)
                this.sound[19].mute(false)
                this.sound[20].mute(false)
                this.sound[21].mute(false)
                this.sound[22].mute(false)
                this.sound[23].mute(false)
                this.sound[24].mute(false)
                this.sound[25].mute(false)
                
            }
            // if(this.ambientCheck && this.sfxCheck){
            //     Howler.mute(true)
            //     this.controller.sound_button.texture = this.soundOffTexture.texture
            // }else if(!this.ambientCheck || !this.sfxCheck){
            //     Howler.mute(false)
            //     this.controller.sound_button.texture = this.soundOnTexture.texture
            // }


        }
        
    }



    private createMainGame(){
        this.gameComponent = new MainGame(this.app, this.playSound.bind(this), this.soundStop.bind(this), this.muteSound.bind(this), this.load.isMute, this.soundVolume.bind(this));
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
            this.playSound(9)
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
       this.playSound(27)
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
        let duration = 4;
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
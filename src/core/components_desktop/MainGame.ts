import * as PIXI from 'pixi.js';
import Functions from '../Functions';
import Slot from './components/Slot';
import Controller from './components/Controller';
import Niceone from './components/Niceone';
import Impressive from './components/Impressive';
import Excellent from './components/Excellent';
import Bonus from './Bonus';
import gsap from 'gsap';

export default class MainGame {
    private bubbles: Array<any> = [];
    private protection: number = 0;
    private app:PIXI.Application;
    public container: PIXI.Container;
    private fishcontainer: PIXI.Container;
    //animates sprite
    private bluecoral: PIXI.Sprite;
    private lightrays: PIXI.AnimatedSprite;
    private sandbg: PIXI.AnimatedSprite;
    private boat: PIXI.AnimatedSprite;
    private sandreflection: PIXI.AnimatedSprite;
    private starfishanimated: PIXI.AnimatedSprite;
    private leftstickleaves1: PIXI.AnimatedSprite;
    private leftstickleaves2: PIXI.AnimatedSprite;
    private rightstickleaves1: PIXI.AnimatedSprite;
    private rightstickleaves2: PIXI.AnimatedSprite;
    private leftrock1: PIXI.Sprite;
    private leftrock2: PIXI.Sprite;
    private rightrock1: PIXI.Sprite;
    private rightrock2: PIXI.Sprite;
    private lefttube1: PIXI.Sprite;
    private righttube1: PIXI.Sprite;
    private static_left_corals: PIXI.Sprite;
    private static_right_corals: PIXI.Sprite;
    private leaves_left: PIXI.AnimatedSprite;
    private leaves_right: PIXI.AnimatedSprite;
    private green_leaves_right1: PIXI.AnimatedSprite;
    private bubblesleft: PIXI.AnimatedSprite;
    private bubblesright: PIXI.AnimatedSprite;
    //others
    private myAnimationsGSAP: any = [];
    private myAnimationsSprites: any = [];
    //components
    public slotgame: Slot;
    private controller: Controller;
    private niceonepopup: Niceone;
    private impressivepopup: Impressive;
    private excellentpopup: Excellent;
    private bonusComponets: Bonus;
    //slot boolean
    private playcount: number = 0;
    public autoplay: Boolean = false;
    public spintype: string = "normal";
    public startgame: Boolean = false;
    public autostop: Boolean = false;
    public autospin: Boolean = false;
    private overallticker: PIXI.Ticker;
    private openmodal: Boolean = false;
    private stopbtn: PIXI.Sprite;
    private playbtn: PIXI.Sprite;
    private bubblesSprites: Array<PIXI.Sprite> = [];

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        this.fishcontainer = new PIXI.Container();
        this.stopbtn = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'play_button_clicked.png', false);
        this.playbtn = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'play_button.png', false);
        this.init();
    }

    private init(){  
        this.overallticker = new PIXI.Ticker();
        this.overallticker.autoStart = false;
        this.overallticker.add(this.allAnimations.bind(this));
        this.overallticker.start();
        this.createBackground();
        this.createSlot();
        this.createController();
        this.container.alpha = 0;
        window.document.addEventListener('keypress', e => this.quickPlay());
    }

    private createNiceOne(win: number){
        this.openmodal = true;
        this.controller.mybuttons.forEach(element => {
            element.interactive = false;
            element.buttonMode = false;
        });
        this.niceonepopup = new Niceone(this.app, this.openModalInPopup.bind(this), win);
        this.container.addChild(this.niceonepopup.container)
    }

    private createImpressive(win: number){
        this.openmodal = true;
        this.controller.mybuttons.forEach(element => {
            element.interactive = false;
            element.buttonMode = false;
        });
        this.impressivepopup = new Impressive(this.app, this.openModalInPopup.bind(this), win);
        this.container.addChild(this.impressivepopup.container)
    }

    private createExcellent(win: number){
        this.openmodal = true;
        this.controller.mybuttons.forEach(element => {
            element.interactive = false;
            element.buttonMode = false;
        });
        this.excellentpopup = new Excellent(this.app, this.openModalInPopup.bind(this), win);
        this.container.addChild(this.excellentpopup.container)
    }

    private createController(){
        this.controller = new Controller(this.app, this.openModal.bind(this), this.setAutoPlay.bind(this));
        this.container.addChild(this.controller.container);
        this.container.addChild(this.controller.play_container);
        this.controller.play_container.position.x = (this.app.screen.width - this.controller.play_container.width) - this.controller.marginside;
        this.controller.play_container.position.y = (this.app.screen.height - this.controller.play_container.height);

        //events
        this.controller.singleplay_button.addListener("pointerdown", () => {
            if(this.autoplay){
                if(!this.slotgame.startreel){
                    this.autostop = true;
                }
                if(this.slotgame.enlargecharacters){
                    this.autospin = true;
                    this.slotgame.enlarge.duration(.01);
                    this.slotgame.paylineanimation.forEach(element => {
                        element.duration(.01);
                        element.delay(.01);
                    });
                }
                this.stopAutoPlay();
            }
            else{
                this.quickPlay();
            }
        });
    }

    private openModal(bool: Boolean){
        this.openmodal = bool;
    }

    private openModalInPopup(bool: Boolean){
        this.openmodal = bool;
        this.controller.mybuttons.forEach(element => {
            element.interactive = true;
            element.buttonMode = true;
        });
    }

    private setButtonsBoolean(bool: boolean){
        this.controller.autoplay_button.interactive = bool;
        this.controller.autoplay_button.buttonMode = bool;
        this.controller.info_button.interactive = bool;
        this.controller.info_button.buttonMode = bool;
        this.controller.menu_button.interactive = bool;
        this.controller.menu_button.buttonMode = bool;
    }

    private setTrueButtonsAfterSpin(){
        if(!this.autoplay){
            this.setButtonsBoolean(true)
        }
    }

    private createSlot(){
        this.slotgame = new Slot(this.app, this.updateBottomPayline.bind(this), this.updateBottomPayline2.bind(this), this.changeButton.bind(this), this.updateTopPayline.bind(this), this.setAutoSpinText.bind(this), this.updateBalanceDecrease.bind(this), this.setTrueButtonsAfterSpin.bind(this), this.updateBalanceIncrease.bind(this), this.bonusGame.bind(this));
        this.container.addChild(this.slotgame.container);
        
    }

    private updateBottomPayline(text: any){
        this.controller.paylinebottomcontainer.removeChildren();
        this.controller.paylinetext.text = text;
        this.controller.paylinebottomcontainer.addChild(this.controller.paylinetext);
        this.controller.paylinebottomcontainer.position.x = (this.controller.payline_box.width - this.controller.paylinebottomcontainer.width) / 2;
        this.controller.paylinebottomcontainer.position.y = ((this.controller.payline_box.height - this.controller.paylinebottomcontainer.height) / 2) + 20;
    }

    private updateTopPayline(text: any){
        this.controller.paylinetopcontainer.removeChildren();
        this.controller.tapspacetext.text = text;
        this.controller.paylinetopcontainer.addChild(this.controller.tapspacetext);
        this.controller.paylinetopcontainer.position.x = (this.controller.payline_box.width - this.controller.paylinetopcontainer.width) / 2;
        this.controller.paylinetopcontainer.position.y = 20;
    }

    private updateBottomPayline2(paylines_symbols: any, paylines_pay: any, pattern: any){
        this.controller.paylinetopcontainer.removeChildren();
        let posx = 0;
        const newcontainer = new PIXI.Container();
        paylines_symbols.forEach((element : any) => {
            element.width = Functions.scaleSizeFixedHeight(80, element)
            element.height = 80;
            element.position.x = posx;
            newcontainer.addChild(element);
            posx += (element.width + 1);
        });
        const newstyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.controller.paylinetopcontainer.addChild(newcontainer);
        let tmp = parseFloat(paylines_pay.toFixed(2));
        const newtext = new PIXI.Text(`LINE ${pattern} PAYS ${tmp}`, newstyle);
        this.controller.paylinetopcontainer.addChild(newtext);
        newtext.y = (this.controller.paylinetopcontainer.height - newtext.height) / 2;
        newtext.x = newcontainer.x + newcontainer.width + 5;
        
        this.controller.paylinetopcontainer.position.x = (this.controller.payline_box.width - this.controller.paylinetopcontainer.width) / 2;
        this.controller.paylinetopcontainer.position.y = 20;

    }

    private createBackground(){
        //background
        const top_bg = Functions.loadSprite(this.app.loader, 'spritesgamescene', 'gamebg.jpg', false);
        top_bg.width = this.app.screen.width;
        top_bg.height = this.app.screen.height;
        this.container.addChild(top_bg);

        //light rays
        this.lightrays = Functions.loadSprite(this.app.loader, 'top_rays', '', true);
        this.lightrays.width = this.app.screen.width;
        this.lightrays.animationSpeed = .2;
        this.lightrays.play();
        this.myAnimationsSprites.push(this.lightrays);
        this.container.addChild(this.lightrays);

        //boat
        this.boat = Functions.loadSprite(this.app.loader, 'boat', '', true);
        this.boat.animationSpeed = .2;
        this.boat.position.y = this.app.screen.height / 6;
        this.boat.position.x = (this.app.screen.width / 2) - (this.boat.width / 2);
        this.boat.play();
        this.myAnimationsSprites.push(this.boat);
        this.container.addChild(this.boat);

        //fishes
        this.fishcontainer = new PIXI.Container();
        this.createFishLeft();
        this.container.addChild(this.fishcontainer);
        
        //sand bg
        this.sandbg = Functions.loadSprite(this.app.loader, 'spritesgamescene', 'sand.png', false);
        this.sandbg.height = Functions.scaleSizeFixedWidth(this.app.screen.width, this.sandbg);
        this.sandbg.width = this.app.screen.width;
        this.sandbg.position.y = this.app.screen.height - this.sandbg.height
        this.container.addChild(this.sandbg);

        //sand refelction
        this.sandreflection = Functions.loadSprite(this.app.loader, 'sandreflection', '', true);
        this.sandreflection.height = Functions.scaleSizeFixedWidth(this.app.screen.width, this.sandreflection);
        this.sandreflection.width = this.app.screen.width;
        this.sandreflection.play();
        this.myAnimationsSprites.push(this.sandreflection);
        this.sandreflection.animationSpeed = .1;
        this.sandreflection.position.y = this.app.screen.height - this.sandreflection.height
        this.container.addChild(this.sandreflection);

        //star fish
        this.starfishanimated = Functions.loadSprite(this.app.loader, 'star_fish_animated', '', true);
        this.starfishanimated.animationSpeed = .15;
        this.starfishanimated.position.y = 900;
        this.starfishanimated.position.x = 800;
        this.starfishanimated.play();
        this.myAnimationsSprites.push(this.starfishanimated);
        this.container.addChild(this.starfishanimated);

        //corals
        this.createLeftCorals();
        this.createRightCorals();
    }

    private quickPlay(){
        if(!this.openmodal){
            if(this.autoplay){
                if(!this.slotgame.startreel){
                    this.autostop = true;
                }
                if(this.slotgame.enlargecharacters){
                    let popup = this.checkPopUp(this.slotgame.newtotal, this.controller.bet);
                    if(popup == 0 && !this.slotgame.isbonus){
                        this.autospin = true;
                    }
                    this.slotgame.enlarge.duration(.01);
                    this.slotgame.paylineanimation.forEach(element => {
                        element.duration(.01);
                        element.delay(.01);
                    });
                }
            }
            else{
                if(this.controller.bet <= this.controller.balance){
                    this.setButtonsBoolean(false);
                    if(!this.slotgame.startreel){
                        this.autostop = true;
                    }
                    if(this.slotgame.enlargecharacters){
                        let popup = this.checkPopUp(this.slotgame.newtotal, this.controller.bet);
                        if(popup == 0 && !this.slotgame.isbonus){
                            this.autospin = true;
                        }
                        this.slotgame.enlarge.duration(.01);
                        this.slotgame.paylineanimation.forEach(element => {
                            element.duration(.01);
                            element.delay(.01);
                        });
                    }
                    this.controller.singleplay_button.texture = this.stopbtn.texture;
                    this.slotgame.reelsAnimation(this.controller.bet, this.controller.modalautoplay.spintype);
                }
            }
        }
    }

    private bonusGame(arr1: any, arr2: any){
        this.stopMyanimations();
        this.openmodal = true;
        this.controller.mybuttons.forEach(element => {
            element.interactive = false;
            element.buttonMode = false;
        });
        this.createBubbles();
        this.animateBubbles();
        this.createBonus(arr1, arr2);
    }

    private createBonus(arr1: any, arr2: any){
        this.bonusComponets = new Bonus(this.app, arr1, arr2, this.container, this.bonusGameDone.bind(this));
        this.bonusComponets.container.alpha = 0;
        this.app.stage.addChild(this.bonusComponets.container);
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

        let transition = gsap.to(this.container, {
            alpha: 0,
            duration: 1.3,
            onComplete: () => {
                this.bubblesSprites.forEach((element, index) => {
                    let delay = .005 * index;
                    let gsapper = gsap.to(element, {
                        delay: delay,
                        duration: .05,
                        alpha: 0,
                        onStart: () => {
                            if(index == 0){
                                let transition2 = gsap.to(this.bonusComponets.container, {
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
                                this.protection = 0;
                                this.bubbles = [];
                                this.bubblesSprites = [];
                            }
                            gsapper.kill();
                        }
                    });
                });
                transition.kill();
            }
        });
    }

    private bonusGameDone(){
        this.startMyanimations();
        this.openmodal = false;
        this.controller.mybuttons.forEach(element => {
            element.interactive = true;
            element.buttonMode = true;
        });
    }

    private createFishLeft(){
        let fishes = [];
        while(fishes.length < 20){
            let fishsize = Math.round(Functions.getRandomInt(50, 80));
            var fish = {
                x: Math.round(Functions.getRandomInt(-(this.app.screen.width), -(fishsize))),
                y: Math.round(Functions.getRandomInt(0, this.app.screen.height)),
                size: fishsize
            }

            let overlapping = false;
            for(let j = 0; j < fishes.length; j++){
                let other = fishes[j];
                if (fish.x < other.x + other.size &&
                    fish.x + fish.size > other.x &&
                    fish.y < other.y + other.size &&
                    fish.size + fish.y > other.y) {
                    overlapping = true;
                    break;
                 }
            }

            if(!overlapping){
                fishes.push(fish);
            }
        }

        for(let i = 0; i < fishes.length; i++){
            const sprite = Functions.loadSprite(this.app.loader, 'spritesgamescene', 'bigfish.png', false);
            sprite.height =  Functions.scaleSizeFixedWidth(fishes[i].size, sprite);
            sprite.width = fishes[i].size;
            sprite.x = fishes[i].x;
            sprite.y = fishes[i].y;
            sprite.anchor.x = 1;
            sprite.scale.x *= -1;
            this.fishcontainer.addChild(sprite);

            let animation = gsap.to(sprite, {
                alpha: 0,
                duration: Math.round(Functions.getRandomInt(30, 50)),
                x: (this.app.screen.width + (this.app.screen.width / 2)) + sprite.width,
                onComplete: () => {
                    this.container.removeChild(sprite);
                    if(i == fishes.length - 1){
                        this.createFishRight();
                    }
                    animation.kill();
                }
            });
            this.myAnimationsGSAP.push(animation);
        }
    }

    private createFishRight(){
        let fishes = [];
        while(fishes.length < 20){
            let fishsize = Math.round(Functions.getRandomInt(50, 80));
            var fish = {
                x: Math.round(Functions.getRandomInt(this.app.screen.width + fishsize, this.app.screen.width * 2)),
                y: Math.round(Functions.getRandomInt(0, this.app.screen.height)),
                size: fishsize
            }

            let overlapping = false;
            for(let j = 0; j < fishes.length; j++){
                let other = fishes[j];
                if (fish.x < other.x + other.size &&
                    fish.x + fish.size > other.x &&
                    fish.y < other.y + other.size &&
                    fish.size + fish.y > other.y) {
                    overlapping = true;
                    break;
                 }
            }

            if(!overlapping){
                fishes.push(fish);
            }
        }

        for(let i = 0; i < fishes.length; i++){
            const sprite = Functions.loadSprite(this.app.loader, 'spritesgamescene', 'bigfish.png', false);
            sprite.height =  Functions.scaleSizeFixedWidth(fishes[i].size, sprite);
            sprite.width = fishes[i].size;
            sprite.x = fishes[i].x;
            sprite.y = fishes[i].y;
            this.fishcontainer.addChild(sprite);

            let animation = gsap.to(sprite, {
                alpha: 0,
                duration: Math.round(Functions.getRandomInt(30, 50)),
                x: sprite.width - (this.app.screen.width + (this.app.screen.width / 2)),
                onComplete: () => {
                    this.container.removeChild(sprite);
                    if(i == fishes.length - 1){
                        this.createFishLeft();
                    }
                    animation.kill();
                }
            });

            this.myAnimationsGSAP.push(animation);
        }
    }

    private createLeftCorals(){
        //static corals
        this.static_left_corals = Functions.loadSprite(this.app.loader, 'static_corals', 'Left_rock_corals.png', false);
        this.static_left_corals.y = 20;
        this.container.addChild(this.static_left_corals);
        //leaves left
        this.leaves_left = Functions.loadSprite(this.app.loader, 'leaves_left_animated', '', true);
        this.leaves_left.animationSpeed = .15;
        this.leaves_left.position.x = 280;
        this.leaves_left.position.y = 730;
        this.leaves_left.play();
        this.myAnimationsSprites.push(this.leaves_left);
        this.container.addChild(this.leaves_left);
        //stick leaves 2
        this.leftstickleaves2 = Functions.loadSprite(this.app.loader, 'leftstickleaves2', '', true);
        this.leftstickleaves2.animationSpeed = .15;
        this.leftstickleaves2.position.y = 530;
        this.leftstickleaves2.position.x = 20;
        this.leftstickleaves2.play();
        this.myAnimationsSprites.push(this.leftstickleaves2);
        this.container.addChild(this.leftstickleaves2);
        //stick leaves 1
        this.leftstickleaves1 = Functions.loadSprite(this.app.loader, 'leftstickleaves1', '', true);
        this.leftstickleaves1.animationSpeed = .15;
        this.leftstickleaves1.position.y = 630;
        this.leftstickleaves1.position.x = 220;
        this.leftstickleaves1.play();
        this.myAnimationsSprites.push(this.leftstickleaves1);
        this.container.addChild(this.leftstickleaves1);
        //left rock2
        this.leftrock2 = Functions.loadSprite(this.app.loader, 'static_rocks', 'Left_rock_2nd.png', false);
        this.leftrock2.position.y = 680;
        this.container.addChild(this.leftrock2);
        //left tube1
        this.lefttube1 = Functions.loadSprite(this.app.loader, 'static_rocks', 'Left_tube_coral_1.png', false);
        this.lefttube1.position.y = 730;
        this.lefttube1.position.x = 20;
        this.container.addChild(this.lefttube1);
        //left rock1
        this.leftrock1 = Functions.loadSprite(this.app.loader, 'static_rocks', 'Left_rock_front.png', false);
        this.leftrock1.position.x = -30;
        this.leftrock1.position.y = 870;
        this.container.addChild(this.leftrock1);
        //bubbles left
        this.bubblesleft = Functions.loadSprite(this.app.loader, 'bubblesleft', '', true);
        this.bubblesleft.animationSpeed = .1;
        this.bubblesleft.position.y = 350;
        this.bubblesleft.position.x = 20;
        this.bubblesleft.play();
        this.myAnimationsSprites.push(this.bubblesleft);
        this.container.addChild(this.bubblesleft);
    }

    private createRightCorals(){
        //stick leaves 2
        this.rightstickleaves2 = Functions.loadSprite(this.app.loader, 'rightstickleaves2', '', true);
        this.rightstickleaves2.animationSpeed = .15;
        this.rightstickleaves2.position.y = 620;
        this.rightstickleaves2.position.x = 1400;
        this.rightstickleaves2.play();
        this.myAnimationsSprites.push(this.rightstickleaves2);
        this.container.addChild(this.rightstickleaves2);
        //right rock1
        this.rightrock1 = Functions.loadSprite(this.app.loader, 'static_rocks', 'right_behind_rock.png', false);
        this.rightrock1.position.y = 700;
        this.rightrock1.position.x = 1400;
        this.container.addChild(this.rightrock1);
        //leaves right
        this.leaves_right = Functions.loadSprite(this.app.loader, 'leaves_right_animated', '', true);
        this.leaves_right.animationSpeed = .15;
        this.leaves_right.position.x = 1450;
        this.leaves_right.position.y = 690;
        this.leaves_right.play();
        this.myAnimationsSprites.push(this.leaves_right);
        this.container.addChild(this.leaves_right);
        //static corals
        this.static_right_corals = Functions.loadSprite(this.app.loader, 'static_corals', 'right_rock_corals.png', false);
        this.static_right_corals.y = 20;
        this.static_right_corals.x = this.app.stage.width - this.static_right_corals.width;
        this.container.addChild(this.static_right_corals);
        //green leave right 1
        this.green_leaves_right1 = Functions.loadSprite(this.app.loader, 'green_leaves_right', '', true);
        this.green_leaves_right1.animationSpeed = .15;
        this.green_leaves_right1.position.y = 770;
        this.green_leaves_right1.position.x = 1550;
        this.green_leaves_right1.play();
        this.myAnimationsSprites.push(this.green_leaves_right1);
        this.container.addChild(this.green_leaves_right1);
        //right rock2
        this.rightrock2 = Functions.loadSprite(this.app.loader, 'static_rocks', 'right_rock_front.png', false);
        this.rightrock2.position.y = 810;
        this.rightrock2.position.x = this.app.stage.width - this.rightrock2.width;
        this.container.addChild(this.rightrock2);
        //stick leaves 1
        this.rightstickleaves1 = Functions.loadSprite(this.app.loader, 'rightstickleaves1', '', true);
        this.rightstickleaves1.animationSpeed = .15;
        this.rightstickleaves1.position.y = 400;
        this.rightstickleaves1.position.x = 1670;
        this.rightstickleaves1.play();
        this.myAnimationsSprites.push(this.rightstickleaves1);
        this.container.addChild(this.rightstickleaves1);
        //right tube1
        this.righttube1 = Functions.loadSprite(this.app.loader, 'static_rocks', 'right_tube.png', false);
        this.righttube1.position.y = 485;
        this.righttube1.position.x = 1670;
        this.container.addChild(this.righttube1);
        //bubbles right
        this.bubblesright = Functions.loadSprite(this.app.loader, 'bubblesleft', '', true);
        this.bubblesright.animationSpeed = .1;
        this.bubblesright.position.y = 100;
        this.bubblesright.position.x = 1700;
        this.bubblesright.play();
        this.myAnimationsSprites.push(this.bubblesright);
        this.container.addChild(this.bubblesright);
        //blue coral
        this.bluecoral = Functions.loadSprite(this.app.loader, 'static_corals', 'right_coral_2.png', false);
        this.bluecoral.position.x = (this.app.screen.width - this.bluecoral.width);
        this.bluecoral.position.y = 610;
        this.container.addChild(this.bluecoral);
    }

    public stopMyanimations(){
        this.myAnimationsGSAP.forEach((element: any) => {
            element.pause();
        });
        this.myAnimationsSprites.forEach((element: any) => {
            element.gotoAndStop(0);
        });
    }

    public startMyanimations(){
        this.myAnimationsGSAP.forEach((element: any) => {
            element.play();
        });
        this.myAnimationsSprites.forEach((element: any) => {
            element.play();
        });
    }

    private changeButton(){
        if(!this.autoplay){
            this.controller.singleplay_button.texture = this.playbtn.texture;
        }
    }

    private setAutoPlay(number: number){
        if(this.controller.bet <= this.controller.balance){
            this.setButtonsBoolean(false);
            this.autoplay = true;
            this.controller.playtext.style.fill = '#FF0000';
            this.controller.singleplay_button.texture = this.stopbtn.texture;
            this.playcount = number;
        }
    }

    private setAutoSpinText(){
        if(this.autoplay){
            this.updateTopPayline(`AUTO SPIN LEFT ${this.playcount}`);
        }
        else{
            this.updateTopPayline('TAP SPACE TO SKIP ANIMATIONS');
        }
    }

    
    private playSlotAuto(){
        if(this.playcount > 0){
            this.slotgame.reelsAnimation(this.controller.bet, this.controller.modalautoplay.spintype);
        }
        else{
            this.stopAutoPlay();
        }
    }

    private stopAutoPlay(){
        this.playcount = 0;
        this.autoplay = false;
        this.controller.playtext.style.fill = '#FFFFFF';
        this.controller.singleplay_button.texture = this.playbtn.texture;
        this.setButtonsBoolean(true);
        this.updateTopPayline('TAP SPACE TO SKIP ANIMATIONS');
    }

    private updateBalanceDecrease(){
        let bet = this.controller.bet;
        let newbal = this.controller.balance - bet;
        this.playcount--;
        this.controller.balance = newbal;
        this.controller.balancevalue.text = Functions.formatNumber(newbal);
        this.controller.balancevalue.position.x = this.controller.balance_box.width - this.controller.balancevalue.width - 15;
        this.controller.balancevalue.position.y = (this.controller.balance_box.height - this.controller.balancevalue.height) / 2.8;
        if(bet > newbal){
            this.stopAutoPlay();
        }
    }

    private updateBalanceIncrease(win: number){
        let bet = this.controller.bet;
        let newbal = this.controller.balance + win;
        this.controller.balance = newbal;
        this.controller.balancevalue.text = Functions.formatNumber(newbal);
        this.controller.balancevalue.position.x = this.controller.balance_box.width - this.controller.balancevalue.width - 15;
        this.controller.balancevalue.position.y = (this.controller.balance_box.height - this.controller.balancevalue.height) / 2.8;
        let popup = this.checkPopUp(win, this.controller.bet);
        if(popup != 0){
            if(popup == 1){
                this.createNiceOne(win);
            }
            else if(popup == 2){
                this.createImpressive(win);
            }
            else{
                this.createExcellent(win);
            }
        }
    }

    private checkPopUp(win: number, bet: number){
        let ret = 0;
        if((win/bet) >= 5 && (win/bet) <= 10){
            //nice one
            ret = 1;
        }
        else if((win/bet) >= 11 && (win/bet) <= 20){
            //impressive
            ret = 2;
        }
        else if((win/bet) >= 21){
            //excellent win
            ret = 3;
        }
        else{
            ret = 0
        }
        return ret;
    }

    private allAnimations(){
        //single play auto stop
        if(this.autostop){
            let reel = this.slotgame.spinreel;
            if(reel.length == 5){
                this.autostop = false;
                this.startgame = false;
                if(this.slotgame.isbonus){
                    this.slotgame.reeleffectbgcontainer.forEach((element, index) => {
                        element.visible = false;
                        this.slotgame.bgeffect[index].gotoAndStop(0);
                        this.slotgame.lineeffect[index].gotoAndStop(0);
                    });
                }
                reel.forEach((element: any) => {
                    element.duration(.1);
                });
            }
        }

        if(this.autospin){
            if(this.slotgame.startreel){
                this.slotgame.reelsAnimation(this.controller.bet, this.controller.modalautoplay.spintype);
                this.autospin = false;
                this.autostop = false;
            }
        }

        if(this.autoplay){
            if(!this.openmodal){
                this.playSlotAuto();
            }
        }
        
    }
}

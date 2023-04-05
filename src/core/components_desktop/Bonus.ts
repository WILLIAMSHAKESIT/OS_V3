import * as PIXI from 'pixi.js';
import Functions from '../Functions';
import gsap from 'gsap';
import json from './slideshow2.json';

export default class Loader {
    private app:PIXI.Application;
    public container: PIXI.Container;
    private bonuscontainer: PIXI.Container;
    private cloudscontainer: PIXI.Container;
    private plantscontainer: PIXI.Container;
    private leftcontainer: PIXI.Container;
    private rightcontainer: PIXI.Container;
    private myAnimationsGSAP: any = [];
    private myAnimationsSprites: any = [];
    private palm1: PIXI.AnimatedSprite;
    private palm2: PIXI.AnimatedSprite;
    private palm4: PIXI.AnimatedSprite;
    private palm5: PIXI.AnimatedSprite;
    private treasuregrass: PIXI.AnimatedSprite;
    private grass1: PIXI.AnimatedSprite;
    private grass2: PIXI.AnimatedSprite;
    private finalsurface: PIXI.AnimatedSprite;
    private slideshowsprites: Array<PIXI.Sprite> = [];
    private homelogo: PIXI.AnimatedSprite;
    public homeplaybtn: PIXI.AnimatedSprite;
    public slideshow: Array<PIXI.Container> = [];
    public lastindex:number =  0;
    public slidetimer: number = 0;
    public playanimation: any;
    private clamSprite: Array<PIXI.Sprite> = [];
    private clamSpriteContainer: Array<PIXI.Container> = [];
    private clickCount: number = 3;
    private headerText: PIXI.Text;
    private bonusOffer: PIXI.Text;
    private btnAccept: PIXI.Sprite;
    private btnReject: PIXI.Sprite;
    private offer: number = 0;
    private min_index1: number = 0;
    private min_index2: number = 0;
    private min_index3: number = 0;
    private bonusgoldtexture: Array<PIXI.Texture> = [];
    private bonuswhitetexture: Array<PIXI.Texture> = [];
    private bonusblacktexture: Array<PIXI.Texture> = [];
    private bonusArr: Array<number> = [25,23,22,21,20,19,18,17,16];
    private bonusColorArr: Array<any> = [];
    private dontopenshell: Number = -1;
    private randomresult: any;
    private sortresult: any;
    private bubbles: Array<any> = [];
    private protection: number = 0;
    private bubblesSprites: Array<PIXI.Sprite> = [];
    private gamecontainer: PIXI.Container;
    private bonusgamedone: () => void;

    constructor(app: PIXI.Application,arr1: any, arr2: any, container: PIXI.Container, bonusgamedone: () => void) {
        this.app = app;
        this.container = new PIXI.Container();
        this.bonuscontainer = new PIXI.Container();
        this.cloudscontainer = new PIXI.Container();
        this.plantscontainer = new PIXI.Container();
        this.leftcontainer = new PIXI.Container();
        this.rightcontainer = new PIXI.Container();
        this.bonusArr.forEach(element => {
            this.bonusColorArr.push(Functions.loadSprite(this.app.loader, 'bonuswhite', '', true));
        });
        this.randomresult = arr1;
        this.sortresult = arr2;
        this.gamecontainer = container;
        this.bonusgamedone = bonusgamedone;
        this.bonusArr = [];
        this.bonusColorArr = [];
        this.bonusArr = this.randomresult;
        this.bonusArr.forEach(element => {
            this.bonusColorArr.push(Functions.loadSprite(this.app.loader, 'bonuswhite', '', true));
        });

        //get value
        const max_val = Math.max(...this.randomresult);
        const min_val1 = this.sortresult[0];
        const min_val2 = this.sortresult[1];
        const min_val3 = this.sortresult[2];
        //get indexes
        const max_index = this.randomresult.indexOf(max_val);
        this.min_index1 = this.randomresult.indexOf(min_val1);
        this.min_index2 = this.randomresult.indexOf(min_val2);
        this.min_index3 = this.randomresult.indexOf(min_val3);
        //set colors
        this.bonusColorArr[max_index] = Functions.loadSprite(this.app.loader, 'bonusgold', '', true);
        this.bonusColorArr[this.min_index1] = Functions.loadSprite(this.app.loader, 'bonusblack', '', true);
        this.bonusColorArr[this.min_index2] = Functions.loadSprite(this.app.loader, 'bonusblack', '', true);
        this.bonusColorArr[this.min_index3] = Functions.loadSprite(this.app.loader, 'bonusblack', '', true);
        this.init();
    }

    private init(){
        this.createBackground();
        this.createBonus();
    }

    private createBackground(){
        //background
        const top_bg = Functions.loadSprite(this.app.loader, 'top_assets', 'top_bg.png', false);
        top_bg.width = this.app.screen.width;
        top_bg.height = this.app.screen.height;
        this.container.addChild(top_bg);

        //clouds
        this.createClouds();
        this.container.addChild(this.cloudscontainer);

        //mountain
        const top_mountain = Functions.loadSprite(this.app.loader, 'top_assets', 'top_mountain.png', false);
        top_mountain.width = this.app.screen.width;
        top_mountain.height = this.app.screen.height;
        this.container.addChild(top_mountain);

        //final surface
        this.finalsurface = Functions.loadSprite(this.app.loader, 'finalsurface', '', true);
        this.finalsurface.width = this.app.screen.width;
        this.finalsurface.position.y = this.app.screen.height - (this.finalsurface.height / 2);
        this.finalsurface.animationSpeed = .18;
        this.finalsurface.play();
        this.container.addChild(this.finalsurface);
        this.myAnimationsSprites.push(this.finalsurface);

        //plants
        this.createPlants();
        this.container.addChild(this.plantscontainer);

    }

    private createClouds(){
        //left
        let animationArrayLeft = [];
        const cloud1 = Functions.loadSprite(this.app.loader, 'top_assets', 'clouds1.png', false);
        const cloudwidth1 = 600;
        cloud1.height = Functions.scaleSizeFixedWidth(cloudwidth1, cloud1);
        cloud1.width = cloudwidth1;
        cloud1.position.y = 50;
        cloud1.position.x = 150;
        this.cloudscontainer.addChild(cloud1);
        animationArrayLeft.push(cloud1);

        const cloud2 = Functions.loadSprite(this.app.loader, 'top_assets', 'clouds2.png', false);
        const cloudwidth2 = 350;
        cloud2.height = Functions.scaleSizeFixedWidth(cloudwidth2, cloud2);
        cloud2.width = cloudwidth2;
        cloud2.position.y = 250;
        cloud2.position.x = 700;
        this.cloudscontainer.addChild(cloud2);
        animationArrayLeft.push(cloud2);

        const cloud3 = Functions.loadSprite(this.app.loader, 'top_assets', 'clouds3.png', false);
        const cloudwidth3 = 850;
        cloud3.height = Functions.scaleSizeFixedWidth(cloudwidth3, cloud3);
        cloud3.width = cloudwidth3;
        cloud3.position.y = 350;
        cloud3.position.x = 300;
        this.cloudscontainer.addChild(cloud3);
        animationArrayLeft.push(cloud3);

        animationArrayLeft.forEach(element => {
            let gsapper = gsap.to(element, {
                duration: 30,
                yoyo: true,
                repeat: -1,
                x: (element.position.x) + 200
            });
            this.myAnimationsGSAP.push(gsapper);
        });

    }

    private createPlants(){
        this.palm1 = Functions.loadSprite(this.app.loader, 'palm1', '', true);
        this.palm2 = Functions.loadSprite(this.app.loader, 'palm2', '', true);
        this.palm5 = Functions.loadSprite(this.app.loader, 'palm5', '', true);
        this.palm4 = Functions.loadSprite(this.app.loader, 'palm4', '', true);
        this.treasuregrass = Functions.loadSprite(this.app.loader, 'treasuregrass', '', true);
        this.grass1 = Functions.loadSprite(this.app.loader, 'grass1', '', true);
        this.grass2 = Functions.loadSprite(this.app.loader, 'grass2', '', true);
        
        //palm1
        this.palm1.position.x = 550;
        this.palm1.position.y = 350;
        this.palm1.animationSpeed = .18;
        this.palm1.play();
        this.myAnimationsSprites.push(this.palm1);
        this.plantscontainer.addChild(this.palm1);
        //palm2
        this.palm2.position.x = 150;
        this.palm2.position.y = 480;
        this.palm2.animationSpeed = .18;
        this.palm2.play();
        this.myAnimationsSprites.push(this.palm2);
        this.plantscontainer.addChild(this.palm2);
        //palm4
        this.palm4.position.x = 380;
        this.palm4.position.y = 550;
        this.palm4.animationSpeed = .18;
        this.palm4.play();
        this.myAnimationsSprites.push(this.palm4);
        this.plantscontainer.addChild(this.palm4);
        //palm5
        this.palm5.position.x = 550;
        this.palm5.position.y = 530;
        this.palm5.animationSpeed = .18;
        this.palm5.play();
        this.myAnimationsSprites.push(this.palm5);
        this.plantscontainer.addChild(this.palm5);
        //treasuregrass
        this.treasuregrass.position.x = 850;
        this.treasuregrass.position.y = 680;
        this.treasuregrass.animationSpeed = .12;
        this.treasuregrass.play();
        this.myAnimationsSprites.push(this.treasuregrass);
        this.plantscontainer.addChild(this.treasuregrass);
        //grass1
        this.grass1.position.x = 550;
        this.grass1.position.y = 730;
        this.grass1.animationSpeed = .18;
        this.grass1.play();
        this.myAnimationsSprites.push(this.grass1);
        this.plantscontainer.addChild(this.grass1);
        //grass2
        this.grass2.position.x = 50;
        this.grass2.position.y = 740;
        this.grass2.animationSpeed = .18;
        this.grass2.play();
        this.myAnimationsSprites.push(this.grass2);
        this.plantscontainer.addChild(this.grass2);
    }

    private createBonus(){
        const bonusframe = Functions.loadSprite(this.app.loader, 'bonusgame', 'bonus_frame.png', false);
        this.homelogo = Functions.loadSprite(this.app.loader, 'homelogo', '', true);
        bonusframe.scale.set(1.5);
        this.bonuscontainer.addChild(bonusframe);
        this.bonuscontainer.addChild(this.homelogo);
        this.homelogo.x = (this.bonuscontainer.width - this.homelogo.width) / 2;
        bonusframe.y = this.homelogo.y + (this.homelogo.height / 2);
        this.container.addChild(this.bonuscontainer);

        const clamContainer = new PIXI.Container();
        //header
        let style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fill: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: 3
        });
        this.headerText = new PIXI.Text(`YOU HAVE ${this.clickCount} TRIES!`,style);
        this.headerText.position.x = (this.bonuscontainer.width / 2) - (this.headerText.width / 2);
        this.headerText.position.y = 285;
        this.bonuscontainer.addChild(this.headerText);
        //bonus offer
        let style2 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 30,
            fill: '#ffad4d',
            fontWeight: 'bold',
            letterSpacing: 1
        });
        let style3 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 50,
            fill: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: 3
        });
        const bonustext = new PIXI.Text('BONUS OFFER',style2);
        bonustext.position.x = (this.bonuscontainer.width / 2) - (bonustext.width / 2);
        bonustext.position.y = 840;
        this.bonuscontainer.addChild(bonustext);
        this.bonusOffer = new PIXI.Text('0.00',style3);
        this.bonusOffer.position.x = Math.round((this.bonuscontainer.width / 2) - (this.bonusOffer.width / 2));
        this.bonusOffer.position.y = Math.round((bonustext.position.y + bonustext.height));
        this.bonuscontainer.addChild(this.bonusOffer);
        //buttons
        this.btnAccept = Functions.loadSprite(this.app.loader, 'bonusgame', 'accept_button.png', false);
        this.btnAccept.scale.set(.9);
        this.btnAccept.alpha = 1;
        this.btnAccept.buttonMode = true;
        this.btnAccept.position.x = (this.bonusOffer.position.x - this.btnAccept.width) - 20;
        this.btnAccept.position.y = this.bonusOffer.position.y + 15;
        this.btnAccept.addListener("pointerdown", () => {
            let countdown = 3;
            for(let i = 0; i <= 3; i++){
                let animatecountdown = setInterval(() => {
                    if(countdown == 0){
                        this.updateHeaderText(`Let's check other shells!`);
                        this.btnReject.interactive = false;
                        this.btnAccept.interactive = false;
                        this.btnAccept.alpha = 0;
                        this.btnReject.alpha = 0;
                        // this.playSound(16);
                        this.clamSpriteContainer.forEach((element, index) => {
                            if(index != this.dontopenshell){
                                const clamVibrate = gsap.to(this.clamSprite[index], {
                                    rotation: -10 * Math.PI / 180,
                                    duration: 0.1,
                                    repeat: 3,
                                    ease: 'none',
                                    onComplete: () => {
                                        this.clamSprite[index].alpha = .5;
                                        this.clamSprite[index].rotation = 0 * Math.PI / 180;
                                        let img = this.bonusColorArr[index];
                                        img.animationSpeed = .2;
                                        img.position.x = this.clamSprite[index].position.x;
                                        img.position.y = this.clamSprite[index].position.y;
                                        img.width = this.clamSprite[index].width;
                                        img.height = this.clamSprite[index].height + 20;
                                        img.alpha = .5;
                                        element.removeChild(this.clamSprite[index])
                                        element.addChild(img);
                                        img.play();
                                        this.createDisplayValue(element, this.bonusArr[index]);
                                        let alphashell = setTimeout(() => {
                                            img.alpha = 1;
                                            this.clamSprite[index].alpha = 1;
                                            clearTimeout(alphashell);
                                        }, 3500)
                                        clamVibrate.kill();
                                    }
                                })
                            }
                        });
                        let showgame = setTimeout(() => {
                            this.clamSpriteContainer.forEach(element => {
                                element.removeChildren();
                            });
                            this.clamSpriteContainer.forEach((element, index) => {
                                element.addChild(this.clamSprite[index]);
                            });
                            this.clickCount = 3;
                            this.clamSprite.forEach(element => {
                                element.interactive = true;
                            });
                            this.updateHeaderText();
                            this.updateOfferText('0.00');
                            this.createBubbles();
                            this.animateBubbles();
                            clearTimeout(showgame);
                        }, 4000)
                    }
                    else{
                        this.updateHeaderText(`Other Clams Will Open in  ${countdown}`);
                    }
                    countdown--;
                    clearInterval(animatecountdown)
                }, i * 1000)
            }
        });
        this.bonuscontainer.addChild(this.btnAccept);
        this.btnReject = Functions.loadSprite(this.app.loader, 'bonusgame', 'reject_button.png', false);
        this.btnReject.scale.set(.9);
        this.btnReject.alpha = 1;
        this.btnReject.buttonMode = true;
        this.btnReject.position.y = this.bonusOffer.position.y + 15;
        this.btnReject.position.x = this.bonusOffer.position.x + this.bonusOffer.width + 20;
        this.btnReject.addListener("pointerdown", () => {
            this.clamSprite.forEach(element => {
                element.interactive = true;
            });
            this.btnReject.interactive = false;
            this.btnAccept.interactive = false;
            this.btnAccept.alpha = 0;
            this.btnReject.alpha = 0;
            this.updateHeaderText();
        });
        this.bonuscontainer.addChild(this.btnReject);

        let posx = 0;
        let posy = 80;
        let spacingy = 55;
        let spacingx = 110;
        for(let i = 0 ; i < 9; i++){
            const container = new PIXI.Container();
            const clamsprite = Functions.loadSprite(this.app.loader, 'bonusgame', 'close_clam.png', false);
            clamsprite.interactive = true;
            clamsprite.buttonMode = true;
            if(i % 3 == 0 && i != 0){
                posx = 0;
                posy += clamsprite.height + spacingy;
            }
            container.position.x = posx;
            container.position.y = posy;
            this.clamSprite.push(clamsprite);
            this.clamSpriteContainer.push(container);
            container.addChild(clamsprite);
            clamContainer.addChild(container);
            posx += clamsprite.width + spacingx;
        }
        this.bonuscontainer.addChild(clamContainer);
        clamContainer.x = (this.bonuscontainer.width - clamContainer.width) / 2;
        clamContainer.y = (this.bonuscontainer.height - clamContainer.height) / 2;

        this.clamSpriteContainer.forEach((element, index) => {
            this.clamSprite[index].addListener("pointerdown", () => {
                // this.playSound(16)
                this.clamSprite.forEach(element => {
                    element.interactive = false;
                });
                this.dontopenshell = index;
                this.clamSprite[index].rotation = 10 * Math.PI / 180;
                const clamVibrate = gsap.to(this.clamSprite[index], {
                    rotation: -10 * Math.PI / 180,
                    duration: 0.1,
                    repeat: 3,
                    ease: 'none',
                    onComplete: () => {
                        this.clickCount -= 1;
                        this.btnAccept.alpha = 1;
                        this.btnReject.alpha = 1;
                        this.btnAccept.interactive = true;
                        if(index == this.min_index1 || index == this.min_index2 || index == this.min_index3){
                            this.updateHeaderText('YOU CHOOSE A BOMB SHELL!');
                            // this.playSound(18)
                        }
                        else{
                            // this.playSound(17)
                            if(this.clickCount == 0){
                                this.updateHeaderText('YOU ALREADY USED THE 3 CLICK!');
                            }
                            else{
                                this.btnReject.interactive = true;
                                this.updateHeaderText('ACCEPT OR REJECT BONUS OFFER');
                            }
                        }
                        this.offer = this.bonusArr[index];
                        this.updateOfferText();
                        this.clamSprite[index].rotation = 0 * Math.PI / 180;
                        let img = this.bonusColorArr[index];
                        img.animationSpeed = .2;
                        img.position.x = this.clamSprite[index].position.x;
                        img.position.y = this.clamSprite[index].position.y;
                        img.width = this.clamSprite[index].width;
                        img.height = this.clamSprite[index].height + 20;
                        element.removeChild(this.clamSprite[index])
                        element.addChild(img);
                        img.play();
                        this.createDisplayValue(element, this.bonusArr[index]);
                        clamVibrate.kill();
                    }
                })
            })
        });

        this.bonuscontainer.x = (this.app.screen.width - this.bonuscontainer.width) / 2;
        this.bonuscontainer.y = (this.app.screen.height - this.bonuscontainer.height) / 2;
    }

    private updateHeaderText(text: any = `YOU HAVE ${this.clickCount} TRIES LEFT`){
        this.headerText.text = text;
        this.headerText.position.x = (this.bonuscontainer.width / 2) - (this.headerText.width / 2);
    }

    private updateOfferText(text: any = `${this.offer}.00`){
        this.bonusOffer.text = text;
        this.bonusOffer.position.x = (this.bonuscontainer.width / 2) - (this.bonusOffer.width / 2);
        this.btnAccept.position.x = (this.bonusOffer.position.x - this.btnAccept.width) - 20;
        this.btnReject.position.x = this.bonusOffer.position.x + this.bonusOffer.width + 20;
    }

    private createDisplayValue(container: PIXI.Container, value: any) {
        let style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 25,
            fill: '#ffffff',
            fontWeight: 'bold',
            stroke: "#00000080",
            strokeThickness: 5,
            letterSpacing: 3,
            dropShadow: true,
            dropShadowAlpha: 0.5,
            dropShadowDistance: 0,
            dropShadowBlur: 3
        });

        const textValue = new PIXI.Text(value, style);
        textValue.position.x =  (container.width / 2) - (textValue.width / 2);
        textValue.position.y = 50;

        container.addChild(textValue);
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
                this.app.stage.removeChild(this.container);
                this.bubblesSprites.forEach((element, index) => {
                    let delay = .005 * index;
                    let gsapper = gsap.to(element, {
                        delay: delay,
                        duration: .05,
                        alpha: 0,
                        onStart: () => {
                            if(index == 0){
                                let transition2 = gsap.to(this.gamecontainer, {
                                    alpha: 1,
                                    duration: 1.5,
                                    onComplete: () => {
                                        this.bonusgamedone();
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
                transition.kill();
            }
        });
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
}

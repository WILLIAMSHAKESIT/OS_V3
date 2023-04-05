import * as PIXI from 'pixi.js';
import Functions from '../Functions';
import gsap from 'gsap';
import json from './slideshow2.json';

export default class Loader {
    private screenSettings: any;
    private app:PIXI.Application;
    public container: PIXI.Container;
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
    private top_bg:PIXI.Sprite
    private top_mountain:PIXI.Sprite

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        this.cloudscontainer = new PIXI.Container();
        this.plantscontainer = new PIXI.Container();
        this.leftcontainer = new PIXI.Container();
        this.rightcontainer = new PIXI.Container();
        this.init();
    }

    private init(){
        this.createBackground();
        window.addEventListener('resize',()=>{
            this.screenSize()

           
        })
        this.screenSize();
    }

    private screenSize(){
        this.screenSettings = Functions.screenSize();
        let baseposy = (this.screenSettings.game.height - this.screenSettings.game.safeHeight);
        let baseposx = (this.screenSettings.game.width - this.screenSettings.game.safeWidth);
        this.homelogo.scale.set(1.5)
        this.leftcontainer.scale.set(1.3)
        if(this.screenSettings.screentype == "landscape"){
            //palm5
            this.palm5.position.x = 400;
            this.palm5.position.y = 900;
            //palm4
            this.palm4.position.x = 50;
            this.palm4.position.y = this.palm5.position.y;
            // //palm1
            this.palm1.position.x = 800;
            this.palm1.position.y = 800;
            // //palm2
            this.palm2.position.x = 600;
            this.palm2.position.y = 850;
            // //treasuregrass
            this.treasuregrass.position.x = this.palm1.x + 280;
            this.treasuregrass.position.y = 1150;
            // //grass1
            this.grass1.position.x = 800;
            this.grass1.position.y = 1180;
            // //grass2
            this.grass2.position.x = 250;
            this.grass2.position.y = 1000;
            //left side
            this.leftcontainer.position.x = (this.screenSettings.baseWidth / 4)  - (this.leftcontainer.width / 2) + (baseposx / 2);
            this.leftcontainer.position.y = (this.screenSettings.baseHeight - this.leftcontainer.height) / 2;

            //right side
            this.rightcontainer.position.x = (this.screenSettings.baseWidth / 2) + ((this.screenSettings.baseWidth / 4) - (this.rightcontainer.width / 2));
            this.rightcontainer.position.y = (this.screenSettings.baseHeight - this.leftcontainer.height) / 2;
            this.homelogo.position.y = 0;
            this.homeplaybtn.position.y = 800;
            this.top_mountain.width = this.app.screen.width;
            this.top_bg.width = this.app.screen.width;
        }else{
            //palm5
            this.palm5.position.x = 400;
            this.palm5.position.y = 1300;
            //palm4
            this.palm4.position.x = 20;
            this.palm4.position.y = 1000;
            // //palm1
            this.palm1.position.x = 700;
            this.palm1.position.y = 800;
            // //palm2
            this.palm2.position.x = this.palm4.position.x + 50;
            this.palm2.position.y = this.palm4.position.y - 20;
            // //treasuregrass
            this.treasuregrass.position.x = this.palm1.x + 280;
            this.treasuregrass.position.y = this.palm1.y + 380;
            // //grass2
            this.grass2.position.x = 400;
            this.grass2.position.y = 1200;
            // //grass1
            this.grass1.position.x = 450;
            this.grass1.position.y = 1300;
            //left side
            this.leftcontainer.position.x = (this.screenSettings.baseWidth - this.leftcontainer.width) / 2;
            this.leftcontainer.position.y = (this.screenSettings.baseHeight - this.leftcontainer.height) / 2;

            //right side
            this.rightcontainer.position.x = (this.screenSettings.baseWidth - this.rightcontainer.width) / 2;
            this.rightcontainer.position.y = (this.screenSettings.baseHeight - this.rightcontainer.width) / 2;
            this.homelogo.position.y = -600;
            this.homeplaybtn.position.y = 1100;
            this.finalsurface.position.y = (this.screenSettings.baseHeight / 2) + 180;
        }
        this.top_bg.height = this.app.screen.height;
        this.finalsurface.height = 400
        this.homeplaybtn.position.x = (this.rightcontainer.width / 2);
        this.finalsurface.width = this.screenSettings.baseWidth
        this.top_mountain.width =2600;
  
       
       console.log(this.app.screen.width)

    }

    private createBackground(){
        //background
        this.top_bg = Functions.loadSprite(this.app.loader, 'top_assets', 'top_bg.png', false);
        this.top_bg.width = this.app.screen.width;
        this.container.addChild(this.top_bg);

        //clouds
        this.createClouds();
        this.container.addChild(this.cloudscontainer);

        //mountain
        this.top_mountain = Functions.loadSprite(this.app.loader, 'top_assets', 'top_mountain.png', false);
        this.top_mountain.width = this.app.screen.width;
        this.top_mountain.height = 1600;
        
        this.container.addChild(this.top_mountain);

        //final surface
        this.finalsurface = Functions.loadSprite(this.app.loader, 'finalsurface', '', true);
        this.finalsurface.width = this.app.screen.width;
        this.finalsurface.position.y = this.app.screen.height - (this.finalsurface.height / 2) - 40;
        this.finalsurface.animationSpeed = .18;
        this.finalsurface.play();
        this.container.addChild(this.finalsurface);
        this.myAnimationsSprites.push(this.finalsurface);

        //plants
        this.createPlants();
        this.container.addChild(this.plantscontainer);

        //home screen
        this.createHomeScreen();
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
        //palm5
        this.palm5 =  Functions.loadSprite(this.app.loader, 'palm5', '', true);
        this.palm5.animationSpeed = .18;
        this.palm5.play();
        this.plantscontainer.addChild(this.palm5);
        //palm4
        this.palm4 =  Functions.loadSprite(this.app.loader, 'palm4', '', true);
        this.palm4.animationSpeed = .18;
        this.palm4.play();
        this.plantscontainer.addChild(this.palm4);
        //palm1
        this.palm1 =  Functions.loadSprite(this.app.loader, 'palm1', '', true);
        this.palm1.animationSpeed = .18;
        this.palm1.play();
        this.plantscontainer.addChild(this.palm1);
        //palm2
        this.palm2 =  Functions.loadSprite(this.app.loader, 'palm2', '', true);
        this.palm2.animationSpeed = .18;
        this.palm2.play();
        this.plantscontainer.addChild(this.palm2);
        //treasuregrass
        this.treasuregrass =  Functions.loadSprite(this.app.loader, 'treasuregrass', '', true);
        this.treasuregrass.animationSpeed = .12;
        this.treasuregrass.play();
        this.plantscontainer.addChild(this.treasuregrass);
        //grass1
        this.grass1 =  Functions.loadSprite(this.app.loader, 'grass1', '', true);
        this.grass1.animationSpeed = .18;
        this.grass1.play();
        this.plantscontainer.addChild(this.grass1);
        //grass2
        this.grass2 =  Functions.loadSprite(this.app.loader, 'grass2', '', true);
        this.grass2.animationSpeed = .18;
        this.grass2.play();
        this.plantscontainer.addChild(this.grass2);
    }

    private createHomeScreen(){
        this.createLeftSide();
        this.createRightSide();
    }

    private createRightSide(){
        this.homelogo = Functions.loadSprite(this.app.loader, 'homelogo', '', true);
        this.homeplaybtn = Functions.loadSprite(this.app.loader, 'homeplaybtn', '', true);

        const leftwidth = this.app.screen.width * .5;
        const width = this.app.screen.width * .5;

        //home logo
        this.homelogo.animationSpeed = .2;
        this.homelogo.play();
        this.myAnimationsSprites.push(this.homelogo);
        this.rightcontainer.addChild(this.homelogo);

        //home playbutton
        this.homeplaybtn.animationSpeed = .18;
        this.homeplaybtn.anchor.set(.5);
        this.homeplaybtn.play();
        this.homeplaybtn.scale.set(1.5)
        this.homeplaybtn.interactive = true;
        this.homeplaybtn.buttonMode = true;
        this.homeplaybtn.position.y = this.homelogo.position.y + this.homelogo.height + (this.homeplaybtn.height / 1);
        this.rightcontainer.addChild(this.homeplaybtn);
        this.playanimation = gsap.to(this.homeplaybtn, {
            width: 220,
            height: 220,
            duration: 1,
            yoyo: true,
            repeat: -1
        });

        this.homeplaybtn.addListener("mouseover", () => {
            this.playanimation.pause();
        })
        this.homeplaybtn.addListener("mouseout", () => {
            this.playanimation.play();
        })
        this.myAnimationsSprites.push(this.homeplaybtn);
        this.myAnimationsGSAP.push(this.playanimation);
        this.container.addChild(this.rightcontainer);
        this.rightcontainer.position.x = (leftwidth + (width / 2)) - (this.rightcontainer.width / 2);
        this.rightcontainer.position.y = (this.app.screen.height / 2) - (this.rightcontainer.height / 2);
    }

    private createLeftSide(){
        this.slideshowsprites.push(Functions.loadSprite(this.app.loader, 'top_assets', 'first_slide.png', false));
        this.slideshowsprites.push(Functions.loadSprite(this.app.loader, 'top_assets', 'second_slide.png', false));

        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            dropShadow: true,
            dropShadowAlpha: 0.8,
            dropShadowAngle: 2.1,
            dropShadowBlur: 2,
            dropShadowColor: '0x111111',
            dropShadowDistance: 3,
            fill: ['#FFE850', '#D5A300', '#AC8F00'],
            stroke: '#000',
            fontSize: 40,
            fontWeight: 'lighter',
            lineJoin: 'round',
            strokeThickness: 5
        });

        const width = this.app.screen.width * .5;
        json.SlideShow.forEach((element : any, index) => {
            const container = new PIXI.Container;
            const sprite = this.slideshowsprites[index];
            const text = new PIXI.Text(element.description, style);
            container.addChild(sprite);
            container.addChild(text);
            container.alpha = element.alpha;
            text.position.y = sprite.height;
            text.position.x = (container.width / 2) - (text.width / 2);
            this.leftcontainer.addChild(container);
            this.slideshow.push(container);
        });
        this.container.addChild(this.leftcontainer);
        this.leftcontainer.position.y = (this.app.screen.height / 2) - (this.leftcontainer.height / 2);
        this.leftcontainer.position.x = (width / 2) - (this.leftcontainer.width / 2);
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

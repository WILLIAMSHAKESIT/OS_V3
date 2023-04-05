import * as PIXI from 'pixi.js';
import Functions from '../Functions';
import FontFaceObserver from 'fontfaceobserver';
var fontA = new FontFaceObserver('Luckiest Guy');
var fontB = new FontFaceObserver('Montserrat');
import {Howl} from 'howler';

export default class Loader {
    public loader: PIXI.Loader;
    private app:PIXI.Application;
    private screenSettings: any;
    private background:PIXI.Sprite;
    private titleImage:PIXI.Sprite;
    private loadingFrame:PIXI.Sprite;
    private loadingFrameWidth: number = 250;
    private loadingFrameHeight: number = 30;
    private loadingFramePosY: number = 0;
    private loadingBar:PIXI.Sprite;
    private loadingText:PIXI.Text;
    private loadingBorder:PIXI.Sprite;
    private agaLogo:PIXI.Sprite;
    private soundQuestion:PIXI.Text;
    private soundOn:PIXI.Sprite;
    private soundOff:PIXI.Sprite;
    private onAssetsLoaded: () => void;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
        this.loader = app.loader;
        this.app = app;
        this.onAssetsLoaded = onAssetsLoaded;
        Promise.all([fontA.load(), fontB.load()]).then(this.startGame.bind(this));
    }

    private startGame(){
        //add sprites
        this.background = PIXI.Sprite.from('assets/desktop/loading/ls_background.jpg');
        this.titleImage = PIXI.Sprite.from('assets/desktop/loading/title.png');
        this.loadingFrame = PIXI.Sprite.from('assets/desktop/loading/loading_frame.png');
        this.loadingBar = PIXI.Sprite.from('assets/desktop/loading/loading_bar.png');
        this.loadingBar.width = 15;
        this.titleImage.anchor.set(0.5);
        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        this.loadingText = new PIXI.Text('Loading...', style);
        this.loadingText.anchor.set(0.5);
        this.loadingBorder = PIXI.Sprite.from('assets/desktop/loading/loading_border.png');
        this.loadingBorder.anchor.set(0.5);
        this.agaLogo = PIXI.Sprite.from('assets/desktop/loading/aga_logo.png');
        this.agaLogo.anchor.set(0.5);
        this.soundQuestion = new PIXI.Text('Do you wanna play with sound?', style);
        this.soundQuestion.anchor.set(0.5);
        this.soundOn = PIXI.Sprite.from('assets/desktop/loading/sound_on.png');
        this.soundOn.anchor.set(0.5);
        this.soundOn.buttonMode = true;
        this.soundOn.interactive = true;
        this.soundOff = PIXI.Sprite.from('assets/desktop/loading/sound_off.png');
        this.soundOff.anchor.set(0.5);
        this.soundOff.buttonMode = true;
        this.soundOff.interactive = true;
        this.generateLoadingScreen();
        this.screenSize();
        this.loadAssets();
        this.loader.onProgress.add(() => {
            if(this.loadingBar.width < this.loadingFrameWidth)
                this.loadingBar.width += 5;
        });
        this.loader.load(() => {
            this.loadingBar.width = this.loadingFrameWidth;
            this.app.stage.removeChild(this.loadingBar,this.loadingFrame,this.loadingBorder, this.loadingText);
            this.soundPrompt()
        });
    }

    private screenSize(){
        //background image
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;

        //title image
        // this.titleImage.width = 1000;
        // this.titleImage.height = 600;
        this.titleImage.x = (this.app.screen.width / 2);
        this.titleImage.y = (this.app.screen.height / 3);

        //loading frame
        this.loadingFrame.width = this.loadingFrameWidth;
        this.loadingFrame.height = this.loadingFrameHeight;
        this.loadingFrame.x = (this.app.screen.width / 2) - (this.loadingFrame.width / 2);
        this.loadingFrame.y = (this.app.screen.height / 2.2);

        //loading bar
        this.loadingBar.height = this.loadingFrameHeight;
        this.loadingBar.x = this.loadingFrame.x;
        this.loadingBar.y = this.loadingFrame.y;

        //loading text
        this.loadingText.x = (this.app.screen.width / 2);
        this.loadingText.y = this.loadingFrame.y + (this.loadingText.height / 2) + 2;

        //loading border
        this.loadingBorder.width = this.loadingFrameWidth + 15;
        this.loadingBorder.height = this.loadingFrameHeight + 15;
        this.loadingBorder.x = (this.app.screen.width / 2);
        this.loadingBorder.y = this.loadingFrame.y + 20;

        //aga Logo
        this.agaLogo.x = (this.app.screen.width / 2)
        this.agaLogo.y = (this.app.screen.height - (100));

        //loading quiestion
        this.soundQuestion.x = (this.app.screen.width / 2);
        this.soundQuestion.y = this.loadingBorder.y;    

        //sound on
        this.soundOn.x = (this.app.screen.width / 2) - 70;
        this.soundOn.y = this.soundQuestion.y + this.soundQuestion.height + 20;

        //sound off
        this.soundOff.x = (this.app.screen.width / 2) + 70;
        this.soundOff.y = this.soundQuestion.y + this.soundQuestion.height + 20;
    }

    private generateLoadingScreen(){
        //background
        this.app.stage.addChild(this.background);
        //title image
        this.app.stage.addChild(this.titleImage);
        //loading frame
        this.app.stage.addChild(this.loadingFrame);
        //loading bar
        this.app.stage.addChild(this.loadingBar);
        //loading text
        this.app.stage.addChild(this.loadingText);
        //loading border
        this.app.stage.addChild(this.loadingBorder);
        //aga logo
        this.app.stage.addChild(this.agaLogo);
    }

    private soundPrompt(){
        //loading question
        this.app.stage.addChild(this.soundQuestion);
        //sound on
        this.app.stage.addChild(this.soundOn);
        //sound off
        this.app.stage.addChild(this.soundOff);

        this.soundOn.on('pointerdown',() =>{
            this.app.stage.removeChild(this.titleImage,this.agaLogo, this.loadingText, this.soundOff,this.soundOn,this.soundQuestion,this.background);
            this.onAssetsLoaded();
        });
        this.soundOff.on('pointerdown',() =>{
            this.app.stage.removeChild(this.titleImage,this.agaLogo, this.loadingText, this.soundOff,this.soundOn,this.soundQuestion,this.background);
            this.onAssetsLoaded();
        });
    }

    private loadAssets() {
        PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
        //home
        this.loader.add('top_assets', 'assets/desktop/home/spritesheets/top_assets.json');
        this.loader.add('palm1', 'assets/desktop/home/spritesheets/palm1.json');
        this.loader.add('palm2', 'assets/desktop/home/spritesheets/palm2.json');
        this.loader.add('palm4', 'assets/desktop/home/spritesheets/palm4.json');
        this.loader.add('palm5', 'assets/desktop/home/spritesheets/palm5.json');
        this.loader.add('grass1', 'assets/desktop/home/spritesheets/grass1.json');
        this.loader.add('grass2', 'assets/desktop/home/spritesheets/grass2.json');
        this.loader.add('treasuregrass', 'assets/desktop/home/spritesheets/treasuregrass.json');
        this.loader.add('finalsurface', 'assets/desktop/home/spritesheets/finalsurface.json');
        this.loader.add('homelogo', 'assets/desktop/home/spritesheets/homelogo.json');
        this.loader.add('homeplaybtn', 'assets/desktop/home/spritesheets/homeplaybtn.json');
        //scene
        this.loader.add('spritesgamescene', 'assets/desktop/scene/spritesheets/spritesgamescene.json');
        this.loader.add('top_rays', 'assets/desktop/scene/spritesheets/top_rays.json');
        this.loader.add('boat', 'assets/desktop/scene/spritesheets/boat.json');
        this.loader.add('sandreflection', 'assets/desktop/scene/spritesheets/sandreflection.json');
        this.loader.add('star_fish_animated', 'assets/desktop/scene/spritesheets/star_fish_animated.json');
        this.loader.add('static_corals', 'assets/desktop/scene/spritesheets/static_corals.json');
        this.loader.add('static_rocks', 'assets/desktop/scene/spritesheets/static_rocks.json');
        this.loader.add('leaves_left_animated', 'assets/desktop/scene/spritesheets/leaves_left_animated.json');
        this.loader.add('leaves_right_animated', 'assets/desktop/scene/spritesheets/leaves_right_animated.json');
        this.loader.add('green_leaves_left', 'assets/desktop/scene/spritesheets/green_leaves_left.json');
        this.loader.add('green_leaves_right', 'assets/desktop/scene/spritesheets/green_leaves_right.json');
        this.loader.add('leftstickleaves1', 'assets/desktop/scene/spritesheets/leftstickleaves1.json');
        this.loader.add('leftstickleaves2', 'assets/desktop/scene/spritesheets/leftstickleaves2.json');
        this.loader.add('rightstickleaves1', 'assets/desktop/scene/spritesheets/rightstickleaves1.json');
        this.loader.add('rightstickleaves2', 'assets/desktop/scene/spritesheets/rightstickleaves2.json');
        this.loader.add('bubblesleft', 'assets/desktop/scene/spritesheets/bubblesleft.json');
        //slot
        this.loader.add('my_slots', 'assets/desktop/slots/spritesheets/my_slots.json');
        this.loader.add('my_slot_controllers', 'assets/desktop/slots/spritesheets/my_slot_controllers.json');
        this.loader.add('controllers', 'assets/desktop/slots/spritesheets/controllers.json');
        this.loader.add('slot_letter_a', 'assets/desktop/slots/spritesheets/slot_letter_a.json');
        this.loader.add('slot_letter_j', 'assets/desktop/slots/spritesheets/slot_letter_j.json');
        this.loader.add('slot_letter_k', 'assets/desktop/slots/spritesheets/slot_letter_k.json');
        this.loader.add('slot_bonus', 'assets/desktop/slots/spritesheets/slot_bonus.json');
        this.loader.add('slot_mega', 'assets/desktop/slots/spritesheets/slot_mega.json');
        this.loader.add('slot_wild', 'assets/desktop/slots/spritesheets/slot_wild.json');
        this.loader.add('slot_turtle', 'assets/desktop/slots/spritesheets/slot_turtle.json');
        this.loader.add('slot_sea_horse', 'assets/desktop/slots/spritesheets/slot_sea_horse.json');
        this.loader.add('slot_penguin', 'assets/desktop/slots/spritesheets/slot_penguin.json');
        this.loader.add('slot_octopus', 'assets/desktop/slots/spritesheets/slot_octopus.json');
        this.loader.add('slot_walrus', 'assets/desktop/slots/spritesheets/slot_walrus.json');
        this.loader.add('payline_1', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_1.json');
        this.loader.add('payline_2', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_2.json');
        this.loader.add('payline_3', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_3.json');
        this.loader.add('payline_4', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_4.json');
        this.loader.add('payline_5', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_5.json');
        this.loader.add('payline_6', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_6.json');
        this.loader.add('payline_7', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_7.json');
        this.loader.add('payline_8', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_8.json');
        this.loader.add('payline_9', 'assets/desktop/slots/spritesheets/mobilepaylines/payline_9.json');
        this.loader.add('reeleffectbg', 'assets/desktop/slots/spritesheets/reeleffectbg.json');
        this.loader.add('reeleffectlines', 'assets/desktop/slots/spritesheets/reeleffectlines.json');
        //popups
        this.loader.add('Excellent', 'assets/desktop/popups/spritesheets/Excellent.json');
        this.loader.add('Nice1', 'assets/desktop/popups/spritesheets/Nice1.json');
        this.loader.add('Impressive', 'assets/desktop/popups/spritesheets/Impressive.json');
        this.loader.add('coin', 'assets/desktop/popups/spritesheets/coin.json');
        //bonus
        this.loader.add('bonusgame', 'assets/desktop/bonus/spritesheets/bonus.json');
        this.loader.add('bonusgold', 'assets/desktop/bonus/spritesheets/bonusgold.json');
        this.loader.add('bonuswhite', 'assets/desktop/bonus/spritesheets/bonuswhite.json');
        this.loader.add('bonusblack', 'assets/desktop/bonus/spritesheets/bonusblack.json');
        //new
        this.loader.add('new_controllers', 'assets/desktop/slots/spritesheets/new_controllers.json');
    }
}

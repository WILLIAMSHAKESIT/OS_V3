import * as PIXI from 'pixi.js';
import Functions from '../../Functions';
import ModalMenu from './ModalMenu';
import ModalInfo from './ModalInfo';
import ModalAutoplay from './ModalAutoplay';

export default class Controller {
    private app: PIXI.Application;
    public container: PIXI.Container;
    public containerPortrait:PIXI.Container
    public play_container: PIXI.Container;
    private controller_parent: PIXI.Sprite;
    public controller_parent_portrait: PIXI.Sprite;
    public info_button: PIXI.Sprite;
    public info_button_portrait: PIXI.Sprite;
    public sound_button: PIXI.Sprite;
    public menu_button: PIXI.Sprite;
    public menu_button_Portrait: PIXI.Sprite;
    public singleplay_button: PIXI.Sprite;
    public autoplay_button: PIXI.Sprite;
    private bet_box: PIXI.Container;
    public balance_box: PIXI.Container;
    public payline_box: PIXI.Container;
    public playtext: PIXI.Text;
    public tapspacetext: PIXI.Text;
    public paylinetext: PIXI.Text;
    public betContainer:PIXI.Sprite 
    public creditContainer:PIXI.Sprite 
    //variable
    public marginside: number = 100;
    private gaps: number = 10;
    public betvalue: PIXI.Text;
    public bet: number;
    public balance: number = 100000;
    public balancevalue: PIXI.Text;
    private showmenu: Boolean = false;
    private showinfo: Boolean = false;
    private showautoplay: Boolean = false;
    public mybuttons: Array<PIXI.Sprite> = [];
    //components
    public modalmenu: ModalMenu;
    public modalinfo: ModalInfo;
    public modalautoplay: ModalAutoplay;
    private openmodal: (bool: Boolean) => void;
    private autoplay: (number: number) => void;
    private bonusprizeupdate: (val : number) => void;
    public paylinetopcontainer: PIXI.Container;
    public paylinebottomcontainer: PIXI.Container;

    private playSound: (index: number) => void; 
    private muteSound: (type: string, bol:Boolean) => void;
    private isMute: Boolean;


    constructor(app: PIXI.Application, openmodal: (bool: Boolean) => void, autoplay: (number: number) => void,bonusprizeupdate: (val : number) => void, playSound: (number: number) => void,  muteSound: (type: string, bol:Boolean) => void, isMute:Boolean) {
        this.container = new PIXI.Container();
        this.containerPortrait = new PIXI.Container()
        this.paylinebottomcontainer = new PIXI.Container;
        this.paylinetopcontainer = new PIXI.Container;
        this.play_container = new PIXI.Container();
        this.app = app;
        this.openmodal = openmodal;
        this.autoplay = autoplay;
        this.bonusprizeupdate = bonusprizeupdate;

        this.playSound = playSound;
        this.muteSound = muteSound;
        this.isMute = isMute;
        this.init();
    }

    private init() {
        this.createParent();
        this.createMenuModal();
        this.createModalInfo();
        this.createModalAutoplay();
        this.createInfoButton();
        this.createMenuButton();
        this.createPlayButton();
        this.createBetBalanceBox();
        this.createPaylineBox();
        //portrait
        this.createParentPortrait()
        this.createMenuButtonPortrait();
        this.createInfoButtonPortrait()

    }

    private createParentPortrait(){
        this.controller_parent_portrait = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'portrait_frame.png', false);
        this.containerPortrait.addChild(this.controller_parent_portrait)
    }

    private createParent(){
        this.controller_parent = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'controller_parent.png', false);
        this.controller_parent.alpha = 0
        this.controller_parent.width = this.app.screen.width;
        this.container.addChild(this.controller_parent);
    }

    private createInfoButton(){
        this.info_button =  Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'info_btn.png', false);
        this.info_button.interactive = true;
        this.info_button.buttonMode = true;
        this.mybuttons.push(this.info_button);
        this.container.addChild(this.info_button);
        this.info_button.addListener("pointerdown", () => {
            this.playSound(9)
            if(!this.showinfo){
                this.openmodal(true);
                this.showinfo = true;
                this.mybuttons.forEach(element => {
                    element.buttonMode = false;
                    element.interactive = false;
                });
                this.app.stage.addChild(this.modalinfo.container);
            }
        });
    }

    private createInfoButtonPortrait(){
        this.info_button_portrait =  Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'infobtn_portait.png', false);
        this.info_button_portrait.interactive = true;
        this.info_button_portrait.buttonMode = true;
        this.mybuttons.push(this.info_button_portrait);
        this.containerPortrait.addChild(this.info_button_portrait);
        this.info_button_portrait.addListener("pointerdown", () => {
            this.playSound(9)
            if(!this.showinfo){
                this.openmodal(true);
                this.showinfo = true;
                this.mybuttons.forEach(element => {
                    element.buttonMode = false;
                    element.interactive = false;
                });
                this.app.stage.addChild(this.modalinfo.container);
            }
        });
    }

    private createMenuButton(){
        this.menu_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'menu_btn.png', false);
        this.menu_button.interactive = true;
        this.menu_button.buttonMode = true;
        this.mybuttons.push(this.menu_button);
        this.container.addChild(this.menu_button);
        this.menu_button.addListener("pointerdown", () => {
            this.playSound(9)
            if(!this.showmenu){
                this.openmodal(true);
                this.showmenu = true;
                this.mybuttons.forEach(element => {
                    element.buttonMode = false;
                    element.interactive = false;
                });
                this.app.stage.addChild(this.modalmenu.container);
            }
        });
    }

    private createMenuButtonPortrait(){
        this.menu_button_Portrait = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'menubtn_portrait.png', false);
        this.menu_button_Portrait.interactive = true;
        this.menu_button_Portrait.buttonMode = true;
        this.mybuttons.push(this.menu_button_Portrait);
        this.containerPortrait.addChild(this.menu_button_Portrait);
        this.menu_button_Portrait.addListener("pointerdown", () => {
            this.playSound(9)
            if(!this.showmenu){
                this.openmodal(true);
                this.showmenu = true;
                this.mybuttons.forEach(element => {
                    element.buttonMode = false;
                    element.interactive = false;
                });
                this.app.stage.addChild(this.modalmenu.container);
            }
        });
    }

    private createMenuModal(){
        this.modalmenu = new ModalMenu(this.app, this.updateBet.bind(this),this.bonusprizeupdate.bind(this), this.playSound.bind(this), this.muteSound.bind(this),this.isMute);
        this.bet = this.modalmenu.bet_value;
        this.modalmenu.modal_close.addListener("pointerdown", () => {
            this.playSound(9)
            this.showmenu = false;
            this.openmodal(false);
            this.app.stage.removeChild(this.modalmenu.container);
            this.mybuttons.forEach(element => {
                element.buttonMode = true;
                element.interactive = true;
            });
        });
    }

    private createModalAutoplay(){
        this.modalautoplay = new ModalAutoplay(this.app, this.closeAutoPlay.bind(this), this.autoplay.bind(this),this.playSound.bind(this));
        this.modalautoplay.modal_close.addListener("pointerdown", () => {
            this.playSound(9)
            this.closeAutoPlay();
        });
    }

    private closeAutoPlay(){
        this.showautoplay = false;
        this.openmodal(false);
        this.app.stage.removeChild(this.modalautoplay.container);
        this.mybuttons.forEach(element => {
            element.buttonMode = true;
            element.interactive = true;
        });
    }

    private createModalInfo(){
        this.modalinfo = new ModalInfo(this.app, this.playSound.bind(this));
        this.modalinfo.modal_close.addListener("pointerdown", () => {
            this.playSound(9)
            this.showinfo = false;
            this.openmodal(false);
            this.app.stage.removeChild(this.modalinfo.container);
            this.mybuttons.forEach(element => {
                element.buttonMode = true;
                element.interactive = true;
            });
        });
    }

    private createPlayButton(){
        //single play
        this.singleplay_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'play_btn.png', false);
        this.singleplay_button.interactive = true;
        this.singleplay_button.buttonMode = true;
        this.mybuttons.push(this.singleplay_button);
        this.play_container.addChild(this.singleplay_button);
        //auto play
        this.autoplay_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'autoplay_btn.png', false);
        this.autoplay_button.interactive = true;
        this.autoplay_button.buttonMode = true;
        this.mybuttons.push(this.autoplay_button);
        this.play_container.addChild(this.autoplay_button);
        this.autoplay_button.addListener("pointerdown", () => {
            this.playSound(9)
            if(!this.showautoplay){
                this.openmodal(true);
                this.showautoplay = true;
                this.mybuttons.forEach(element => {
                    element.buttonMode = false;
                    element.interactive = false;
                });
                this.app.stage.addChild(this.modalautoplay.container);
            }
        });
        //position
        this.singleplay_button.position.x = (this.play_container.width - this.singleplay_button.width) / 2;
        this.autoplay_button.position.x = (this.play_container.width - this.autoplay_button.width) / 2;
        this.autoplay_button.position.y = this.singleplay_button.height + 30;
        //text autoplay
        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 55,
            fontWeight: 'bold',
            fill: '#ffffff',
        });

    }

    private createBetBalanceBox(){
        this.betContainer =  Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'bet_container.png', false);
        this.container.addChild(this.betContainer);
        this.creditContainer =  Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'credit_container.png', false);
        this.container.addChild(this.creditContainer);
        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 60,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        const style2 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        //bet
        this.betvalue = new PIXI.Text(Functions.formatNumber(this.bet), style);
        this.betvalue.x = (this.betContainer.width - this.betvalue.width)/2
        this.betContainer.addChild(this.betvalue)
        //balance
        this.balancevalue = new PIXI.Text(Functions.formatNumber(this.balance), style2);
        this.balancevalue.x = (this.creditContainer.width - this.balancevalue.width)/2
        this.balancevalue.y = (this.creditContainer.height - this.balancevalue.height)/2
        this.creditContainer.addChild(this.balancevalue)
    }

    private createPaylineBox(){
        this.payline_box = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'payline_container.png', false);
        this.payline_box.height = this.container.height;
        this.container.addChild(this.payline_box);

        //payline text
        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#ffffff',
        });

        this.tapspacetext = new PIXI.Text("TAP SPACE TO SKIP ANIMATIONS", style);
        this.paylinetopcontainer.addChild(this.tapspacetext)
        this.payline_box.addChild(this.paylinetopcontainer);

        const style2 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 85,
            fontWeight: 'bold',
            fill: '#12d8dc',
        });
        this.paylinetext = new PIXI.Text('SPIN TO WIN!', style2);
        this.paylinebottomcontainer.addChild(this.paylinetext);
        this.payline_box.addChild(this.paylinebottomcontainer);
    }

    private updateBet(val: number){
        this.betvalue.text = Functions.formatNumber(val);
        this.betvalue.x = (this.betContainer.width - this.betvalue.width)/2
        this.bet = val;
    }
}

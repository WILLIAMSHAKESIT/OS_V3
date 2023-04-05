import * as PIXI from 'pixi.js';
import Functions from '../../Functions';
import ModalMenu from './ModalMenu';
import ModalInfo from './ModalInfo';
import ModalAutoplay from './ModalAutoplay';

export default class Controller {
    private app: PIXI.Application;
    public container: PIXI.Container;
    public play_container: PIXI.Container;
    private controller_parent: PIXI.Sprite;
    public info_button: PIXI.Sprite;
    private sound_button: PIXI.Sprite;
    public menu_button: PIXI.Sprite;
    public singleplay_button: PIXI.Sprite;
    public autoplay_button: PIXI.Sprite;
    private bet_box: PIXI.Container;
    public balance_box: PIXI.Container;
    public payline_box: PIXI.Container;
    public playtext: PIXI.Text;
    public tapspacetext: PIXI.Text;
    public paylinetext: PIXI.Text;
    //variable
    public marginside: number = 100;
    private gaps: number = 10;
    private betvalue: PIXI.Text;
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
    public paylinetopcontainer: PIXI.Container;
    public paylinebottomcontainer: PIXI.Container;

    constructor(app: PIXI.Application, openmodal: (bool: Boolean) => void, autoplay: (number: number) => void) {
        this.container = new PIXI.Container();
        this.paylinebottomcontainer = new PIXI.Container;
        this.paylinetopcontainer = new PIXI.Container;
        this.play_container = new PIXI.Container();
        this.app = app;
        this.openmodal = openmodal;
        this.autoplay = autoplay;
        this.init();
    }

    private init() {
        this.createParent();
        this.createMenuModal();
        this.createModalInfo();
        this.createModalAutoplay();
        this.createInfoButton();
        this.createSoundButton();
        this.createMenuButton();
        this.createPlayButton();
        this.createBetBalanceBox();
        this.createPaylineBox();
    }

    private createParent(){
        this.controller_parent = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'controller_parent.png', false);
        this.controller_parent.alpha = 0
        this.controller_parent.width = this.app.screen.width;
        this.container.addChild(this.controller_parent);
    }

    private createInfoButton(){
        this.info_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'info_btn.png', false);
        this.info_button.interactive = true;
        this.info_button.buttonMode = true;
        this.mybuttons.push(this.info_button);
        this.container.addChild(this.info_button);
        this.info_button.addListener("pointerdown", () => {
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

    private createSoundButton(){
        this.sound_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'sound_on.png', false);
        this.sound_button.interactive = true;
        this.sound_button.buttonMode = true;
        this.mybuttons.push(this.sound_button);
        this.container.addChild(this.sound_button);
    }

    private createMenuButton(){
        this.menu_button = Functions.loadSprite(this.app.loader, 'my_slot_controllers_new', 'menu_btn.png', false);
        this.menu_button.interactive = true;
        this.menu_button.buttonMode = true;
        this.mybuttons.push(this.menu_button);
        this.container.addChild(this.menu_button);
        this.menu_button.addListener("pointerdown", () => {
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
        this.modalmenu = new ModalMenu(this.app, this.updateBet.bind(this));
        this.bet = this.modalmenu.bet_value;
        this.modalmenu.modal_close.addListener("pointerdown", () => {
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
        this.modalautoplay = new ModalAutoplay(this.app, this.closeAutoPlay.bind(this), this.autoplay.bind(this));
        this.modalautoplay.modal_close.addListener("pointerdown", () => {
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
        this.modalinfo = new ModalInfo(this.app);
        this.modalinfo.modal_close.addListener("pointerdown", () => {
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
        // this.playtext = new PIXI.Text("AUTO PLAY", style);
        // this.autoplay_button.addChild(this.playtext);
        // this.playtext.position.x = (this.autoplay_button.width - this.playtext.width) / 2;
        // this.playtext.position.y = ((this.autoplay_button.height - this.playtext.height) / 2) - 12;

    }

    private createBetBalanceBox(){
        this.bet_box = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_box.png', false);
        this.container.addChild(this.bet_box);
        this.balance_box = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'balance_box.png', false);
        this.container.addChild(this.balance_box);

        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 60,
            fontWeight: 'bold',
            fill: '#12d8dc',
        });
        const style2 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 60,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        const style3 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 45,
            fontWeight: 'bold',
            fill: '#12d8dc',
        });
        const style4 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 45,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        //bet
        const text = new PIXI.Text("BET", style);
        this.bet_box.addChild(text)
        text.position.y = (this.bet_box.height - text.height) / 2.8;
        text.position.x = 25;
        this.betvalue = new PIXI.Text(Functions.formatNumber(this.bet), style2);
        this.bet_box.addChild(this.betvalue)
        this.betvalue.position.x = this.bet_box.width - this.betvalue.width - 25;
        this.betvalue.position.y = (this.bet_box.height - this.betvalue.height) / 2.8;
        //balance
        const text2 = new PIXI.Text("CREDIT", style3);
        this.balance_box.addChild(text2);
        text2.position.y = (this.balance_box.height - text2.height) / 2.8;
        text2.position.x = 15;
        this.balancevalue = new PIXI.Text(Functions.formatNumber(this.balance), style4);
        this.balance_box.addChild(this.balancevalue);
        this.balancevalue.position.x = this.balance_box.width - this.balancevalue.width - 15;
        this.balancevalue.position.y = (this.balance_box.height - this.balancevalue.height) / 2.8;
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
        this.paylinetopcontainer.position.x = 1000
        this.paylinetopcontainer.position.y = 200;

        const style2 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 85,
            fontWeight: 'bold',
            fill: '#12d8dc',
        });
        this.paylinetext = new PIXI.Text('SPIN TO WIN!', style2);
        this.paylinebottomcontainer.addChild(this.paylinetext);
        this.payline_box.addChild(this.paylinebottomcontainer);
        this.paylinebottomcontainer.position.x = (this.payline_box.width - this.paylinebottomcontainer.width) / 2;
        this.paylinebottomcontainer.position.y = ((this.payline_box.height - this.paylinebottomcontainer.height) / 2) + 20;
    }

    private updateBet(val: number){
        this.betvalue.text = Functions.formatNumber(val);
        this.betvalue.position.x = this.bet_box.width - this.betvalue.width - 25;
        this.bet = val;
    }


}

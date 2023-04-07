import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

export default class ModalMenu {
    private app: PIXI.Application;
    public container: PIXI.Container;
    private modal_container: PIXI.Sprite;
    public modal_close: PIXI.Sprite;
    private margins: number = 500;
    private bet_add: PIXI.Sprite;
    private bet_add_clicked: PIXI.Sprite;
    private bet_minus: PIXI.Sprite;
    private bet_minus_clicked: PIXI.Sprite;
    public bet_value: number;
    private bet_box: PIXI.Sprite;
    private betvaluestyle: PIXI.TextStyle;
    private bettextvalue: PIXI.Text;
    private titlestyle: PIXI.TextStyle;
    private parenttitle: PIXI.TextStyle;
    private betArray: Array<number> = [1,5,10,20,50,100];
    private betIndex: number = 0;
    private updatebet: (val: number) => void;
    private bonusprizeupdate: (val : number) => void;
    private ambienttoggleon: PIXI.Sprite;
    private ambienttoggleoff: PIXI.Sprite;
    private soundfxbtnon: PIXI.Sprite;
    private soundfxbtnoff: PIXI.Sprite;
    private ambientbtn: PIXI.Sprite;
    private soundfxbtn: PIXI.Sprite;
    public playSound: (index: number) => void; 
    public muteSound: (type: string, bol:Boolean) => void;
    private isMute:Boolean;


    constructor(app: PIXI.Application, updatebet: (val: number) => void,bonusprizeupdate: (val : number) => void, playSound: (number: number) => void, muteSound: (type: string, bol:Boolean) => void, isMute:Boolean) {
        this.app = app;
        this.container = new PIXI.Container();
        this.betvaluestyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 100,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.titlestyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.parenttitle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#FEAE4D'
        });
        this.bet_value = this.betArray[this.betIndex];
        this.updatebet = updatebet;
        this.bonusprizeupdate = bonusprizeupdate;
        this.playSound = playSound;
        this.muteSound = muteSound;
        this.isMute = isMute;
        this.ambienttoggleon = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_on.png', false);
        this.ambienttoggleoff = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_off.png', false);
        this.soundfxbtnon = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_on.png', false);
        this.soundfxbtnoff = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_off.png', false);
        this.init();
    }

    private init() {
        this.createOverlay();
        this.createParent();
        this.createContent();
        //positioning
        //parent modal
        this.modal_container.position.x = (this.container.width - this.modal_container.width) / 2;
        this.modal_container.position.y = 100;
        //modal close
        this.modal_close.position.x = (this.modal_container.width - this.modal_close.width) - 5;
        this.modal_close.position.y = 5;
        //main container
        this.container.position.x = (this.app.screen.width - this.container.width) / 2;

        if(this.isMute){
            this.ambientbtn.texture = this.ambienttoggleon.texture;
            this.soundfxbtn.texture = this.ambienttoggleon.texture;
        }else{
            this.ambientbtn.texture = this.ambienttoggleoff.texture;
            this.soundfxbtn.texture = this.ambienttoggleoff.texture;
        }
    }

    private createOverlay(){
        const parent = new PIXI.Graphics();
        parent.beginFill(0x000000, .7)
                .drawRect(0,0,this.app.screen.width, this.app.screen.height)
                .endFill();
        this.container.addChild(parent);
    }

    private createParent(){
        this.modal_container = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'modal_container.png', false);
        this.container.addChild(this.modal_container);

        this.modal_close = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'modal_close.png', false);
        this.modal_container.addChild(this.modal_close);
        this.modal_close.interactive = true;
        this.modal_close.buttonMode = true;
    }

    private createContent(){
        //title
        const title = new PIXI.Text("SYSTEM SETTINGS", this.parenttitle);
        title.y = title.height / 2;
        title.x = (this.modal_container.width - title.width) / 2;
        this.modal_container.addChild(title);
        //left
        const leftcontainer = new PIXI.Container();
        const betcontainer = new PIXI.Container();
        this.bettextvalue = new PIXI.Text(this.bet_value, this.betvaluestyle);
        const lefttitle = new PIXI.Text("TOTAL BET", this.titlestyle);
        this.bet_minus = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_minus.png', false);
        this.bet_minus_clicked = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_minus_clicked.png', false);
        this.bet_box = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'modal_bet_box.png', false);
        this.bet_add = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_add.png', false);
        this.bet_add_clicked = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_add_clicked.png', false);
        this.bet_box.x = this.bet_minus.x + this.bet_minus.width;
        this.bet_add.x = this.bet_box.x + this.bet_box.width;
        betcontainer.addChild(this.bet_minus);
        betcontainer.addChild(this.bet_box);
        betcontainer.addChild(this.bet_add);
        betcontainer.scale.set(.6);
        betcontainer.y = lefttitle.y + lefttitle.height + 30;
        leftcontainer.addChild(lefttitle);
        leftcontainer.addChild(betcontainer);
        betcontainer.x = (leftcontainer.width - betcontainer.width) / 2;
        lefttitle.x = (leftcontainer.width - lefttitle.width) / 2;
        this.modal_container.addChild(leftcontainer);
        this.bettextvalue.y = (this.bet_box.height - this.bettextvalue.height) / 2;
        this.bettextvalue.x = (this.bet_box.width - this.bettextvalue.width) / 2;
        this.bet_box.addChild(this.bettextvalue);
        this.bet_add.interactive = true;
        this.bet_add.buttonMode = true;
        this.bet_add.addListener("pointerdown", () => {
            this.playSound(9);
            this.betIndex++;
            this.bet_value = this.betArray[this.betIndex];
            this.updateBetBox();
            if(this.betIndex == this.betArray.length - 1){
                this.bet_add.interactive = false;
            }
            if(this.betIndex == 1){
                this.bet_minus.interactive = true;
            }
            const originaltexture = this.bet_add.texture;
            this.bet_add.texture = this.bet_add_clicked.texture;
            let settexture = setTimeout(()=>{
                this.bet_add.texture = originaltexture;
                clearTimeout(settexture);
            },100);
        });

        this.bet_minus.interactive = false;
        this.bet_minus.buttonMode = true;
        this.bet_minus.addListener("pointerdown", () => {
            this.playSound(9);
            this.betIndex--;
            this.bet_value = this.betArray[this.betIndex];
            this.updateBetBox();
            if(this.betIndex == 0){
                this.bet_minus.interactive = false;
            }
            if(this.betIndex == this.betArray.length - 2){
                this.bet_add.interactive = true;
            }
            const originaltexture = this.bet_minus.texture;
            this.bet_minus.texture = this.bet_minus_clicked.texture;
            let settexture = setTimeout(()=>{
                this.bet_minus.texture = originaltexture;
                clearTimeout(settexture);
            },100);
        });
        leftcontainer.y = (this.modal_container.height - leftcontainer.height) / 2;
        leftcontainer.x = ((this.modal_container.width / 2) - leftcontainer.width) / 2;
        //middle
        const middlecontainer = new PIXI.Container();
        const middleline = new PIXI.Graphics();
        middleline.beginFill(0xffffff, 1)
                    .drawRect(0,0,1,Math.round(this.modal_container.height * .6))
                    .endFill();
        middlecontainer.addChild(middleline);
        middlecontainer.x = (this.modal_container.width - middlecontainer.width) / 2;
        middlecontainer.y = (this.modal_container.height - middlecontainer.height) / 2;
        this.modal_container.addChild(middlecontainer);
        //right
        const rightcontainer = new PIXI.Container();
        const ambientcontainer = new PIXI.Container();
        const soundfxcontainer = new PIXI.Container();
        const ambientstyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 35,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const ambientstyle2 = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const ambienttext = new PIXI.Text("AMBIENT MUSIC", ambientstyle);
        const ambientsubtext = new PIXI.Text("Turn on and off the music", ambientstyle2);
        const soundfxtext = new PIXI.Text("SOUND FX", ambientstyle);
        const soundfxsubtext = new PIXI.Text("Turn on and off the sound", ambientstyle2);
        //ambient
        ambientcontainer.addChild(ambienttext);
        ambientcontainer.addChild(ambientsubtext);
        ambientsubtext.y = ambienttext.y + ambienttext.height;
        this.ambientbtn = new PIXI.Sprite(this.ambienttoggleoff.texture);
        this.ambientbtn.scale.set(.6);
        this.ambientbtn.y = (ambientcontainer.height - this.ambientbtn.height) / 2;
        this.ambientbtn.x = (ambienttext.x + ambienttext.width) + 110;
        ambientcontainer.addChild(this.ambientbtn);
        rightcontainer.addChild(ambientcontainer);
        //soundfx
        soundfxcontainer.addChild(soundfxtext);
        soundfxcontainer.addChild(soundfxsubtext);
        soundfxsubtext.y = soundfxtext.y + soundfxtext.height;
        this.soundfxbtn = new PIXI.Sprite(this.ambienttoggleoff.texture);
        this.soundfxbtn.scale.set(.6);
        this.soundfxbtn.y = (soundfxcontainer.height - this.soundfxbtn.height) / 2;
        this.soundfxbtn.x = (soundfxtext.x + soundfxtext.width) + 200;
        soundfxcontainer.addChild(this.soundfxbtn);
        soundfxcontainer.y = ambientcontainer.y + ambientcontainer.height + 50;
        rightcontainer.addChild(soundfxcontainer);

        this.modal_container.addChild(rightcontainer);
        rightcontainer.y = (this.modal_container.height - rightcontainer.height) / 2;
        rightcontainer.x = (this.modal_container.width / 2) + (rightcontainer.width / 4);

        //events
        this.ambientbtn.buttonMode = true;
        this.ambientbtn.interactive = true;
        this.soundfxbtn.buttonMode = true;
        this.soundfxbtn.interactive = true;
        this.ambientbtn.addListener("pointerdown", () => {
            this.playSound(9)
            if(this.ambientbtn.texture == this.ambienttoggleoff.texture){
                this.ambientbtn.texture = this.ambienttoggleon.texture;
                this.muteSound('ambient', false)
            }else{
                this.ambientbtn.texture = this.ambienttoggleoff.texture;
                this.muteSound('ambient', true)
            }
            
        });
        this.soundfxbtn.addListener("pointerdown", () => {
            this.playSound(9)
            if(this.soundfxbtn.texture == this.soundfxbtnoff.texture){
                this.soundfxbtn.texture = this.soundfxbtnon.texture;
                this.muteSound('sfx', false)
            }else{
                this.soundfxbtn.texture = this.soundfxbtnoff.texture;
                this.muteSound('sfx', true)
            }
            
        });
    }

    private updateBetBox(){
        this.bettextvalue.text = this.bet_value;
        this.bettextvalue.x = (this.bet_box.width - this.bettextvalue.width) / 2;
        this.updatebet(this.bet_value);
        this.bonusprizeupdate(this.bet_value);
    }
}

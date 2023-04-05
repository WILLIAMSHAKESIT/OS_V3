import * as PIXI from 'pixi.js';
import Functions from '../../Functions';

export default class ModalAutoplay {
    private app: PIXI.Application;
    public container: PIXI.Container;
    private modal_container: PIXI.Sprite;
    public modal_close: PIXI.Sprite;
    public playcount: number = 0;
    private betmodal: PIXI.Sprite;
    private betmodalclicked: PIXI.Sprite;
    private arrBtn: Array<PIXI.Sprite> = [];
    private valuestyle: PIXI.TextStyle;
    private toggleon: PIXI.Sprite;
    private toggleoff: PIXI.Sprite;
    private quicktoggle: PIXI.Sprite;
    private turbotoggle: PIXI.Sprite;
    public spintype: string = "normal";
    private closemodal: () => void;
    private autoplay: (number: number) => void

    constructor(app: PIXI.Application, closemodal: () => void, autoplay: (number: number) => void) {
        this.app = app;
        this.betmodal = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_modal.png', false);
        this.betmodalclicked = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'bet_modal_clicked.png', false);
        this.toggleon = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_on.png', false);
        this.toggleoff = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'toggle_off.png', false);
        this.container = new PIXI.Container();
        this.valuestyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.closemodal = closemodal;
        this.autoplay = autoplay;
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
        const numberscointainer = new PIXI.Container();
        const quickspincontainer = new PIXI.Container();
        this.quicktoggle = new PIXI.Sprite(this.toggleoff.texture);
        this.turbotoggle = new PIXI.Sprite(this.toggleoff.texture);
        this.quicktoggle.interactive = true;
        this.quicktoggle.buttonMode = true;
        this.turbotoggle.interactive = true;
        this.turbotoggle.buttonMode = true;
        const turbospincontainer = new PIXI.Container();
        const arrCount = [1,5,10,25,50,75,100,250,500,1000];
        let posx = 0;
        let posy = 0;
        let gap = 15;
        arrCount.forEach((element, index) => {
            const btn = new PIXI.Sprite(this.betmodal.texture);
            btn.x = posx;
            btn.y = posy;
            btn.interactive = true;
            btn.buttonMode = true;
            this.arrBtn.push(btn);
            const text = new PIXI.Text(arrCount[index], this.valuestyle);
            btn.addChild(text);
            text.x = (btn.width - text.width) / 2;
            text.y = (btn.height - text.height) / 2;
            numberscointainer.addChild(btn);
            posx += (btn.width + gap);
            if(index == 4){
                posx = 0;
                posy = btn.height + gap;
            }
            this.btnClicked(btn, arrCount[index]);
        });
        numberscointainer.y = 60;
        this.modal_container.addChild(numberscointainer);
        //quick spin and turbo spin
        const spinstyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 45,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const spinstyle2 = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const quickspintext = new PIXI.Text("QUICK SPIN", spinstyle);
        const turbospintext = new PIXI.Text("TURBO SPIN", spinstyle);
        const quickspintextsub = new PIXI.Text("Reduce the overall spin time to play more quickly", spinstyle2);
        const turbospintextsub = new PIXI.Text("Totally remove overall spin time to play more quickly", spinstyle2);

        quickspincontainer.addChild(quickspintext);
        quickspincontainer.addChild(quickspintextsub);
        quickspincontainer.addChild(this.quicktoggle);
        quickspintextsub.style.wordWrap = true;
        quickspintextsub.style.wordWrapWidth = 400;
        quickspintextsub.style.lineHeight = 30;
        this.quicktoggle.scale.set(.6);
        this.quicktoggle.y = (quickspincontainer.height - this.quicktoggle.height) / 2;
        this.quicktoggle.x = (quickspintextsub.x + quickspintextsub.width) + 200;
        quickspintextsub.y = quickspintext.y + quickspintext.height;
        quickspincontainer.y = numberscointainer.y + numberscointainer.height + 60;
        this.modal_container.addChild(quickspincontainer);

        turbospincontainer.addChild(turbospintext);
        turbospincontainer.addChild(turbospintextsub);
        turbospincontainer.addChild(this.turbotoggle);
        turbospintextsub.style.wordWrap = true;
        turbospintextsub.style.wordWrapWidth = 400;
        turbospintextsub.style.lineHeight = 30;
        this.turbotoggle.scale.set(.6);
        this.turbotoggle.y = (turbospincontainer.height - this.turbotoggle.height) / 2;
        this.turbotoggle.x = (turbospintextsub.x + turbospintextsub.width) + 172;
        turbospintextsub.y = turbospintext.y + turbospintext.height;
        turbospincontainer.y = quickspincontainer.y + turbospincontainer.height + 40;

        //center
        numberscointainer.x = (this.modal_container.width - numberscointainer.width) / 2;
        quickspincontainer.x = (this.modal_container.width - quickspincontainer.width) / 2;
        turbospincontainer.x = quickspincontainer.x;

        this.modal_container.addChild(turbospincontainer);

        //events
        this.quicktoggle.addListener("pointerdown", () => {
            this.turbotoggle.texture = this.toggleoff.texture;
            if(this.quicktoggle.texture == this.toggleoff.texture){
                this.spintype = "quick";
                this.quicktoggle.texture = this.toggleon.texture;
            }
            else{
                this.spintype = "normal";
                this.quicktoggle.texture = this.toggleoff.texture;
            }
        });
        this.turbotoggle.addListener("pointerdown", () => {
            this.quicktoggle.texture = this.toggleoff.texture;
            if(this.turbotoggle.texture == this.toggleoff.texture){
                this.spintype = "turbo";
                this.turbotoggle.texture = this.toggleon.texture;
            }
            else{
                this.spintype = "normal";
                this.turbotoggle.texture = this.toggleoff.texture;
            }
        });

        const letrollcontainer = new PIXI.Container();
        const spinstyle3 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 65,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const letsrolltext = new PIXI.Text("Let's Roll!", spinstyle3);
        const letrollbtn = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'lets_roll.png', false);
        const letrollbtn2 = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'lets_roll.png', false);
        const letrollbtnclicked = Functions.loadSprite(this.app.loader, 'my_slot_controllers', 'lets_roll_clicked.png', false);
        letrollbtn.addChild(letsrolltext);
        letsrolltext.x = (letrollbtn.width - letsrolltext.width) / 2;
        letsrolltext.y = (letrollbtn.height - letsrolltext.height) / 2;
        letrollbtn.scale.set(.7);
        letrollcontainer.addChild(letrollbtn);
        this.modal_container.addChild(letrollcontainer);
        letrollcontainer.y = turbospincontainer.y + turbospincontainer.height + 35;
        letrollcontainer.x = (this.modal_container.width - letrollcontainer.width) / 2;

        //event
        letrollbtn.interactive = true;
        letrollbtn.buttonMode = true;
        letrollbtn.addListener("pointerdown", () => {
            if(this.playcount > 0){
                letrollbtn.texture = letrollbtnclicked.texture;
                let timeout = setTimeout(() => {
                    letrollbtn.texture = letrollbtn2.texture;
                    this.closemodal();
                    this.autoplay(this.playcount);
                    clearTimeout(timeout)
                }, 100);
            }
            else{
                alert("Please choose a spin count!");
            }
        });
    }

    private btnClicked(btn: PIXI.Sprite, value: number){
        btn.addListener("pointerdown", () => {
            this.resetTexture();
            this.playcount = value;
            btn.texture = this.betmodalclicked.texture;
        });
    }

    private resetTexture(){
        this.arrBtn.forEach(element => {
            element.texture = this.betmodal.texture;
        });
    }

}

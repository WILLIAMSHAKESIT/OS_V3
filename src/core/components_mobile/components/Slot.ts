import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import Functions from '../../Functions';
import json from './formula.json'

export default class Slot {
    public paylineanimation: Array<any> = [];
    public doneinterval: number = 1500;
    public paylinecounter: number = 0;
    private app: PIXI.Application;
    public container: PIXI.Container;
    private logocontainer: PIXI.Container;
    private slotcontainer: PIXI.Container;
    public reelscontainer: Array<any> = [];
    //others
    private frameMask: Array<PIXI.Sprite> = [];
    public reelsmaskcontainer: Array<any> = [];
    //slot variables
    private reelRandom: Array<Array<number>> = [
        [1,10,2,3,1,11,4,3,10,2,4,8,1,2,11,5,9,1,5,10,2,6,8,6,10,3,9,7,1,7],
        [5,2,4,1,4,5,10,6,11,1,6,8,3,9,2,1,10,4,3,1,11,7,8,2,11,1,3,2,10,7],
        [1,5,10,11,4,1,2,5,2,2,8,1,6,10,4,3,9,2,11,6,7,1,7,3,2,3,1,8,3,5],
        [1,5,2,3,1,4,11,3,2,5,9,4,2,1,8,4,1,8,10,3,8,1,8,11,7,6,2,10,7,6],
        [1,5,5,10,6,2,4,1,3,8,6,1,11,4,3,2,7,10,9,2,7,3,9,1,8,2,10,1,8,8]
        // [10,10,2,3,10,11,10,10,10,2,4,8,10,2,11,10,9,1,5,10,10,6,10,10,10,3,9,7,1,7],
        // [10,10,2,3,10,11,10,10,10,2,4,8,10,2,11,10,9,1,5,10,10,6,10,10,10,3,9,7,1,7],
        // [10,10,2,3,10,11,10,10,10,2,4,8,10,2,11,10,9,1,5,10,10,6,10,10,10,3,9,7,1,7],
        // [10,10,2,3,10,11,10,10,10,2,4,8,10,2,11,10,9,1,5,10,10,6,10,10,10,3,9,7,1,7],
        // [10,10,2,3,10,11,10,10,10,2,4,8,10,2,11,10,9,1,5,10,10,6,10,10,10,3,9,7,1,7]
    ];
    private rtp: number = 0;
    private charAssets: Array<any>;
    private symbols: Array<any> = [];
    private topposy: number;
    public startreel: Boolean = true;
    private startreelbool: Array<Boolean> = [true,true,true,true,true];
    private interval: number = 0;
    private mybet: number;
    private bounceSpeed: number = .3;
    private bounceBackSpeed: number = .4;
    private bounceBackposy: number = 30;
    private spinSpeed: number = 1.3;
    private charlen: number = 30;
    public spinreel: Array<any> = [];
    public enlarge: GSAPAnimation;
    public enlargecharacters: Boolean = false;
    public newtotal: number = 0;
    public newchar2: number;
    //read only
    private readonly reellen: number = 5;
    private readonly maskposy: Array<number> = [165,165,165,165,165];
    private readonly maskposx: Array<number> = [218,516,812,1111,1410];
    private readonly blockfixedsize: number = 255;
    private readonly reelposy: number = 660;
    private readonly reelposx: Array<number> = [238, 536, 832, 1131,1430];
    //paylines
    public payline_patter_1: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_2: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_3: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_4: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_5: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_6: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_7: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_8: Array<PIXI.AnimatedSprite> = [];
    public payline_patter_9: Array<PIXI.AnimatedSprite> = [];
    updatebottonpayline: (text: any) => void;
    updatetoppayline: (text: any) => void;
    updatebottonpayline2: (param1: any, param2: any,param3: any) => void;
    changebutton: () => void;
    autospintext: () => void;
    updatebalance: () => void;
    updatebalancewin: (win: number) => void;
    setbuttonstrue: () => void;
    bonusgame: (arr1: any, arr2: any) => void;
    private paylinebool: Boolean = false;
    public isbonus: Boolean = false;
    private isbonusArr: Array<number> = [];
    public reeleffectlinecontainer: Array<PIXI.Container> = [];
    public reeleffectbgcontainer: Array<PIXI.Container> = [];
    private readonly lineposx: Array<number> = [780,1085,1380];
    private readonly linewidth: Array<number> = [370,370,370];
    private lineheight: number = 0
    public lineeffect: Array<PIXI.AnimatedSprite> = [];
    public bgeffect: Array<PIXI.AnimatedSprite> = [];

    constructor(app: PIXI.Application, updatebottonpayline: (text: any) => void, updatebottonpayline2: (param1: any, param2: any,param3: any) => void, changebutton: () => void, updatetoppayline: (text: any) => void, autospintext: () => void, updatebalance: () => void, setbuttonstrue: () => void, updatebalancewin: (win: number) => void, bonusgame: (arr1: any, arr2: any) => void) {
        this.app = app;
        this.app.stage.sortableChildren = true;
        this.container = new PIXI.Container();
        this.logocontainer = new PIXI.Container();
        this.slotcontainer = new PIXI.Container();
        this.rtp = 1;
        this.charAssets = [
            { type : 0, value : 'slot_letter_j'},
            { type : 1, value : 'slot_letter_k'},
            { type : 2, value : 'slot_letter_a'},
            { type : 3, value : 'slot_turtle'},
            { type : 4, value : 'slot_sea_horse'},
            { type : 5, value : 'slot_penguin'},
            { type : 6, value : 'slot_walrus'},
            { type : 7, value : 'slot_octopus'},
            { type : 8, value : 'slot_mega'},
            { type : 9, value : 'slot_bonus'},
            { type : 10, value : 'slot_wild'}
        ];
        this.updatebottonpayline = updatebottonpayline;
        this.updatebottonpayline2 = updatebottonpayline2;
        this.changebutton = changebutton;
        this.updatetoppayline = updatetoppayline;
        this.autospintext = autospintext;
        this.updatebalance = updatebalance;
        this.setbuttonstrue = setbuttonstrue;
        this.updatebalancewin = updatebalancewin;
        this.bonusgame = bonusgame;
        this.init();
    }

    private init() {
        this.createReels();
        this.createFrame();
        this.createPaylines();
        

        //add child
        this.container.addChild(this.slotcontainer);
        this.container.addChild(this.logocontainer);

        //container position
        this.slotcontainer.position.x = (this.container.width - this.slotcontainer.width) / 2;
        this.logocontainer.position.x = (this.container.width - this.logocontainer.width) / 2;
        this.container.position.x = (this.app.screen.width - this.container.width) / 2;
    }

    private createReels(){
        let overallposy = 0;
        for(let i = 0; i < this.reellen; i++){
            const container = new PIXI.Container();
            const arr = this.createBlocks(i);
            arr.forEach((element: any) => {
                container.addChild(element.value);
                overallposy = element.value.position.y;
            });
            this.topposy = container.height;
            this.reelscontainer.push(container);
            this.symbols.push(arr);
        }
    }

    private createBlocks(number: number){
        let reelvalue = this.reelRandom[number];
        let arr: Array<any> = [];
        let posy = 0;
        for(let i = 0; i < reelvalue.length; i++){
            let index:number = reelvalue[Math.floor(Math.random()*reelvalue.length)];
            let type = this.charAssets[index - 1].type;
            let texture = this.charAssets[index - 1].value;
            const symbol = Functions.loadSprite(this.app.loader, texture, '', true);
            const h = symbol.height;
            const w = symbol.width;
            symbol.height = this.blockfixedsize;
            symbol.width = (w / h) * this.blockfixedsize;
            symbol.position.y = posy;
            posy -= symbol.height;
            let data = {
                type : type,
                value : symbol
            }
            arr.push(data);
        }

        return arr;
    }

    private createFrame(){
        //create slot frame
        const frame = Functions.loadSprite(this.app.loader, 'my_slot', 'frame.png', false);
        this.slotcontainer.addChild(frame);

        //create mask
        for(let i = 0; i < this.reellen; i++){
            this.frameMask.push(Functions.loadSprite(this.app.loader, 'my_slot', `mask_${i+1}.png`, false));
        }
        this.frameMask.forEach((element, index) => {
            const container = new PIXI.Container();
            element.position.y = this.maskposy[index];
            element.position.x = this.maskposx[index];
            element.height = element.height - 10 
            container.addChild(element)
            this.slotcontainer.addChild(container);
            this.reelsmaskcontainer.push(container)
        });

        this.lineheight = (this.frameMask[0].height)

        for(let i = 0; i < this.reellen - 2; i++){
            const bgeffect = Functions.loadSprite(this.app.loader, 'reeleffectbg', '', true);
            const lineeffect = Functions.loadSprite(this.app.loader, 'reeleffectlines', '', true);
            bgeffect.height = this.lineheight;
            bgeffect.width = this.linewidth[i];
            bgeffect.animationSpeed = .8;
            lineeffect.height = this.lineheight;
            lineeffect.width = this.linewidth[i];
            lineeffect.animationSpeed = .8;
            // lineeffect.position.y = 0
            this.bgeffect.push(bgeffect);
            this.lineeffect.push(lineeffect);
            const container = new PIXI.Container();
            container.addChild(bgeffect);
            container.addChild(lineeffect);
            this.reeleffectbgcontainer.push(container);
        }

        this.reeleffectbgcontainer.forEach((element, index) => {
            this.slotcontainer.addChild(element);
            element.y = 167;
            element.x = this.lineposx[index];
            element.visible = false;
            // element.zIndex = 3;
        });

        this.reelscontainer.forEach((element, index) => {
            this.slotcontainer.addChild(element);
            element.position.y = this.reelposy;
            element.position.x = this.reelposx[index];
            element.mask = this.frameMask[index];
            element.zIndex = 2;
        });   
    }

    public reelsAnimation(mybet: number, spintype: string){
        if(this.startreel){
            if(spintype == "turbo"){
                this.interval = 5;
            }
            else if(spintype == "quick"){
                this.interval = 20;
            }
            else{
                this.interval = 150;
            }
            if(!this.paylinebool){
                this.updatebottonpayline('GOODLUCK!');
            }
            else{
                this.paylinebool = false;
                let settimeout = setTimeout(() => {
                    this.updatebottonpayline('GOODLUCK!');
                    clearTimeout(settimeout)
                }, 1000)
            }
            this.mybet = mybet;
            this.startreel = false;
            this.updatebalance();
            this.reelscontainer.forEach((container, index) => {
                this.bounceUp(container, index);
            });
        }
    }

    private bounceUp(container: PIXI.Container, duration: number){
        container.zIndex = 5;
        let interval = this.interval * duration;
        let animate = setTimeout(() => {
            let bounce = gsap.to(container, {
                duration: this.bounceSpeed,
                y: container.position.y - this.bounceBackposy,
                onComplete: () => {
                    this.startreelbool[duration] = false;
                    let speed = this.spinSpeed;
                    let repeatret = this.checkBonus(duration);
                    let repeat = 0;
                    if(repeatret > 0){
                        repeat = 2;
                        this.isbonus = true;
                        this.isbonusArr.push(repeatret);
                    }
                    if(this.interval == 5){
                        repeat = 0;
                    }
                    this.spinReel(container, speed, duration, repeat);
                    bounce.kill();
                    let stoppage = setTimeout(() => {
                        container.zIndex = 2;
                        clearTimeout(stoppage);
                    }, 50);
                }
            });
            clearTimeout(animate);
        }, interval);
    }

    private checkBonus(arr_index: number){
        //check reel 3 have bonus
        let timein = (this.interval * 2) + 4000;
        if(this.interval == 5){
            timein = 0;
        }
        
        if(arr_index == 2){
            if(
                (this.symbols[0][this.charlen - 1].type == 9 || this.symbols[0][this.charlen - 2].type == 9 || this.symbols[0][this.charlen - 3].type == 9) &&
                (this.symbols[1][this.charlen - 1].type == 9 || this.symbols[1][this.charlen - 2].type == 9 || this.symbols[1][this.charlen - 3].type == 9) &&
                (this.symbols[2][this.charlen - 1].type == 9 || this.symbols[2][this.charlen - 2].type == 9 || this.symbols[2][this.charlen - 3].type == 9)
            ){
                if(this.interval > 0){
                    // this.soundPlay(15)
                }
                this.reeleffectbgcontainer[0].visible = true;
                this.lineeffect[0].play();
                this.bgeffect[0].play();
                let stoppage = setTimeout(() => {
                    this.reeleffectbgcontainer[0].visible = false;
                    this.lineeffect[0].gotoAndStop(0);
                    this.bgeffect[0].gotoAndStop(0);
                    clearTimeout(stoppage);
                }, timein);

                return 3;
            }
            else{
                return 0;
            }
        }
        //check reel 4 have bonus
        else if(arr_index == 3){
            if(
                (this.symbols[0][this.charlen - 1].type == 9 || this.symbols[0][this.charlen - 2].type == 9 || this.symbols[0][this.charlen - 3].type == 9) &&
                (this.symbols[1][this.charlen - 1].type == 9 || this.symbols[1][this.charlen - 2].type == 9 || this.symbols[1][this.charlen - 3].type == 9) &&
                (this.symbols[2][this.charlen - 1].type == 9 || this.symbols[2][this.charlen - 2].type == 9 || this.symbols[2][this.charlen - 3].type == 9) &&
                (this.symbols[3][this.charlen - 1].type == 9 || this.symbols[3][this.charlen - 2].type == 9 || this.symbols[3][this.charlen - 3].type == 9)
            ){
                this.reeleffectbgcontainer[1].visible = true;
                this.lineeffect[1].play();
                this.bgeffect[1].play();
                let stoppage = setTimeout(() => {
                    this.reeleffectbgcontainer[1].visible = false;
                    this.lineeffect[1].gotoAndStop(0);
                    this.bgeffect[1].gotoAndStop(0);
                    clearTimeout(stoppage);
                }, timein);

                return 4;
            }
            else{
                return 0;
            }
        }
        //check reel 5 have bonus
        else if(arr_index == 4){
            if(
                (this.symbols[0][this.charlen - 1].type == 9 || this.symbols[0][this.charlen - 2].type == 9 || this.symbols[0][this.charlen - 3].type == 9) &&
                (this.symbols[1][this.charlen - 1].type == 9 || this.symbols[1][this.charlen - 2].type == 9 || this.symbols[1][this.charlen - 3].type == 9) &&
                (this.symbols[2][this.charlen - 1].type == 9 || this.symbols[2][this.charlen - 2].type == 9 || this.symbols[2][this.charlen - 3].type == 9) &&
                (this.symbols[3][this.charlen - 1].type == 9 || this.symbols[3][this.charlen - 2].type == 9 || this.symbols[3][this.charlen - 3].type == 9) &&
                (this.symbols[4][this.charlen - 1].type == 9 || this.symbols[4][this.charlen - 2].type == 9 || this.symbols[4][this.charlen - 3].type == 9)
            ){
                this.reeleffectbgcontainer[2].visible = true;
                this.lineeffect[2].play();
                this.bgeffect[2].play();
                let stoppage = setTimeout(() => {
                    this.reeleffectbgcontainer[2].visible = false;
                    this.lineeffect[2].gotoAndStop(0);
                    this.bgeffect[2].gotoAndStop(0);
                    clearTimeout(stoppage);
                }, timein);
                return 5;
            }
            else{
                return 0;
            }
        }
        else{
            return 0;
        }
    }

    private spinReel(container: PIXI.Container, duration: number, index: number, repeat: number = 0){
        // this.soundPlay(8)
        let timeofspin = duration;
        if(this.interval == 5){
            timeofspin = .2;
        }
        let spin = gsap.to(container, {
            ease: "none",
            duration: timeofspin,
            y: (this.topposy - 80) + this.bounceBackposy,
            repeat: repeat,
            onComplete: () => { 
                // this.soundPlay(3)
                // this.checkSymbolSound(index)
                // const stopSound = setTimeout(() =>{
                //     clearTimeout(stopSound)
                // },700)
                container.zIndex = 4;
                // this.reelsmaskcontainer[index].position.y = this.reelsmaskcontainer[index].position.y + this.bounceBackposy;
                this.startreelbool[index] = true;
                this.updateBlocks(index, container);
                if(this.startreelbool[0] && this.startreelbool[1] && this.startreelbool[2] && this.startreelbool[3] && this.startreelbool[4]){
                    this.spinreel = [];
                    // this.updateslotgame();
                    this.checkCharacters();
                }
                spin.kill();
            }
        });
        this.spinreel.push(spin);
    }

    private checkCharacters(){
        let bonus5_picks_random: Array<number> = [10,11,12,15,16,17,18,19,20];
        let bonus4_picks_random: Array<number> = [7,8,9,10,11,12,13,14,15];
        let bonus3_picks_random: Array<number> = [1,2,3,4,5,6,7,8,9];
        let bonus5_picks_sort: Array<number> = [10,11,12,15,16,17,18,19,20];
        let bonus4_picks_sort: Array<number> = [7,8,9,10,11,12,13,14,15];
        let bonus3_picks_sort: Array<number> = [1,2,3,4,5,6,7,8,9];
        let randomresult: Array<number> = [];
        let sortresult: Array<number> = [];
        let characters: any = [];
        let pattern_1 = [];
        let pattern_2 = [];
        let pattern_3 = [];
        let pattern_4 = [];
        let pattern_5 = [];
        let pattern_6 = [];
        let pattern_7 = [];
        let pattern_8 = [];
        let pattern_9 = [];
        let paylines_name: any = [];
        let paylines_count: any = [];
        let paylines_pay: any = [];
        let paylines_symbols: any = [];
        let symbols1: any = [];
        let symbols2: any = [];
        let symbols3: any = [];
        let symbols4: any = [];
        let symbols5: any = [];
        let symbols6: any = [];
        let symbols7: any = [];
        let symbols8: any = [];
        let symbols9: any = [];

        //insert patterns
        //pattern1
        pattern_1.push(this.symbols[0][2]); 
        pattern_1.push(this.symbols[1][2]);
        pattern_1.push(this.symbols[2][2]);
        pattern_1.push(this.symbols[3][2]);
        pattern_1.push(this.symbols[4][2]);
        //pattern2
        pattern_2.push(this.symbols[0][1]);
        pattern_2.push(this.symbols[1][1]);
        pattern_2.push(this.symbols[2][1]);
        pattern_2.push(this.symbols[3][1]);
        pattern_2.push(this.symbols[4][1]);
        //pattern3
        pattern_3.push(this.symbols[0][0]);
        pattern_3.push(this.symbols[1][0]);
        pattern_3.push(this.symbols[2][0]);
        pattern_3.push(this.symbols[3][0]);
        pattern_3.push(this.symbols[4][0]);
        //pattern4
        pattern_4.push(this.symbols[0][0]);
        pattern_4.push(this.symbols[1][0]);
        pattern_4.push(this.symbols[2][1]);
        pattern_4.push(this.symbols[3][0]);
        pattern_4.push(this.symbols[4][0]);
        //pattern5
        pattern_5.push(this.symbols[0][2]);
        pattern_5.push(this.symbols[1][2]);
        pattern_5.push(this.symbols[2][1]);
        pattern_5.push(this.symbols[3][2]);
        pattern_5.push(this.symbols[4][2]);
        //pattern6
        pattern_6.push(this.symbols[0][1]);
        pattern_6.push(this.symbols[1][0]);
        pattern_6.push(this.symbols[2][0]);
        pattern_6.push(this.symbols[3][0]);
        pattern_6.push(this.symbols[4][1]);
        //pattern7
        pattern_7.push(this.symbols[0][1]);
        pattern_7.push(this.symbols[1][2]);
        pattern_7.push(this.symbols[2][2]);
        pattern_7.push(this.symbols[3][2]);
        pattern_7.push(this.symbols[4][1]);
        //pattern8
        pattern_8.push(this.symbols[0][2]);
        pattern_8.push(this.symbols[1][1]);
        pattern_8.push(this.symbols[2][0]);
        pattern_8.push(this.symbols[3][1]);
        pattern_8.push(this.symbols[4][2]);
        //pattern9
        pattern_9.push(this.symbols[0][0]);
        pattern_9.push(this.symbols[1][1]);
        pattern_9.push(this.symbols[2][2]);
        pattern_9.push(this.symbols[3][1]);
        pattern_9.push(this.symbols[4][0]);
        
        //validate patterns
        let combi1 = this.checkPatterns(pattern_1);
        if(combi1.symbol.length > 0){
            paylines_name.push('p1');
            paylines_count.push(combi1.symbol.length);
            paylines_pay.push(combi1.payout);
        }
        combi1.symbol.forEach((element: any) => {
            const symbol1 = new PIXI.AnimatedSprite(element.value.textures);
            symbols1.push(symbol1);
            characters.push(element);
        });
        if(symbols1.length > 0){
            paylines_symbols.push(symbols1);
        }

        let combi2 = this.checkPatterns(pattern_2);
        if(combi2.symbol.length > 0){
            paylines_name.push('p2');
            paylines_count.push(combi2.symbol.length);
            paylines_pay.push(combi2.payout);
        }
        combi2.symbol.forEach((element: any) => {
            const symbol2 = new PIXI.AnimatedSprite(element.value.textures);
            symbols2.push(symbol2);
            characters.push(element);
        });
        if(symbols2.length > 0){
            paylines_symbols.push(symbols2);
        }

        let combi3 = this.checkPatterns(pattern_3);
        if(combi3.symbol.length > 0){
            paylines_name.push('p3');
            paylines_count.push(combi3.symbol.length);
            paylines_pay.push(combi3.payout);
        }
        combi3.symbol.forEach((element: any) => {
            const symbol3 = new PIXI.AnimatedSprite(element.value.textures);
            symbols3.push(symbol3);
            characters.push(element);
        });
        if(symbols3.length > 0){
            paylines_symbols.push(symbols3);
        }

        let combi4 = this.checkPatterns(pattern_4);
        if(combi4.symbol.length > 0){
            paylines_name.push('p4');
            paylines_count.push(combi4.symbol.length);
            paylines_pay.push(combi4.payout);
        }
        combi4.symbol.forEach((element: any) => {
            const symbol4 = new PIXI.AnimatedSprite(element.value.textures);
            symbols4.push(symbol4);
            characters.push(element);
        });
        if(symbols4.length > 0){
            paylines_symbols.push(symbols4);
        }

        let combi5 = this.checkPatterns(pattern_5);
        if(combi5.symbol.length > 0){
            paylines_name.push('p5');
            paylines_count.push(combi5.symbol.length);
            paylines_pay.push(combi5.payout);
        }
        combi5.symbol.forEach((element: any) => {
            const symbol5 = new PIXI.AnimatedSprite(element.value.textures);
            symbols5.push(symbol5);
            characters.push(element);
        });
        if(symbols5.length > 0){
            paylines_symbols.push(symbols5);
        }

        let combi6 = this.checkPatterns(pattern_6);
        if(combi6.symbol.length > 0){
            paylines_name.push('p6');
            paylines_count.push(combi6.symbol.length);
            paylines_pay.push(combi6.payout);
        }
        combi6.symbol.forEach((element: any) => {
            const symbol6 = new PIXI.AnimatedSprite(element.value.textures);
            symbols6.push(symbol6);
            characters.push(element);
        });
        if(symbols6.length > 0){
            paylines_symbols.push(symbols6);
        }

        let combi7 = this.checkPatterns(pattern_7);
        if(combi7.symbol.length > 0){
            paylines_name.push('p7');
            paylines_count.push(combi7.symbol.length);
            paylines_pay.push(combi7.payout);
        }
        combi7.symbol.forEach((element: any) => {
            const symbol7 = new PIXI.AnimatedSprite(element.value.textures);
            symbols7.push(symbol7);
            characters.push(element);
        });
        if(symbols7.length > 0){
            paylines_symbols.push(symbols7);
        }

        let combi8 = this.checkPatterns(pattern_8);
        if(combi8.symbol.length > 0){
            paylines_name.push('p8');
            paylines_count.push(combi8.symbol.length);
            paylines_pay.push(combi8.payout);
        }
        combi8.symbol.forEach((element: any) => {
            const symbol8 = new PIXI.AnimatedSprite(element.value.textures);
            symbols8.push(symbol8);
            characters.push(element);
        });
        if(symbols8.length > 0){
            paylines_symbols.push(symbols8);
        }

        let combi9 = this.checkPatterns(pattern_9);
        if(combi9.symbol.length > 0){
            paylines_name.push('p9');
            paylines_count.push(combi9.symbol.length);
            paylines_pay.push(combi9.payout);
        }
        combi9.symbol.forEach((element: any) => {
            const symbol9 = new PIXI.AnimatedSprite(element.value.textures);
            symbols9.push(symbol9);
            characters.push(element);
        });
        if(symbols9.length > 0){
            paylines_symbols.push(symbols9);
        }

        let totalwin = combi1.payout + combi2.payout + combi3.payout + combi4.payout + combi5.payout + combi6.payout + combi7.payout + combi8.payout + combi9.payout;
        if(this.isbonus){
            this.symbols[0].forEach((element: any) => {
                if(element.type == 9){
                    characters.push(element)
                }
            });
            this.symbols[1].forEach((element: any) => {
                if(element.type == 9){
                    characters.push(element)
                }
            });
            this.symbols[2].forEach((element: any) => {
                if(element.type == 9){
                    characters.push(element)
                }
            });
            this.symbols[3].forEach((element: any) => {
                if(element.type == 9){
                    characters.push(element)
                }
            });
            this.symbols[4].forEach((element: any) => {
                if(element.type == 9){
                    characters.push(element)
                }
            });

            let bonusarrr = this.isbonusArr;
            let bonusgame = Math.max(...bonusarrr);
            if(bonusgame == 5){
                randomresult = bonus5_picks_random.sort(() => Math.random() - 0.5);
                sortresult = bonus5_picks_sort.sort((a,b) => a-b);
            }
            else if(bonusgame == 4){
                randomresult = bonus4_picks_random.sort(() => Math.random() - 0.5);
                sortresult = bonus4_picks_sort.sort((a,b) => a-b);
            }
            else{
                randomresult = bonus3_picks_random.sort(() => Math.random() - 0.5);
                sortresult = bonus3_picks_sort.sort((a,b) => a-b);
            }
        }

        // let bonusArr: any = [];
        // if(combi1.bonus > 0){
        //     bonusArr.push(combi1.bonus);
        // }
        // if(combi2.bonus > 0){
        //     bonusArr.push(combi2.bonus);
        // }
        // if(combi3.bonus > 0){
        //     bonusArr.push(combi3.bonus);
        // }
        // if(combi4.bonus > 0){
        //     bonusArr.push(combi4.bonus);
        // }
        // if(combi5.bonus > 0){
        //     bonusArr.push(combi5.bonus);
        // }
        // if(combi6.bonus > 0){
        //     bonusArr.push(combi6.bonus);
        // }
        // if(combi7.bonus > 0){
        //     bonusArr.push(combi7.bonus);
        // }
        // if(combi8.bonus > 0){
        //     bonusArr.push(combi8.bonus);
        // }
        // if(combi9.bonus > 0){
        //     bonusArr.push(combi9.bonus);
        // }



        // if(bonusArr.length > 0){
        //     let bonusgame = Math.max(...bonusArr);
        //     if(bonusgame == 5){
        //         randomresult = bonus5_picks_random.sort(() => Math.random() - 0.5);
        //         sortresult = bonus5_picks_sort.sort((a,b) => a-b);
        //     }
        //     else if(bonusgame == 4){
        //         randomresult = bonus4_picks_random.sort(() => Math.random() - 0.5);
        //         sortresult = bonus4_picks_sort.sort((a,b) => a-b);
        //     }
        //     else{
        //         randomresult = bonus3_picks_random.sort(() => Math.random() - 0.5);
        //         sortresult = bonus3_picks_sort.sort((a,b) => a-b);
        //     }
        // }
        if(characters.length > 0){
            this.updateBlocksSize(.5, true);
            this.enlargeCharacters(characters, totalwin, randomresult, sortresult, paylines_name, paylines_count, paylines_pay, paylines_symbols);
        }
        else{
            this.playAgain();
        }
    }

    private updateBlocks(arr_index: number, container: PIXI.Container){
        let new_arr = [];
        new_arr.unshift({type : this.symbols[arr_index][this.charlen - 1].type, value : this.symbols[arr_index][this.charlen - 1].value});
        new_arr.unshift({type : this.symbols[arr_index][this.charlen - 2].type, value : this.symbols[arr_index][this.charlen - 2].value});
        new_arr.unshift({type : this.symbols[arr_index][this.charlen - 3].type, value : this.symbols[arr_index][this.charlen - 3].value});
        this.generateNewResult(arr_index, new_arr, container);
    }

    private generateNewResult(arr_index: number, new_arr: Array<any>, container: PIXI.Container){
        //change top 3
        new_arr.forEach((element, index) => {
            const texture = this.charAssets[new_arr[index].type].value
            const symbol = Functions.loadSprite(this.app.loader, texture, '', true);
            this.symbols[arr_index][index].value.texture = symbol.texture;
            this.symbols[arr_index][index].value.textures = symbol.textures;
            this.symbols[arr_index][index].value.alpha = 1;
            this.symbols[arr_index][index].type = new_arr[index].type;
        });

        //change the rest
        let reelvalue = this.reelRandom[arr_index];
        let end = this.symbols[arr_index].length - 1;
        let start = new_arr.length;
        for(let i = start; i <= end; i++){
            let index:number = reelvalue[Math.floor(Math.random()*reelvalue.length)];
            const texture = this.charAssets[index - 1].value;
            const symbol = Functions.loadSprite(this.app.loader, texture, '', true);
            this.symbols[arr_index][i].value.texture = symbol.texture;
            this.symbols[arr_index][i].value.textures = symbol.textures;
            this.symbols[arr_index][i].value.alpha = 0;
            this.symbols[arr_index][i].type = index - 1;
        }
        container.position.y = this.reelposy;
    }

    private checkPatterns(combinations: any){
        let characters: any = [];
        let tmp: any = combinations[0].type;
        if(tmp == 10){
            tmp = combinations[1].type;
        }
        if(tmp == 10){
            tmp = combinations[2].type;
        }
        if(tmp == 10){
            tmp = combinations[3].type;
        }
        if(tmp == 10){
            tmp = combinations[4].type;
        }
        if(tmp != 10){
            if(tmp == 9){
                // //combo 3
                // if(combinations[0].type == 9 && combinations[1].type == 9  && combinations[2].type == 9 ){
                //     characters.push(combinations[0]);
                //     characters.push(combinations[1]);
                //     characters.push(combinations[2]);
                // }
                // //combo 4
                // if(combinations[0].type == 9 && combinations[1].type == 9  && combinations[2].type == 9  && combinations[3].type == 9 ){
                //     characters.push(combinations[3]);
                // }
                // //combo 5
                // if(combinations[0].type == 9 && combinations[1].type == 9  && combinations[2].type == 9 && combinations[3].type == 9  && combinations[4].type == 9 ){
                //     characters.push(combinations[4]);
                // }
            }
            else{
                //combo 3
                if((combinations[0].type == tmp || combinations[0].type == 10) && (combinations[1].type == tmp || combinations[1].type == 10) && (combinations[2].type == tmp || combinations[2].type == 10)){
                    characters.push(combinations[0]);
                    characters.push(combinations[1]);
                    characters.push(combinations[2]);
                    
                }
                //combo 4
                if((combinations[0].type == tmp || combinations[0].type == 10) && (combinations[1].type == tmp || combinations[1].type == 10) && (combinations[2].type == tmp || combinations[2].type == 10) && (combinations[3].type == tmp || combinations[3].type == 10)){
                    characters.push(combinations[3]);
                }
                //combo 5
                if((combinations[0].type == tmp || combinations[0].type == 10) && (combinations[1].type == tmp || combinations[1].type == 10) && (combinations[2].type == tmp || combinations[2].type == 10) && (combinations[3].type == tmp || combinations[3].type == 10) && (combinations[4].type == tmp || combinations[4].type == 10)){
                    characters.push(combinations[4]);
                }
            }
        }
        else{
            //wild
            //combo 3
            if(combinations[0].type == 10 && combinations[1].type == 10  && combinations[2].type == 10 ){
                characters.push(combinations[0]);
                characters.push(combinations[1]);
                characters.push(combinations[2]);
            }
            //combo 4
            if(combinations[0].type == 10 && combinations[1].type == 10  && combinations[2].type == 10  && combinations[3].type == 10 ){
                characters.push(combinations[3]);
            }
            //combo 5
            if(combinations[0].type == 10 && combinations[1].type == 10  && combinations[2].type == 10 && combinations[3].type == 10  && combinations[4].type == 10 ){
                characters.push(combinations[4]);
            }
        }

        let totalwin: number = 0;
        let type: number = 0;
        let wilds: number = 0;
        let bonus: number = 0;
        let pattern: number = 0;
        characters.forEach((symbol: any) => {
            if(symbol.type == 10){
                wilds+=1;
            }
            if(symbol.type == 9){
                bonus+=1;
            }
            pattern += 1;
            type = tmp + 1;
        });
        
        if(pattern > 0){
            if(bonus >= 3){
            }
            else{
                let bet: any = this.mybet;
                json.PAYOUTFORMULA.forEach(payout => {
                    if(payout.HM == pattern && payout.TYPE == type && payout.WILDS == wilds){
                        totalwin += (payout.PAY * this.rtp) * bet;
                    }
                });
            }
        }
        return {symbol:characters, payout: totalwin, bonus};
    }

    public updateBlocksSize(anchor: number, bool: Boolean){
        this.reelscontainer.forEach((element, index) => {
            this.symbols[index].forEach((symbol: any) => {
                symbol.value.anchor.set(anchor);
                if(bool){
                    symbol.value.position.y += symbol.value.width / 2;
                }
                else{
                    symbol.value.position.y -= symbol.value.width / 2;
                }
            });
            if(bool){
                element.position.x += element.width / 2;
            }
            else{
                element.position.x -= element.width / 2;
            }
        });
    }

    private enlargeCharacters(characters: any, totalwin: number, randomresult: Array<number>, sortresult: Array<number>, paylines_name: Array<String>, paylines_count: Array<Number>, paylines_pay: Array<Number>, paylines_symbols: Array<any>){
        this.enlargecharacters = true;
        this.reelscontainer.forEach((element, index) => {
            element.mask = null;
            this.reelsmaskcontainer[index].alpha = 0;
        });

        let new_char: any = [];
        characters.forEach((char: any) => {
            new_char.push(char.value)
        });

        new_char.forEach((char: any) => {
            char.animationSpeed = .3;
            char.play();
        });
        this.newchar2 = new_char;
        this.newtotal = totalwin;
        let timein = .5;
        let interval = 0;
        // let doneinterval = 1500;
        if(this.interval == 5){
            timein = .4;
            // doneinterval = 1000;
        }
        if(paylines_name.length > 0){
            timein = timein * paylines_name.length;
        }
        paylines_name.forEach((element: any, edex: number) => {
            this.paylinecounter++;
            let len = paylines_count[edex];
            let sprite;
            let pattern = 0;
            if(element == 'p1'){
                sprite = this.payline_patter_1;
                pattern = 1;
            }
            else if(element == 'p2'){
                sprite = this.payline_patter_2;
                pattern = 2;
            }
            else if(element == 'p3'){
                sprite = this.payline_patter_3;
                pattern = 3;
            }
            else if(element == 'p4'){
                sprite = this.payline_patter_4;
                pattern = 4;
            }
            else if(element == 'p5'){
                sprite = this.payline_patter_5;
                pattern = 5;
            }
            else if(element == 'p6'){
                sprite = this.payline_patter_6;
                pattern = 6;
            }
            else if(element == 'p7'){
                sprite = this.payline_patter_7;
                pattern = 7;
            }
            else if(element == 'p8'){
                sprite = this.payline_patter_8;
                pattern = 8;
            }
            else{
                sprite = this.payline_patter_9;
                pattern = 9;
            }
            this.startPaylineAnimate(sprite, len, this.paylinecounter, paylines_name.length, pattern, paylines_symbols[edex], paylines_pay[edex]);
        });

        this.enlarge = gsap.to(new_char, {
            duration: timein,
            ease: "none",
            height: 290,
            width: 290,
            yoyo: true,
            repeat: 3,
            onStart:() => {
                // this.soundPlay(7)
            },
            onComplete: () => {
                this.enlarge.kill();
                this.updateBlocksSize(0, false);
                // this.soundStop(7);
                new_char.forEach((char: any) => {
                    char.gotoAndStop(0);
                });
                if(randomresult.length > 0){
                    if(paylines_name.length == 0){
                        this.enlargecharacters = false;
                        this.doneinterval = 1500;
                        this.playAgain(this.newchar2);
                    }
                    new_char.forEach((char: any) => {
                        char.gotoAndStop(0);
                    });
                    this.bonusgame(randomresult, sortresult);
                }
                this.playAgain(this.newchar2);
            }
        });
    }

    public playAgain(new_char: any = []){
        this.isbonus = false;
        this.isbonusArr = [];
        this.changebutton();
        this.setbuttonstrue();
        if(!this.paylinebool){
            this.updatebottonpayline('SPIN TO WIN!');
            this.autospintext();
        }
        else{
            let settimeout = setTimeout(() => {
                this.autospintext();
                this.updatebottonpayline('SPIN TO WIN!');
                clearTimeout(settimeout)
            }, 1200)
        }
        this.paylinecounter = 0;
        this.spinreel = [];
        this.startreel = true;
        this.reelscontainer.forEach((element, index) => {
            element.mask = this.reelsmaskcontainer[index];
            this.reelsmaskcontainer[index].alpha = 1;
            this.symbols[index].forEach((symbol: any) => {
                symbol.value.alpha = 1;
            });
            // new_char.forEach((char: any) => {
            //     char.gotoAndStop(0);
            // });
        });
    }
    
    private startPaylineAnimate(sprite: any, len: any, interval: any, paylen: number, pattern: number, paylines_symbols: any, paylines_pay: any){
        this.paylinebool = true;
        let updatepayline = true;
        let updatepayline2 = true;
        for(let i = 0; i < len; i++){
            let animate = gsap.to(sprite[i], {
                delay: (interval - 1) * 1.5,
                duration: 1.5,
                onStart: () => {
                    sprite[i].visible = true;
                    sprite[i].play();
                },
                onComplete: () => {
                    sprite[i].visible = false;
                    sprite[i].gotoAndStop(0);
                    if(updatepayline){
                        updatepayline = false;
                        this.updatebottonpayline2(paylines_symbols, paylines_pay, pattern);
                    }
                    if(paylen == interval){
                        this.enlargecharacters = false;
                        this.doneinterval = 1500;
                        if(updatepayline2){
                            updatepayline2 = false;
                            this.updatebottonpayline(`WIN: ${this.newtotal.toFixed(2)}`);
                            this.updatebalancewin(this.newtotal);
                        }
                        // this.playAgain(this.newchar2);
                    }
                    animate.kill();
                }
            });
            this.paylineanimation.push(animate);
        }
    }

    private createPaylines(){
        //payline1
        let posy_p1 = 160;
        let posx_p1 = [237,535,829,1130,1429];
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_1', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            payline.position.x = posx_p1[i];
            payline.position.y = posy_p1;
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_1.push(payline)
        }
        //payline2
        let posy_p2 = 410;
        let posx_p2 = [237,535,829,1130,1429];
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_2', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            payline.position.x = posx_p2[i];
            payline.position.y = posy_p2;
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_2.push(payline)
        }
        //payline3
        let posy_p3 = 660;
        let posx_p3 = [237,535,829,1130,1429];
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_3', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            payline.position.x = posx_p3[i];
            payline.position.y = posy_p3;
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_3.push(payline)
        }
        //payline4
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_4', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_3[0].position.x;
                payline.position.y = this.payline_patter_3[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_3[1].position.x;
                payline.position.y = this.payline_patter_3[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_2[2].position.x;
                payline.position.y = this.payline_patter_2[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_3[3].position.x;
                payline.position.y = this.payline_patter_3[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_3[4].position.x;
                payline.position.y = this.payline_patter_3[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_4.push(payline)
        }
        //payline5
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_5', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_1[0].position.x;
                payline.position.y = this.payline_patter_1[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_1[1].position.x;
                payline.position.y = this.payline_patter_1[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_2[2].position.x;
                payline.position.y = this.payline_patter_2[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_1[3].position.x;
                payline.position.y = this.payline_patter_1[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_1[4].position.x;
                payline.position.y = this.payline_patter_1[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_5.push(payline)
        }
        //playline6
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_6', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_2[0].position.x;
                payline.position.y = this.payline_patter_2[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_3[1].position.x;
                payline.position.y = this.payline_patter_3[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_3[2].position.x;
                payline.position.y = this.payline_patter_3[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_3[3].position.x;
                payline.position.y = this.payline_patter_3[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_2[4].position.x;
                payline.position.y = this.payline_patter_2[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_6.push(payline)
        }
        //playline7
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_7', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_2[0].position.x;
                payline.position.y = this.payline_patter_2[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_1[1].position.x;
                payline.position.y = this.payline_patter_1[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_1[2].position.x;
                payline.position.y = this.payline_patter_1[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_1[3].position.x;
                payline.position.y = this.payline_patter_1[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_2[4].position.x;
                payline.position.y = this.payline_patter_2[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_7.push(payline)
        }
        //playline8
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_8', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_1[0].position.x;
                payline.position.y = this.payline_patter_1[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_2[1].position.x;
                payline.position.y = this.payline_patter_2[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_3[2].position.x;
                payline.position.y = this.payline_patter_3[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_2[3].position.x;
                payline.position.y = this.payline_patter_2[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_1[4].position.x;
                payline.position.y = this.payline_patter_1[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_8.push(payline)
        }
        //playline9
        for(let i = 0; i < 5; i++){
            const payline = Functions.loadSprite(this.app.loader, 'payline_9', '', true);
            payline.animationSpeed = .3;
            payline.width = 250;
            payline.height = 240;
            if(i == 0){
                payline.position.x = this.payline_patter_3[0].position.x;
                payline.position.y = this.payline_patter_3[0].position.y;
            }
            else if(i == 1){
                payline.position.x = this.payline_patter_2[1].position.x;
                payline.position.y = this.payline_patter_2[1].position.y;
            }
            else if(i == 2){
                payline.position.x = this.payline_patter_1[2].position.x;
                payline.position.y = this.payline_patter_1[2].position.y;
            }
            else if(i == 3){
                payline.position.x = this.payline_patter_2[3].position.x;
                payline.position.y = this.payline_patter_2[3].position.y;
            }
            else{
                payline.position.x = this.payline_patter_3[4].position.x;
                payline.position.y = this.payline_patter_3[4].position.y;
            }
            // payline.play();
            payline.visible = false;
            this.slotcontainer.addChild(payline);
            this.payline_patter_9.push(payline)
        }
    }
}

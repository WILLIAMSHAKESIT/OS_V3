import * as PIXI from 'pixi.js';
import Functions from '../../Functions';
import { gsap } from 'gsap';

export default class Excellent {
    private app: PIXI.Application;
    public container: PIXI.Container;
    private coins: PIXI.AnimatedSprite;
    private logo: PIXI.AnimatedSprite;
    private leftCoinAnimation: any;
    private rightCoinAnimation: any;
    private coinsContainer: PIXI.Container;
    private overlay: PIXI.Graphics;
    private displayMoney: PIXI.Text;
    private money: number = 0;
    private overlayScale: any;
    private overlayShow: any;
    private animateMoney: any;
    openmodal: (bool: Boolean) => void;

    constructor(app: PIXI.Application, openmodal: (bool: Boolean) => void, money: number) {
        this.app = app;
        this.container = new PIXI.Container();
        this.coinsContainer = new PIXI.Container();
        this.leftCoinAnimation = new PIXI.Container();
        this.rightCoinAnimation = new PIXI.Container();
        this.money = money;
        this.openmodal = openmodal;
        this.init();
    }

    private init(){
        this.createOverlay();
        this.createWinLogo();
        this.createCoin();
        this.createDisplayMoney();
        this.show();
    }

    private finishQuick(){
        this.overlayScale.duration(0.01);
        this.animateMoney.duration(0.01);
        this.overlayShow.duration(0.01);
        this.leftCoinAnimation.kill();
        this.rightCoinAnimation.kill();
        this.overlay.removeListener('pointerdown');
        this.hide();
    }

    private hide() {
        const overlayHide = gsap.to(this.overlay, {
          alpha: 0,
          duration: 0.8,
          onComplete: () => {
            overlayHide.kill();
          }
        });
        const overlayScale = gsap.to(this.logo.scale, {
          x: 0,
          y: 0,
          duration: 0.8,
          onComplete: () => {
            overlayScale.kill();
          }
        });
        const overlayMoney = gsap.to(this.displayMoney, {
          alpha: 0,
          duration: 0.8,
          onComplete: () => {
            overlayMoney.kill();
          }
        });
        const coinsContainer = gsap.to(this.coinsContainer, {
          alpha: 0,
          duration: 0.8,
          onComplete: () => {
            this.container.removeChild(this.coinsContainer);
            this.container.removeChild(this.overlay);
            this.container.removeChild(this.displayMoney);
            this.container.removeChild(this.logo);
            this.app.stage.removeChild(this.container);
            this.openmodal(false);
            coinsContainer.kill();
          }
        });
    }

    private createOverlay(){
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0x000000, .7)
                .drawRect(0,0,this.app.screen.width, this.app.screen.height)
                .endFill();
        this.overlay.alpha = 0.01;
        this.overlay.interactive = true;
        this.overlay.buttonMode = true;
        this.container.addChild(this.overlay);

        //events
        this.overlay.addListener("pointerdown", ()=>{
            this.finishQuick()
        })
    }

    private createWinLogo() {
        this.logo = Functions.loadSprite(this.app.loader, 'Excellent', '', true);
        this.logo.anchor.set(0.5);
        this.logo.x = (this.app.screen.width) / 2;
        this.logo.y = (this.app.screen.height) / 2;
        this.logo.scale.set(0.6);
        this.logo.animationSpeed = .2;
        this.logo.play();
        this.container.addChild(this.logo)
    }

    private createCoin(){
        // LEFTCOINS
        for(let count = 0; count < 5; count++){
            let coin: any = Functions.loadSprite(this.app.loader, 'coin', '', true);
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.55, 0.75));
            coin.anchor.set(0.5);
            coin.animationSpeed = this.randMinMax(0.3, 0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = - coin.width;
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.leftCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x += accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                    coinSpeed = 0.15;
                    accelX = this.randMinMax(7.5, 11.5);
                    coin.y = this.app.screen.height - this.randMinMax(100,550);
                    coin.scale.set(this.randMinMax(0.55, 0.75));
                    coin.x = - coin.width;
                    this.leftCoinAnimation.repeat();
                    }
                }
            })
        }

        // RIGHTCOINS
        for(let count = 0; count < 5; count++){
            let coin: any = Functions.loadSprite(this.app.loader, 'coin', '', true);
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.55, 0.75));
            coin.anchor.set(0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = this.app.screen.width + (coin.width/2);
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.rightCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x -= accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                        coinSpeed = 0.15;
                        accelX = this.randMinMax(7.5, 11.5);
                        coin.y = this.app.screen.height - this.randMinMax(100,550);
                        coin.scale.set(this.randMinMax(0.55, 0.75));
                        coin.x = this.app.screen.width;
                        this.rightCoinAnimation.repeat();
                    }
                }
            })
        }

        this.container.addChild(this.coinsContainer);
    }

    private createDisplayMoney() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 100,
            fillGradientType: 0,
            fill: ['#f1c001', '#bf6600'],
            fillGradientStops: [0.4, 0.9],
            fontWeight: 'bold',
            stroke: "#00000080",
            strokeThickness: 5,
            letterSpacing: 3,
            dropShadow: true,
            dropShadowAlpha: 0.5,
            dropShadowDistance: 0,
            dropShadowBlur: 3
        });

        this.displayMoney = new PIXI.Text('', style);
        this.displayMoney.y = ((this.app.screen.height - this.displayMoney.height) / 2) + 20;
        this.displayMoney.y += 100;

        this.container.addChild(this.displayMoney);
    }

    private show() {
        this.overlayShow = gsap.to(this.overlay, {
          alpha: 1,
          duration: 0.8,
          onComplete: () => {
            this.overlayShow.kill();
          }
        });
        this.overlayScale = gsap.to(this.logo.scale, {
          x: 1,
          y: 1,
          duration: 0.8,
          onComplete: () => {
            this.overlayScale.kill();
          }
        });
        let target = { val: 0 };
        this.animateMoney = gsap.to(target, {
          val: this.money,
          duration: 4,
          ease: "power1.in",
          onUpdate: () => {
            this.displayMoney.text = `${this.formatNum(target.val)}`;
            this.displayMoney.x = (this.app.screen.width - this.displayMoney.width) / 2;
          },
          onComplete: () => {
            this.animateMoney.kill();
          }
        })
    }
    
    private randMinMax(min:number, max:number){
        let random = Math.random() * (max - min) + min;

        return random;
    }

    private formatNum (num: number, decimals: number = 2){
        return num.toFixed(decimals).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}

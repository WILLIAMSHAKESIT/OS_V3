import * as PIXI from "pixi.js";

//RESPONSIVE SCREEN
const screenSize = () => {
  let isSafe
  var game = {
    width : 0,
    height : 0,
    safeWidth : 0,
    safeHeight: 0
  }

  var viewport, newGameWidth, newGameHeight, newGameX, newGameY, baseWidth, baseHeight, screentype;

  if(window.innerWidth>window.innerHeight){
    screentype = "landscape";
    baseWidth = 2560;
    baseHeight = 1600
    game = {
        width: 1280,
        height: 800,
        safeWidth: 1024,
        safeHeight: 720
    }
  }else{
    screentype = "portrait";
    baseWidth= 1600;
    baseHeight = 2560; 
    game = {
        width: 800,
        height: 1280,
        safeWidth: 720,
        safeHeight: 1024
    }
  }

  viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Determine game size
  if (game.height / game.width > viewport.height / viewport.width) {
    if (game.safeHeight / game.width > viewport.height / viewport.width) {
      // A
      newGameHeight = viewport.height * game.height / game.safeHeight;
      newGameWidth = newGameHeight * game.width / game.height;
      isSafe = 'A'
    } else {
      // B
      // triggers when landscape mode starts scaling
      newGameWidth = viewport.width;
      newGameHeight = newGameWidth * game.height / game.width;
      isSafe = 'B'
    }
  } else {
    if (game.height / game.safeWidth > viewport.height / viewport.width) {
      // C
      newGameHeight = viewport.height;
      newGameWidth = newGameHeight * game.width / game.height;
      isSafe = 'C'
    } else {
      // D
      newGameWidth = viewport.width * game.width / game.safeWidth;
      newGameHeight = newGameWidth * game.height / game.width;
      isSafe = 'D'
    }
  }

  newGameX = (viewport.width - newGameWidth) / 2;
	newGameY = (viewport.height - newGameHeight) / 2;

  return {
    screentype,
    newGameX,
    newGameY,
    newGameWidth,
    newGameHeight,
    baseWidth,
    baseHeight,
    game,
    isSafe
  }
}

//GET SPRITE
const loadSprite = (loader: PIXI.Loader, asset: any, name: string, textures: Boolean = false) => {
  let img: any = null;
  let imgarr: any = [];
  let sprite: any = null;
  if(textures){
    for(let sprite in loader.resources![`${asset}`].textures){
      const spritetexture = PIXI.Texture.from(sprite);
      imgarr.push(spritetexture);
    } 
    sprite = new PIXI.AnimatedSprite(imgarr);
    imgarr = [];
  }
  else{
    img = loader.resources![`${asset}`].textures![name];
    sprite = new PIXI.Sprite(img);
    img = null;
  }

  return sprite;
}

// SCALING SIZES
const scaleSizeFixedHeight = (height: number, sprite: PIXI.Sprite) => {
  const h = sprite.height;
  const w = sprite.width;

  return (w / h) * height;
}

const scaleSizeFixedWidth = (width: number, sprite: PIXI.Sprite) => {
  const h = sprite.height;
  const w = sprite.width;

  return (h / w) * width;
}

//RANDMON INT
const getRandomInt = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const formatNumber = (number: any) => {
  let newnumber = number.toLocaleString("en-US");
  return newnumber;
}


export default {
  loadSprite,
  scaleSizeFixedHeight,
  scaleSizeFixedWidth,
  getRandomInt,
  formatNumber,
  screenSize
}
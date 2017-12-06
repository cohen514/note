/**
 * Created by Administrator on 2017/11/29.
 */
const resizeMemos = () => {
  let memoWidth = $('.memo').eq(0).width();
  $('.memo').height(memoWidth+65);
  $('.memo .content').width(memoWidth).height(memoWidth);
};

const showEditorLayer = ($editorLayer) => {
  $(window).scrollTop(0);
  $('.cover-layer').fadeIn();
  $editorLayer.fadeIn();
  $('body').css('overflow','hidden');
  if(!window.isMobile){
    $('.navbar').css('padding-right','15px');
    $('body').css('padding-right','15px');
  }
};
const hideEditorLayer = ($editorLayer) => {
  $('.cover-layer').fadeOut();
  $editorLayer.hide();
  $('body').css('overflow','scroll');
  if(!window.isMobile){
    $('.navbar').css('padding-right','0');
    $('body').css('padding-right','0');
  }
};

const initCanvas = (canvasEle,colorsEle,controllersEle,imageData) => {
  const colorTable = [
    {
      name:'black',
      regularCode:'#222',
      opagueCode:'rgb(189,189,189)'
    },
    {
      name:'green',
      regularCode:'#5cb85c',
      opagueCode:'rgb(206,234,206)'
    },
    {
      name:'yellow',
      regularCode:'#f0ad4e',
      opagueCode:'rgb(251,231,202)'
    },
    {
      name:'red',
      regularCode:'#d9534f',
      opagueCode:'rgb(244,203,202)'
    },
    {
      name:'white',
      regularCode:'#fff',
      opagueCode:'#fff'
    }
  ];

  let ctx = canvasEle.getContext('2d');
  let selectedColor = null;
  let hasOnGoingStroke = false;
  let prevStatusStack = [];
  let futureStatusStack = [];
  let $canvas = $(canvasEle);

  const loadImageData = (data) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src=data;
    img.onload = () => {
      clearCanvas();
      ctx.drawImage(img,0,0)
    }
  };

  const saveImageData = () => {
    let currentStatus = canvasEle.toDataURL();
    prevStatusStack.unshift(currentStatus);
  };

  const clearCanvas = () => {
    ctx.clearRect(0,0,260,260);
  };

  if(imageData !== null){
    loadImageData(imageData);
  }

  saveImageData();

  $(colorsEle).children('li').on('click',function(){
    let $this = $(this);
    const tarColorName = $this.data('color');
    selectedColor = colorTable.find((item) => {
        return item.name ===  tarColorName;
      });
  $this.siblings('.current').removeClass('current').end().addClass('current');
}).siblings('[data-color=black]')
  .click();

  $canvas.on('mousedown touchstart', (evt) => {
    let x,y;
    switch (evt.type) {
      case 'touchstart':
            x = evt.touches[0].clientX - $canvas.offset().left;
            y = evt.touches[0].clientY - $canvas.offset().top;
            break;
      default :
            x = evt.offsetX;
            y = evt.offsetY;
            break;
    }
    hasOnGoingStroke = true;
    ctx.strokeStyle = selectedColor.opagueCode;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.beginPath();
    ctx.moveTo(x,y);
  }).on('mousemove touchmove', (evt) => {
    if(hasOnGoingStroke === true) {
      let x,y;
      switch (evt.type) {
        case 'touchmove':
              x = evt.changedTouches[0].clientX - $canvas.offset().left;
              y = evt.changedTouches[0].clientY - $canvas.offset().top;
              break;
        default :
              x = evt.offsetX;
              y = evt.offsetY;
              break;
      }
      ctx.lineTo(x,y);
      ctx.stroke();
    }
  }).on('mouseout mouseup touchend', (evt) => {
    if(hasOnGoingStroke === true){
      let x,y;
      switch (evt.type) {
        case 'touchend' :
              x = evt.changeTouches[0].clientX - $canvas.offset().left;
              y = evt.changeTouches[0].clientY - $canvas.offset().top;
              break;
        default :
              x = evt.offsetX;
              y = evt.offsetY;
              break;
      }
      ctx.strokeStyle = selectedColor.regularCode;
      ctx.lineTo(x,y);
      ctx.stroke();
      hasOnGoingStroke = false;
      saveImageData();
    }
  });

  $(controllersEle).children('.undo').on('click', (evt) => {
    if(prevStatusStack.length !== 0) {
      loadImageData(prevStatusStack[0]);
      let currentStep = prevStatusStack.splice(0,1);
      futureStatusStack.unshift(currentStep);
    }
  }).end().children('.redo').on('click', (evt) => {
    if(futureStatusStack.length !== 0) {
      loadImageData(futureStatusStack[0]);
      let currentStep = futureStatusStack.splice(0,1);
      prevStatusStack.unshift(currentStep);
    }
  }).end().children('.clear').on('click',() => {
    clearCanvas();
  })
};

let helpers = {
  resizeMemos,
  showEditorLayer,
  hideEditorLayer,
  initCanvas
};

export default helpers;

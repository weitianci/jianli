// import { func } from "prop-types";

let loadingRender = (function () {
    let $mainBox = $('.mainBox'),
        $loadingBox = $mainBox.find('.loadingBox'),
        $detailBox = $mainBox.find('.detailBox'),
        $current = $loadingBox.find('.current'),
        musicAudio = $('#musicAudio')[0],
        $playBtn = $mainBox.find('.playBtn'),
        $music = $playBtn.find('.music');
    let imgData = ["img/head.webp", "img/dragon.gif", "img/brush.webp", "img/font1.webp", "img/font2.webp", "img/jian.webp", "img/li.webp", "img/music.svg", "img/left.webp", "img/right.webp", "img/loong.jpg", "img/background.webp", "img/font_background.webp", "img/logo_left.webp", "img/logo_right.webp", "img/mozhi.webp", "img/water.png", "img/font_background2.webp"]
    //预加载图片
    let n = 0,
        len = imgData.length;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', ((++n) / len) * 100 + '%');
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback();
                }
            };
            tempImg.src = item;
        });
    };
    let delayTimer = null;
    let maxDelay = function maxDelay(callback) {
        delayTimer = setTimeout(() => {
            if (n / len >= 0.9) {
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('非常遗憾，当前您的网络状况不佳，请稍候再试！');
        }, 10000);
    };
    let done = function done() {
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);
            detailRender.init();
        }, 1000);
    };
    //音乐播放
    let $plan = $.Callbacks();
    let playRun = function playRun() {
        musicAudio.play();
        musicAudio.addEventListener('canplay', $plan.fire);
    };
    //控制暂停播放
    $plan.add(() => {
        $music.css('display', 'block').addClass('move');
        $playBtn.tap(() => {
            if (musicAudio.paused) {
                musicAudio.play();
                $music.addClass('move');
                return;
            }
            musicAudio.pause();
            $music.removeClass('move');
        });
    });
    return {
        init: function () {
            $loadingBox.css('display', 'block');
            run(done);
            maxDelay(done);
            playRun();
        }
    }
})();
let detailRender = (function () {
    let
        $mainBox = $('.mainBox'),
        $detailBox = $mainBox.find('.detailBox'),
        swiper = null;
    let swiperInit = function () {
        swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            loop: true,
            effect: 'slide',
            fade: {
                crossFade: false,
            },
            on: {
                slideChangeTransitionStart: function () {
                    console.log(this); //切换结束时，告诉我现在是第几个slide
                    this.slides[this.activeIndex].getElementsByClassName('qqq')[0].style.display='none';
                    setTimeout(()=>{
                        this.slides[this.activeIndex].getElementsByClassName('qqq')[0].style.display='block';
                    },10)
                    
                },
            },
        });
    };
    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');
            if (!swiper) {
                swiperInit();
            }
            swiper.slideTo(index, 0);
        }
    }
})();
let url = window.location.href,
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);
switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
}
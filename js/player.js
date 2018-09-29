/*
 * @Author: Mr.Miao
 * @Date:   2018-08-19 17:04:51
 * @Last Modified by:   Mr.Miao
 * @Last Modified time: 2018-09-28 11:30:33
 */

// 音乐播放器
var $audio = document.getElementById("audio");
// 播放开关
var audioBtn = true;
// 定时器
var iTimer = null;
// 播放当前时间
var currentTime = null;
// 总时长
var duration = null;
// 音量
var volume = null;
// 音量是否静音
var volumeBtn = true;
// 默认音量
$audio.volume = 0.5;
volume = 0.5;
// 开始或暂停
var mBtn = $("#play");
// 上一首
var prev = $("#prev");
// 下一首
var next = $("#next");
// 播放当前时间
var currentTimeTxt = $("#currentTime");
var jinduDiv = $("#jindu");
// 总时长
var durationTxt = $("#duration");
// 音量
var volumeA = $("#volume");
var volumeDiv = $("#volume-jd");

var num = 0;
var arr = [1, 2, 3];

var $music = {
    init: function() {
        // $music.m_play();
        $music.m_click();
        // $music.m_prev_click();
        // $music.m_next_click();
        $music.m_time_jd();
        $music.m_volume();
        $music.m_volume_jd();
    },
    m_time: function() {
        clearInterval(iTimer);
        iTimer = setInterval(function() {
            // 记录时间
            duration = $audio.duration;
            currentTime = $audio.currentTime;
            // 写入时间
            durationTxt.html(psn_time($audio.duration));
            currentTimeTxt.html(psn_time($audio.currentTime));
            var num = Number(currentTime / duration * 100) + "%";
            $(".jindu-width").css({ width: num });
            if (duration == currentTime) {
                // $music.m_next()
            }
        }, 1000)
    },
    m_play: function() {
        // 播放
        $audio.play();
        $music.m_time();
    },
    m_pause: function() {
        // 暂停
        $audio.pause();
        clearInterval(iTimer);
    },
    m_click: function() {
        mBtn.click(function() {
            if (audioBtn) {
                $music.m_play();
                $(this).removeClass('player-pause');
                audioBtn = false;
            } else {
                $music.m_pause();
                $(this).addClass('player-pause');
                audioBtn = true;
            }
        });
    },
    m_prev: function() {
        num--;
        if (num < 0) { num = 2 }
        $audio.src = 'music/' + arr[num] + '.mp3';
        $audio.play();
    },
    m_prev_click: function() {
        prev.click(function() {
            $music.m_prev();
        })
    },
    m_next: function() {
        num++;
        if (num > 2) { num = 0 }
        $audio.src = 'music/' + arr[num] + '.mp3';
        $audio.play();
    },
    m_next_click: function() {
        next.click(function() {
            $music.m_next();
        })
    },
    m_time_jd: function() {
        jinduDiv.click(function(event) {
            var width = $(this).width();
            var l = $(this).offset().left;
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = e.pageX || e.clientX + scrollX;

            var num = Number((x - l) / width * 100) + "%";
            $(".jindu-width").css({ width: num })

            $audio.currentTime = Number((x - l) / width) * duration;
            currentTime = $audio.currentTime;
            currentTimeTxt.html(psn_time(currentTime));

            $music.m_time();
        });
    },
    m_volume: function() {
        volumeA.click(function() {
            if (volumeBtn) {
                $audio.volume = 0;
                volumeBtn = false;
                $(this).addClass('volume-none');
                $("#volume-jd-width").css({ width: 0 })
            } else {
                $audio.volume = volume;
                volumeBtn = true;
                $(this).removeClass('volume-none');
                var num = Number(volume * 100) + "%";
                $("#volume-jd-width").css({ width: num })
            }
        });
    },
    m_volume_jd: function() {
        volumeDiv.click(function(event) {
            var width = $(this).width();
            var l = $(this).offset().left;
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = e.pageX || e.clientX + scrollX;

            var num = Number((x - l) / width * 100) + "%";
            $("#volume-jd-width").css({ width: num });

            $audio.volume = parseFloat((x - l) / width).toFixed(1);
            volume = $audio.volume;

            if (volume == '0') {
                volumeA.addClass('volume-none');
            } else {
                volumeA.removeClass('volume-none');
            }
        });
    }
}

$music.init();
var audioStatus = "paused";
$audio.addEventListener("playing", function() {
    audioStatus = "playing";
});
$audio.addEventListener("pause", function() {
    audioStatus = "paused";
});

window.addEventListener('message', function(event) {
    var msg = eval(event).data;
    if(!!!msg){}else{
        $audio.src = msg;
        dy();
    }
}, false);

function dy() {
    if (audioStatus == 'playing') {
        $audio.play();
        mBtn.removeClass('player-pause');
        audioBtn = false;
    }
}

function psn_time(m) {
    if (!!!m) {
        return '00:00:00';
    }
    var hours = Math.floor(m / 3600);
    var minutes = Math.floor((m % 3600) / 60);
    var seconds = Math.floor(m % 60);

    if (hours < 10) { hours = "0" + hours } else { hours = hours }
    if (minutes < 10) { minutes = "0" + minutes } else { minutes = minutes }
    if (seconds < 10) { seconds = "0" + seconds } else { seconds = seconds }
    return hours + ":" + minutes + ":" + seconds;
}
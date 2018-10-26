/*
 * @Author: Mr.Miao
 * @Date:   2018-08-29 15:45:34
 * @Last Modified by:   Mr.Miao
 * @Last Modified time: 2018-10-19 16:47:41
 */
window.onload = function() {
    var ajaxTitle = document.getElementById("ivs_title").innerHTML.replace(/<script[^>]*>(.|\n)*<\/script>/ig, "").replace(/<style[^>]*>(.|\n)*<\/style>/ig, "").replace(/<!--.*?-->/ig, "").replace(/<[^>]*>/ig, "");
    var ajaxContent = document.getElementById("ivs_content").innerHTML.replace(/<script[^>]*>(.|\n)*<\/script>/ig, "").replace(/<style[^>]*>(.|\n)*<\/style>/ig, "").replace(/<!--.*?-->/ig, "").replace(/<[^>]*>/ig, "").replace(/&nbsp;/ig, "");
    document.getElementById("ivs_player").innerHTML = '<iframe src="https://tts.smgtech.net:8443/audioServer/player/player.html" id="music_player" name="music_player" style="border:none;padding:0;margin:0;width:100%;height:60px;"></iframe>';

    var url = 'https://tts.smgtech.net:8443/audioServer/api/submitTransfer';
    var getUrl = 'https://tts.smgtech.net:8443/audioServer/api/getMP3Url';

    setTimeout(function() {
        ajax({
            url: url, //请求地址
            type: "POST", //请求方式
            data: { title: ajaxTitle, content: ajaxContent }, //请求参数
            dataType: "json",
            success: function(response, xml) {
                var data = JSON.parse(response);
                if (data.status == '0') {
                    if (!!!data.mp3Url) {
                        getMp3Fn(data.fileId);
                    } else {
                        document.getElementById('music_player').contentWindow.postMessage(data.mp3Url,"https://tts.smgtech.net:8443/audioServer/player/player.html");
                    }
                }
            },
            fail: function(fail) {}
        });
    }, 1000)

    function getMp3Fn(id) {
        ajax({
            url: getUrl, //请求地址
            type: "POST", //请求方式
            data: { fileId: id }, //请求参数
            dataType: "json",
            success: function(response, xml) {
                var data = JSON.parse(response);
                if (data.status != '0') {
                    getMp3Fn(id);
                } else {
                    if (!!!data.mp3Url) {
                        getMp3Fn(id);
                    }else{
                        document.getElementById('music_player').contentWindow.postMessage(data.mp3Url,"https://tts.smgtech.net:8443/audioServer/player/player.html")
                    }
                }
            },
            fail: function(fail) {}
        });
    }


    function ajax(options) {
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
    }
    //格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        // arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }
}
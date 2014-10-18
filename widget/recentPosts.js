(function(){
    var jQuery;
    var jQuery_version  = "2.1.1";
    var defaults = {
        "script_name" : "recentPosts",
        "style_name"  : "style",
        "tag"         : "",
        "limit"       : 10,
        "html_id"     : "widget-container"
    };

    // jQuery がロードされていない場合は、headに追加
    if(window.jQuery === undefined || window.jQuery.fn.jquery !== jQuery_version){
        var script_tag = document.createElement("script");
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/"+jQuery_version+"/jquery.min.js");
        script_tag.onload = scriptLoadHandler;
        script_tag.onreadystatechange = function(){
            // IE対策
            if(this.readyState == "complete" || this.readyState == "loaded"){
                scriptLoadHandler();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    }else{
        jQuery = window.jQuery;
        main();
    }

    function scriptLoadHandler(){
        jQuery = window.jQuery.noConflict(true);
        main();
    }

    function getParams(args){
        var params = {};
        var query = args.substring(1);
        var vars = query.split("&");
        for(var i = 0; i < vars.length; i++){
            var tmp = vars[i].split("=");
            params[tmp[0]] = tmp[1];
        }
        return params;
    }

    function main(){
        jQuery(document).ready(function($){
            // scriptタグからgetのパラメータを取得
            var get;
            var scripts = document.getElementsByTagName("script");
            var i = scripts.length;
            while(i--){
                var pattern = new RegExp("(^|.*\/)" + defaults.script_name + "\.js");
                var match = scripts[i].src.match(pattern);
                if(match){
                    var url_array = scripts[i].src.split(defaults.script_name + "\.js");
                    get = getParams(url_array[1]);
                    break;
                }
            }
            // 外部CSSファイルを読み込む
            var style_path = url_array[0] + defaults.style_name + ".css";
            var css_link = $("<link>", {
                rel  : "stylesheet",
                type : "text/css",
                href : style_path
            });
            css_link.appendTo("head");

            var api_key = get.key   ? get.key   : null;
            var account = get.acc   ? get.acc   : null;
            var tag     = get.tag   ? get.tag   : defaults.tag;
            var limit   = get.limit ? get.limit : defaults.limit;
            var html_id = get.add   ? get.add   : defaults.html_id;
            var api_url = "http://api.tumblr.com/v2/blog/" + account + ".tumblr.com/posts";

            // Ajaxでコールバックされる関数
            callbackRecentBlog = function(data){
                var blog_title = data.response.blog.title;
                var blog_url   = data.response.blog.url;
                var posts      = data.response.posts;
                $("#" + html_id).append('<ul class="recent-lists"/>');
                for(var i = 0; i < posts.length; i++){
                    var post   = posts[i];
                    var title  = post["title"] || null;
                    var author = post["post_author"] || null;
                    if(title){
                        $("#" + html_id + " ul").append('<li class="recent-list"><a href="'+post['post_url']+'" class="recent-link">'+title+'<span class="post-author">'+author+'</span></a></li>');
                    }
                }
            };

            // Ajax通信、JSONPはAccess-Control-Allow-Originエラー対策
            $.ajax({
                type     : "GET",
                url      : api_url,
                dataType : "jsonp",
                data     : {
                    api_key : api_key,
                    tag     : decodeURI(tag),
                    limit   : limit,
                    jsonp   : "callbackRecentBlog"
                }
            });
        });
    }
})();

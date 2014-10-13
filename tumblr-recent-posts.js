(function($){
  $.fn.tumblrRecentPosts = function(options){
    var defaults = {
      apiKey  : "",
      account : "",
      limit   : 10
    };
    var setting = $.extend(defaults,options);
    return this.each(function(){
      var recent_posts = $(this);
      callbackRecentPosts = function(data){
        var posts = data.response.posts;
        recent_posts.append("<ul/>");
        for(var i = 0; i < posts.length; i++) {
          var post = posts[i];
          var title = post["title"] || null;
          if(title)
            recent_posts.find("ul").append("<li><a href=\"" + post['post_url'] + "\">" + title + "</a></li>");
        }
      };
      $.ajax({
        type     : "GET",
        url      : "http://api.tumblr.com/v2/blog/" + setting.account + ".tumblr.com/posts",
        dataType : "jsonp",
        data     : {
          api_key : setting.apiKey,
          limit   : setting.limit,
          jsonp   : "callbackRecentPosts"
        }
      });
    });
  }
})(jQuery);

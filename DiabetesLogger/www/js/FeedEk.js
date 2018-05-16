/*
* FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com   
*/
document.getElementById("divRss").nodeValue();

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: "",
            DateFormatLang:"en"
        }, opt); //the stated default value if not declared in index.html page
        
        var id = $(this).attr("id"), i, s = "", dt; //variables 
        $("#" + id).empty(); //this clears everything in the divRss page
        if (def.FeedUrl == undefined) return false; //return nothing if url is false and stop working
        
        var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount; //this creates a datebase statement to pull out the data from the url provided
        
        //below we call a ajax function
        //we use the ajax url by implementing yahoo api and encoding the database statement declared on top
        //we receive the data in json format
        //after that we use the json object data and pull out the necessory data from it
        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
            dataType: "json",
            success: function (data) {
                $('.loader-img').hide();
                $("#" + id).empty();
                if (!(data.query.results.rss instanceof Array)) {
                    data.query.results.rss = [data.query.results.rss];
                }
                $.each(data.query.results.rss, function (e, itm) {
                    
                    s += '<div class="each-item-list"><h2 class="post-title"><a href="' + itm.channel.item.link + '" target="' + def.TitleLinkTarget + '" >' + itm.channel.item.title + '</a></h2>';
                    
                    if (def.ShowPubDate){
                        dt = new Date(itm.channel.item.pubDate);
                        s += '<div class="itemDate">';
                        if ($.trim(def.DateFormat).length > 0) {
                            try {
                                moment.lang(def.DateFormatLang);
                                s += moment(dt).format(def.DateFormat);
                            }
                            catch (e){s += dt.toLocaleDateString();}                            
                        }
                        else {
                            s += dt.toLocaleDateString();
                        }
                        s += '</div>';
                    }
                    if (def.ShowDesc) {
                        s += '<div class="post-description">';
                         if (def.DescCharacterLimit > 0 && itm.channel.item.description.length > def.DescCharacterLimit) {
                            s += itm.channel.item.description.substring(0, def.DescCharacterLimit) + '...';
                        }
                        else {
                            s += itm.channel.item.description;
                         }
                         s += '</div>';
                    }
                    
                    s += '<hr class="hr-seperater">'; //seperator for each event (research on api based on server)
                });
                $("#" + id).append('<div class="xmlInfo"><h2 class="upper_title">Recent Feeds</h2>' + s + '</div>');
            }
        });
    };
})(jQuery);
/*
 *  Silverstripe all in one page - v0.1
 *  Shows all top level pages in one long scrolling page
 *  
 *
 *  Made by Corey Sewell - Guru Digital Media
 *  Under BSD-3-Clause License
 */
/**
 * Thanks to https://gist.github.com/irazasyed/6252033
 */
/* exported HashSearch */
var HashSearch = new _hashSearch();
function _hashSearch() {
    var params;

    this.set = function (key, value) {
        params[key] = value;
        this.push();
    };

    this.remove = function (key) {
        delete params[key];
        this.push();
    };


    this.get = function (key) {
        return params[key];
    };

    this.keyExists = function (key) {
        return params.hasOwnProperty(key);
    };

    this.push = function () {
        var hashBuilder = [], key, value;

        for (key in params) {
            if (params.hasOwnProperty(key)) {
                key = escape(key), value = escape(params[key]); // escape(undefined) == "undefined"
                hashBuilder.push(key + ((value !== "undefined") ? "=" + value : ""));
            }
        }
        window.location.hash = hashBuilder.join("&");
    };

    this.load = function () {
        params = {};
        var hashStr = window.location.hash, hashArray, keyVal, i;
        hashStr = hashStr.substring(1, hashStr.length);
        hashArray = hashStr.split("&");

        for (i = 0; i < hashArray.length; i++) {
            keyVal = hashArray[i].split("=");
            params[unescape(keyVal[0])] = (typeof keyVal[1] !== "undefined") ? unescape(keyVal[1]) : keyVal[1];
        }
    };
    this.load();
}
(function ($) {
    var settings = {
        /**
         * jQuery identifier for the man navigation element. Any anchors within will trigger a page scroll if the href relates to an included page
         */
        navWrap: ".nav.navbar-nav, nav.primary",
        /**
         * If there is a floating header, this should be the height of it,
         */
        topOffset: 0,
        /**
         * Delay after scrolling to switch of the isScolling flag
         */
        scrollStopTimeOut: 500,
        /**
         * Add this class any a within navwrap when a page is active ( and remove it from others )
         */
        anchorActiveClass: "active current",
        /**
         * Select the last page when the scroll position is less than bottomOffset from the bottom of the page
         */
        bottomOffset: 100,
        /**
         * Set the page as current when it its top position is within this threshold from the top of the view [ min, max ]
         */
        currentPageOffset: [-5, 100],
        /**
         * Effect to use when scrolling with a delay
         */
        scrollEaseEffect: "easeInOutExpo",
        /**
         * Amount of time to scroll from current position to destination
         */
        scrollTime: 1000
    }, $window = $(window), $document = $(document);
    $.entwine("ss.allInOnePage", function ($) {
        console.log("window.location.href....=" + window.location.href.match(/.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/)[1]);
        console.log("HashSearch.keyExists(\"url\")=" + HashSearch.keyExists("url"));
        console.log("HashSearch.get(\"url\")=" + HashSearch.get("url"));
        var scroller = {
            /**
             * Is the page currently scrolling to a location ( prevents events from firing )
             */
            isScrolling: false,
            /**
             * Record the last page id, if the same page is triggered twice or more in a row, this prevents google analytics etc being triggerd multiple times
             */
            lastId: null,
            /**
             * Path of the current URL
             */
            currentUrl: (HashSearch.keyExists("url")) ? HashSearch.get("url") : window.location.href.match(/.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/)[1]
        };
        /**
         * Bind to clicks of anchors. If the href of the click anchor matches a page segment, prevent default and scroll to it
         */
        $("a").click(function (e) {
            var pageUrls = [$(this).attr("href"), $(this).attr("href") + "home/"], $pageEl, i = 0;
            for (i = 0; i < pageUrls.length; i++) {
                $pageEl = $(".page-wrap[data-page-url=\"" + pageUrls[i] + "\"]");
                if ($pageEl.length) {
                    break;
                }
            }
            if ($pageEl && $pageEl.length) {
                e.preventDefault();
                $pageEl.scrollTo();
            }
        });
        $(".back-to-top a").click(function (e) {
            e.preventDefault();
            $("body,html").animate({scrollTop: 0}, settings.scrollTime, settings.scrollEaseEffect, function () {
                setTimeout(function () {
                    scroller.isScrolling = false;
                }, scroller.scrollStopTimeOut);
            });
        });
        $(".page-wrap").entwine({
            /**
             * If this page-wraps url matches the current URL, scroll directly to it
             *
             */
            onmatch: function () {
                var pageUrls = [this.pageUrl(), this.pageUrl().replace(/\/.*\/(.)/g, "/$1").replace(/home\/$/, "")];
                if ($.inArray(scroller.currentUrl, pageUrls) >= 0) {
                    this.scrollTo(0, pageUrls[0]);
                }
            },
            pageId: function () {
                return this.attr("data-page-id");
            },
            pageUrl: function () {
                return this.attr("data-page-url");
            },
            pageTitle: function () {
                return this.attr("data-page-title");
            },
            /**
             * Sets this page as current, triggers google analytics page view, sets up the URL/Page title and navigation links
             *
             */
            setAsCurrentPage: function () {
                var pageId = this.pageId(), gaOps = {
                    "hitType": "pageview",
                    "page": this.pageUrl()
                };
                if (pageId !== scroller.lastId) {
                    scroller.lastId = pageId;
                    if (this.pageTitle()) {
                        gaOps.title = this.pageTitle();
                        document.title = this.pageTitle();
                    }
                    if (this.pageUrl()) {
                        if (typeof ga !== "undefined") {
                            ga("send", gaOps);
                        } else if (typeof _gaq !== "undefined") {
                            _gaq.push(["_trackPageview", this.pageUrl()]);
                        }
                        if (scroller.currentUrl !== this.pageUrl()) {
                            if (typeof window.history.replaceState === "function") {
                                window.history.replaceState({}, "", this.pageUrl());
                            } else {
                                HashSearch.set("url", this.pageUrl());
                            }
                        }
                        $(settings.navWrap).find("." + settings.anchorActiveClass.replace(/\s{1,}/g, ", .")).removeClass(settings.anchorActiveClass);
                        $(settings.navWrap).find("a[href=\"" + this.pageUrl() + "\"]").parent().addClass(settings.anchorActiveClass);
                    }
                }
            },
            /**
             * Scroll to this page-wrap and set it as current
             *
             * @param int delay Animation delay effect, use 0 to be instant
             */
            scrollTo: function (delay) {
                scroller.isScrolling = true;
                delay = (delay !== undefined) ? delay : settings.scrollTime;
                var $elToScroll = $("body,html").stop(), scrollTop = this.offset().top - settings.topOffset, callBack = function () {
                    setTimeout(function () {
                        scroller.isScrolling = false;
                    }, scroller.scrollStopTimeOut);
                };
                this.setAsCurrentPage();
                if (delay > 0) {
                    $elToScroll.animate({scrollTop: scrollTop}, delay, settings.scrollEaseEffect, callBack);
                } else {
                    $elToScroll.scrollTop(scrollTop);
                    callBack();
                }
            }
        });
        /**
         * When the page is scrolled, set the current page to which ever page-wrap is within the threshold
         */
        $window.scroll(function () {
            if (!scroller.isScrolling) {
                var bottomOffset = $document.height() - ($window.scrollTop() + $window.height()), $page;
                if (bottomOffset < settings.bottomOffset) {
                    $page = $(".page-wrap").last();
                } else {
                    $page = $(".page-wrap").filter(function () {
                        var docViewTop = $window.scrollTop(), elemTop = $(this).offset().top,
                                offsetDiff = elemTop - docViewTop;
                        return (offsetDiff >= settings.currentPageOffset[0] && offsetDiff <= settings.currentPageOffset[1]);
                    });
                }
                $page.setAsCurrentPage();
            }
        });
    });
})(jQuery);
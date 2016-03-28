<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AllInOneHelper
 *
 * @author corey
 */
class AllInOneHelper
{

    public static function shouldProcess(\SS_HTTPRequest $request, $httpStatus)
    {
        $action    = $request->param('Action');
        $isEditing = false;
        if (class_exists("FrontendEditing")) {
            $isEditing = Cookie::get('editmode') === 'true';
        }
        // Do not process as an all in one page if
        return
                // The request is from a bot
                !self::isRequsetBot($request) &&
                // There is an error on the page
                $httpStatus === 200 &&
                // Front end editing is on
                !$isEditing &&
                // The page is being loading by the CMS preview
                $request->getVar("stage") != "Stage" &&
                // An action other than index is being called
                (is_null($action) || $action == "Index");
    }

    public static function excludedPages()
    {
        return SiteConfig::current_site_config()->AllInOneExludedPages();
    }

    public static function excludedPageIds()
    {
        $excludedIds = array();
        foreach (self::excludedPages() as $ExcludedPage) {
            $excludedIds[] = $ExcludedPage->ID;
        }
        return $excludedIds;
    }

    public static function isPageIdExluded($PageId)
    {
        return in_array($PageId, self::excludedPageIds());
    }

    /**
     * Determins if the given request is from a bot
     *
     * Google ranks sites with the same content on different URLs lower.
     * This makes the site deliver single pages to bots
     *
     * @link http://www.beautifulcoding.com/snippets/178/a-simple-php-bot-checker-are-you-human/
     * @return boolean
     */
    public static function isRequsetBot(\SS_HTTPRequest $request)
    {
        $bots   = Config::inst()->get('AllInOnePage', 'Bots');
        $result = $request->getVar("mockBot") == "true";
        if (!$result) {
            foreach ($bots as $spider) {
                //If the spider text is found in the current user agent, then return true
                if (stripos($request->getHeader("User-Agent"), $spider) !== false) {
                    $result = true;
                }
            }
        }
//        echo '<pre class="debug"> "$result"' . PHP_EOL . print_r($result ? "yes" : "no", true) . PHP_EOL . '</pre>';
        return $result || $request->getVar("mockBot") == "true";
    }
}

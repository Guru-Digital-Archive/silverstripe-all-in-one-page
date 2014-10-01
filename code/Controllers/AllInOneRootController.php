<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AllInOneController
 *
 * @author corey
 */
class AllInOneRootController extends RootURLController {

    public function handleRequest(SS_HTTPRequest $request, DataModel $model = null) {
        $action = $request->param('Action');
        $res    = parent::handleRequest($request, $model);
        if (!$action && AllInOneHelper::shouldProcess($request, $res->getStatusCode())) {
            $request->setUrl(self::get_homepage_link() . '/');
            $request->match('$URLSegment//$Action', true);

            $tmpContoller = Injector::inst()->create("AllInOneModelAsController");
            if ($this->session) {
                $tmpContoller->setSession($this->session);
            }
            $res = $tmpContoller->handleRequest($request, $model);
        }
        return $res;
    }

}

<?php

class AllInOneModelAsController extends ModelAsController {

    public function handleRequest(SS_HTTPRequest $request, DataModel $model) {
        $action = $request->param('Action');
        $result = parent::handleRequest($request, $model);
        if (!$action && AllInOneHelper::shouldProcess($request, $result->getStatusCode())) {
            $realController = $this->getNestedController();
            $parentId       = intval($realController->ParentID);
            $currentPageId  = intval($realController->ID);
            if ($parentId === 0 && !AllInOneHelper::isPageIdExluded($currentPageId)) {

                $jsMin = (Director::isDev()) ? "" : ".min";
                Requirements::javascript(THIRDPARTY_DIR . '/jquery/jquery' . $jsMin . '.js');
                Requirements::javascript(THIRDPARTY_DIR . '/jquery-ui/jquery-ui' . $jsMin . '.js');
                Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
                Requirements::javascript('silverstripe-all-in-one-page/javascript/dist/AllInOnePage' . $jsMin . '.js');

                $tmpContoller = Injector::inst()->create("AllInOnePage_Controller", $realController->data());
                if ($this->session) {
                    $tmpContoller->setSession($this->session);
                }
                $result = $tmpContoller->handleRequest($this->request, $model);
            }
        }
        return $result;
    }

}

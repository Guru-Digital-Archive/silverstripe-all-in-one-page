<?php

class AllInOnePage_Controller extends Page_Controller
{

    public function GetRootPages()
    {
        $controllers = new ArrayList();
        $pageModels  = Page::get()->filter(array(
            "ParentId" => 0,
            "ID:not"   => AllInOneHelper::excludedPageIds()
        ));
        foreach ($pageModels as $model) {
            $controllers->push(ModelAsController::controller_for($model));
        }

        return $controllers;
    }
}

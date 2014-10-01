<?php

class AllInOnePageExtension extends DataExtension {

    /**
     * Returns the Layout template based on the current ClassName
     * @return {mixed} template to be rendered
     * */
    public function GetLayoutTemplate() {
        $res = "";
        try {
            if (class_exists($this->owner->ClassName)) {
                $controller = ModelAsController::controller_for($this->owner);
                $controller->setSession(Controller::curr()->getSession());
                $controller->init();
                $viewer    = $controller->getViewer("index");
                $templates = $viewer->templates();
                if (isset($templates["Layout"])) {
                    $layoutViewer = Injector::inst()->create("SSViewer", $templates["Layout"]);
                    $layoutViewer->setPartialCacheStore($viewer->getPartialCacheStore());
                    $viewer       = $layoutViewer;
                }
                $res = $viewer->process($controller);
            }
        }
        catch (Exception $exc) {
//            echo $exc->getTraceAsString();
        }


        return $res;
    }

}

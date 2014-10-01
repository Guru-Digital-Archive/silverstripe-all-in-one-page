<?php

/**
 * Adds new global settings.
 */
class AllInOnePageSiteConfig extends DataExtension {

    private static $DEFAULT_EXCLUDE_CALSSES = array('ErrorPage', 'AllInOnePage');
    private static $many_many               = array(
        'AllInOneExludedPages' => 'SiteTree'
    );

    function updateCMSFields(FieldList $fields) {
        $this->SetDefaultExlcuded();
        $ExludedPagesField = new TreeMultiselectField("AllInOneExludedPages", "Exluded Pages", "SiteTree");
        $ExludedPagesField->setDescription("Add any pages here you want to exclude from the allinone page view");
        $fields->addFieldToTab('Root.AllInOne', $ExludedPagesField);
        return $fields;
    }

    public function SetDefaultExlcuded() {
        foreach (SiteTree::get()->filter(array('ClassName' => self::$DEFAULT_EXCLUDE_CALSSES, "ID:not" => AllInOneHelper::excludedPageIds())) as $ExcludedPage) {
            $this->owner->AllInOneExludedPages()->Add($ExcludedPage);
        }
    }

}

<div class="all-in-one-contatiner">
    <% loop $RootPages %>
    <section title="$Title.XML" class="page-wrap page-$ID $ClassName $URLSegment.XML <%if $LinkingMode == "current"%>$LinkingMode active<%end_if%>" id="$URLSegment.XML" data-page-id="$ID" data-page-url="$Link" data-page-title="$Title.XML">
             <article>
            $LayoutTemplate
        </article>
    </section>
    <% end_loop %>
</div>
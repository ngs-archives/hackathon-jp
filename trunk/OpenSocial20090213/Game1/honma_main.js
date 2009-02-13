gadgets.util.registerOnLoadHandler(
    function () {
        $('#social-top').show();
        var req = opensocial.newDataRequest();
        req.add(
            req.newFetchPersonRequest(
                "VIEWER", socialquest.parsonSearchParams
            ), "viewer"
        );
        req.send(socialquest.recievedViewerData);
        hensei();
    }
);

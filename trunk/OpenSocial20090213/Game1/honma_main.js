gadgets.util.registerOnLoadHandler(
    function () {
        var req = opensocial.newDataRequest();
        req.add(
            req.newFetchPersonRequest(
                "VIEWER", socialquest.parsonSearchParams
            ), "viewer"
        );
        req.send(socialquest.recievedViewerData);
    }
);

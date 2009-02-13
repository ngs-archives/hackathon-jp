bookRingr.Book = function(title, imgUrl, asin) {
    this.asin   = asin;
    this.title  = title;
    this.imgUrl = imgUrl;
    this.status = 1; // ほしい!がデフォルトで。
}
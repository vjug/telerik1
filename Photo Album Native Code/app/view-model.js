var observable = require("data/observable");
var imageSourceModule = require("image-source");
var fileSystemModule = require("file-system");
var observableArrayModule = require("data/observable-array");
var enums = require("ui/enums");
var cameraModule = require("camera");
var Everlive = require('./everlive.all.min');

var localImagesArray = new observableArrayModule.ObservableArray();
var directory = "/res/";
var everlive = new Everlive("gx2C8oMJnoUUWZwR");
var backendArray = new observableArrayModule.ObservableArray();
var photoAlbumModel = new observable.Observable();

function imageFromSource(imageName) {
    return imageSourceModule.fromFile(fileSystemModule.path.join(__dirname, directory + imageName));
};
var item1 = {    itemImage: imageFromSource("01.jpg")};
var item2 = {    itemImage: imageFromSource("02.jpg")};
var item3 = {    itemImage: imageFromSource("03.jpg")};
var item4 = {    itemImage: imageFromSource("04.jpg")};
var item5 = {    itemImage: imageFromSource("05.jpg")};
var item6 = {    itemImage: imageFromSource("06.jpg")};

localImagesArray.push([item1]); //, item2, item3, item4, item5, item6

var item7 = {    itemImage: imageFromSource("07.jpg")};
var item8 = {    itemImage: imageFromSource("08.jpg")};

photoAlbumModel.set("message", "Add new photos");

/* Object.defineProperty(photoAlbumModel, "photoItems", {
    get: function () {
        return localImagesArray;
    },
    enumerable: true,
    configurable: true
}) */

			/* everlive.Files.get()
            .then(function (data) {
                alert(data.result.length) // RETURNS 69 RECORDS
            },
            function (error) {
                alert(JSON.stringify(error));
            }); */



Object.defineProperty(photoAlbumModel, "photoItems", {
    get: function () {
        everlive.Files.get()
            .then(function (data) {
                data.result.forEach(function (fileMetadata) {
                    alert(data.result.length);
                    imageSourceModule.fromUrl(fileMetadata.Uri).then(function (result) {
                        var item = {
                            itemImage: result
                        };
                        backendArray.push(item);
                    });
                });
            },
            function (error) {});

        return backendArray;
    },
    enumerable: true,
    configurable: true
});


photoAlbumModel.tapAction = function () {

    //localImagesArray.push(item7);
    //localImagesArray.push(item8);

    //photoAlbumModel.set("message", "Images added. Total images: " + localImagesArray.length);
        
    /* cameraModule.takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true
    }).then(function (picture) {
        var item = {
            itemImage: picture
        };
        localImagesArray.push(item);
    }); */
    
    cameraModule.takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true
    }).then(function (picture) {
        var item = {
            itemImage: picture
        };
        backendArray.push(item);

        var file = {
            "Filename": Math.random().toString(36).substring(2, 15) + ".jpg",
            "ContentType": "image/jpeg",
            "base64": picture.toBase64String(enums.ImageFormat.jpeg, 100)
        };

        everlive.Files.create(file,
            function (data) {},
            function (error) {});
    });

};


exports.photoAlbumModel = photoAlbumModel;
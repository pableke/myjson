
const fs = require("fs"); //file system
const Collections = require("./collections");

const dirname = "./dbs/";
const DBS = {}; //container

function fnError(err) {
    console.log("\n--------------------", "MyJson", "--------------------");
    console.log("> " + (new Date()));
    console.log("--------------------", "Error", "--------------------");
    //err.message = "Error " + err.errno + ": " + err.sqlMessage;
    console.log(err);
    return err;
}
function fnAdd(name) {
    DBS[name] = new Collections(dirname + name);
    return DBS[name];
}
function fnOpen(name) {
    return new Promise(function(resolve, reject) {
        if (DBS[name])
            return resolve(DBS[name]);

        //create the directory container
        fs.mkdir(dirname + name, 0777, function(err) {
            return (err && (err.code != "EEXIST")) ? reject(fnError(err)) : resolve(fnAdd(name));
        });
    });
}
function fnClose(name) {
    DBS[name].drop();
    delete DBS[name];
}

exports.get = fnOpen;
exports.create = fnOpen;
exports.drop = function(name) {
    DBS[name] && fnClose(name);
    return Promise.resolve(DBS);
}

exports.open = function() {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, (err, files) => {
            if (err)
                return reject(fnError(err));
            files.forEach(fnAdd);
            return resolve(DBS);
        })
    });
}
exports.close = function() {
    Object.keys(fnClose);
    return Promise.resolve(DBS);
}

//create the directory container
fs.mkdir(dirname, 0777, err => {
    if (err && (err.code != "EEXIST"))
        return fnError(err);
});

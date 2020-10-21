
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

exports.create = function(name) {
    return new Promise(function(resolve, reject) {
        if (DBS[name])
            return resolve(DBS[name]);

        //create the directory container
        fs.mkdir(dirname + name, 0777, err => {
            if (err && (err.code != "EEXIST"))
                return reject(fnError(err));
            DBS[name] = new Collections(dirname + name);
            return resolve(DBS[name]);
        });
    });
}
exports.drop = function(name) {
    DBS[name] && DBS[name].drop();
    delete DBS[name];
    return Promise.resolve(DBS);
}
exports.get = function(name) {
    return Promise.resolve(DBS[name]);
}

//create the directory container
fs.mkdir(dirname, 0777, err => {
    if (err && (err.code != "EEXIST"))
        return fnError(err);
});

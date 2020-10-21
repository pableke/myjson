
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
        if (name) {
            DBS[name] = new Collections(dirname + name);
            return resolve(DBS);
        }

        //create the directory container
        fs.mkdir(dirname + name, 0777, err => {
            if (err && (err.code != "EEXIST"))
                return reject(fnError(err));
        });
        //load all databases from directories
        fs.readdir(dirname, (err, files) => {
            if (err)
                return reject(fnError(err));
            files.forEach(file => {
                DBS[file] = new Collections(dirname + file);
            });
            resolve(DBS);
        });
    });
}
exports.drop = function(name) {
    DBS[name] && DBS[name].drop();
    delete DBS[name];
    return Promise.resolve(DBS);
}
exports.get = function(name) {
    DBS[name] = DBS[name] || new Collections(dirname + name);
    return Promise.resolve(DBS[name]);
}

//create the directory container
fs.mkdir(dirname, 0777, err => {
    if (err && (err.code != "EEXIST"))
        return reject(fnError(err));
});

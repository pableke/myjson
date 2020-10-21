
const fs = require("fs"); //file system
const Collection = require("./collection");

module.exports = function(pathname) {
    const self = this; //self instance
    const db = {}; //container

    function fnError(err) {
        console.log("\n--------------------", "Collections", "--------------------");
        console.log("> " + (new Date()));
        console.log("--------------------", pathname, "--------------------");
        //err.message = "Error " + err.errno + ": " + err.sqlMessage;
        console.log(err);
        return err;
    }
    function addTable(name, table) { db[name] = table; return table.load(); }
    function setTable(name) { return addTable(name, new Collection(pathname + "/" + name)); }

    this.create = function(name) {
        db[name] && db[name].drop();
        return setTable(name);
    }
    this.drop = function() {
        return new Promise(function(resolve, reject) {
            Object.values(db).forEach(table => table.drop());
            fs.rmdir(pathname, { recursive: true }, err => {
                err ? reject(fnError(err)) : resolve(self);
            });
        });
    }

    this.get = function(name) {
        return new Promise(function(resolve) {
            db[name] ? resolve(db[name]) : setTable(name).then(resolve);
        });
    }
    this.load = function(tables) {
        return tables.map(table => self.get(table)).pop();
    }
    this.join = function(cb, tables) {
        return tables.shift().join(cb, tables);
    }

    //create the directory container
    fs.mkdir(pathname, 0777, err => {
        if (err && (err.code != "EEXIST"))
            fnError(err);
    });
}

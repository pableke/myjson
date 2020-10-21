
const fs = require("fs"); //file system

module.exports = function(pathname) {
    const self = this; //self instance
    let table = { seq: 1, data: [] };

    function fnError(err) {
        console.log("\n--------------------", "Table", "--------------------");
        console.log("> " + (new Date()));
        console.log("--------------------", pathname, "--------------------");
        //err.message = "Error " + err.errno + ": " + err.sqlMessage;
        console.log(err);
        return err;
    }

    this.load = function() {
        return new Promise(function(resolve, reject) {
            fs.readFile(pathname + ".json", "utf-8", (err, data) => {
                if (err && err.code == "ENOENT")
                    return resolve(self);
                if (err)
                    return reject(fnError(err));
                table = JSON.parse(data);
                resolve(self);
            });
        });
    }
    this.commit = function() {
        return new Promise(function(resolve, reject) {
            fs.writeFile(pathname + ".json", JSON.stringify(table), err => {
                err ? reject(fnError(err)) : resolve(self);
            });
        });
    }
    this.drop = function() {
        return new Promise((resolve, reject) => {
            table.data.splice(0);
            delete table.seq; delete table.data;
            fs.unlink(pathname + ".json", err => {
                err ? reject(fnError(err)) : resolve(self);
            });
        });
    }

    this.findAll = function() { return table.data; }
    this.find = function(cb) { return table.data.find(cb); }
    this.findById = function(id) { return this.find(row => (row._id == id)); }
    this.filter = function(cb) { return table.data.filter(cb); }
    this.each = function(cb) { table.data.forEach(cb); return this; }
    this.join = function(cb, tables) { return table.data.filter((row, i) => cb(row, i, tables)); }

    this.insert = function(data) {
        data._id = table.seq++;
        table.data.push(data);
        return this.commit();
    }
    this.update = function(cb, data) {
        table.data.forEach((row, i) => { cb(row, i) && Object.assign(row, data); });
        return this.commit();
    }
    this.updateById = function(data) {
        let row = this.find(row => (row._id == data._id));
        if (row) {
            Object.assign(row, data);
            return this.commit();
        }
        return Promise.resolve(self);
    }
    this.save = function(data) {
        return data._id ? this.updateById(data) : this.insert(data);
    }
    this.delete = function(cb) {
        table.data.forEach((row, i) => { cb(row, i) && table.data.splice(i, 1); });
        return this.commit();
    }
    this.deleteById = function(id) {
        let i = table.data.findIndex(row => (row._id == id));
        if (i < 0) //is table modified?
            return Promise.resolve(self);
        table.data.splice(i, 1);
        return this.commit();
    }
}

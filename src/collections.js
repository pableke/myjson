
const fs = require("fs"); //file system
const Collection = require("./collection");

module.exports = function(dbs, pathname) {
	const self = this; //self instance
	const db = {}; //container

	function fnError(err) {
		console.log("\n--------------------", "Collections", "--------------------");
		console.log("> " + (new Date()));
		console.log("--------------------", pathname, "--------------------");
		//err.message = "Error " + err.errno + ": " + err.sqlMessage;
		console.log(err);
		console.log("--------------------", "Collections", "--------------------\n");
		return err;
	}
	function addTable(name, table) { db[name] = table; return table.load(); }
	function setTable(name) { return addTable(name, new Collection(self, pathname + "/" + name)); }

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

	this.dbs = function() { return dbs; }
	this.get = function(name) {
		return new Promise(function(resolve) { //get table or preloaded
			db[name] ? resolve(db[name]) : setTable(name).then(resolve);
		});
	}
	this.load = function(tables) { //table names
		return new Promise(function(resolve) {
			let tablesLoaded = []; //tables container
			let last = tables.pop(); //extract last table name
			let addTable = table => { tablesLoaded.push(table); };

			tables.forEach(table => self.get(table).then(addTable));
			self.get(last).then(table => { addTable(table); resolve(tablesLoaded); });
		});
	}
	this.format = JSON.format;
	this.join = function(cb, tables) {
		return this.load(tables).then(tables => tables.shift().join(cb, tables));
	}
}

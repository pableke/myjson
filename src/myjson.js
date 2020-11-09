
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
	console.log("--------------------", "MyJson", "--------------------\n");
	return err;
}
function fnAdd(name) {
	DBS[name] = new Collections(DBS, dirname + name);
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

exports.db = function(name) {
	return DBS[name];
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

//extends JSOn functionality
JSON.format = function(str, data, opts) {
	opts = opts || {}; //default settings
	opts.separator = opts.separator || "";
	opts.empty = opts.empty || "";

	function fnFormat(obj, i) {
		obj.index = i;
		obj.count = i + 1;
		return str.replace(/@(\w+);/g, function(m, k) {
			let fn = opts[k]; //field format function
			let value = fn ? fn(obj[k]) : obj[k]; //value = string
			return value || opts.empty;
		});
	}

	if (!data)
		return str; //no format data to apply on string
	return Array.isArray(data) ? data.map(fnFormat).join(opts.separator) : fnFormat(data, 0);
}
exports.format = JSON.format;

//create the directory container
fs.mkdir(dirname, 0777, err => {
	if (err && (err.code != "EEXIST"))
		return fnError(err);
});


const myjson = require("./myjson")

myjson.create().then(dbs => {
    //console.log(dbs);
    return dbs.company.create("menus");
}).then(menus => {
    menus.insert({href: "#", text: "anchor"});
    return myjson.get("company");
}).then(company => {
    return company.get("users");
}).then(users => {
    return users.deleteById(5);
}).then(users => {
    console.log(users.findById(2));
    myjson.create("test").then(dbs => myjson.drop("test"));
});

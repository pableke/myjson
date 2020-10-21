
const myjson = require("./myjson")

myjson.create("company").then(company => {
    return company.create("menus");
}).then(menus => {
    menus.save({_id:2, href: "#top", text: "anchor"});
    return myjson.get("company");
}).then(company => {
    return company.get("users");
}).then(users => {
    return users.deleteById(5);
}).then(users => {
    console.log(users.findById(2));
    myjson.create("test").then(dbs => myjson.drop("test"));
});


const myjson = require("./myjson")

myjson.open().then(dbs => {
    console.log("-------", "DataBases", "-------");
    console.log(dbs);
    return dbs.company.create("menus");
}).then(menus => {
    console.log("-------", "MENUS", "-------");
    console.log(menus);
    menus.save({_id:2, href: "#top", text: "anchor"});
    return menus.get("users");
}).then(users => {
    console.log("-------", "USERS", "-------");
    console.log(users);
    console.log("-------", "USER (5)", "-------");
    return users.deleteById(5);
}).then(users => {
    console.log(users.findById(2));
});

myjson.create("test").then(test => {
    return test.create("products");
}).then(products => {
    products.save({_id:1,name:"laptop", price:99.32});
});

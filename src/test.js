
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
    return users.findById(2);
}).then(user => {
    console.log(user);
});

myjson.create("test").then(test => {
    return test.create("products");
}).then(products => {
    products.save({name:"laptop", price:99.32});
});

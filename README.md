# MyJSON
Standalone and simple persistence for JSON data, as a database NO SQL

## Usage

### JS Applications

Suitable for applications that have their own database control.

<details><summary><b>Show instructions</b></summary>

1. Install by npm:

    ```sh
    $ npm install mysql
    ```

## Config

MyJson auto read ./dbs/ directory to load/store databases

1. myjson.create():

   ```
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
   ```

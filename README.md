# MyJSON

Standalone and simple persistence for JSON data, as a database NO SQL

## How It Works

1. Build a tree directory structure as user definition.
2. Load / store data according previous structure.

## Usage

### JS Applications

Suitable for applications that have their own database control.

<details><summary><b>Show instructions</b></summary>

1. Install by npm:

    ```sh
    $ npm install myjson-box
    ```

</details>

## Config

MyJson auto read ./dbs/ directory to load/store databases

1. myjson.create():

   ```
    const myjson = require("myjson-box")

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
   ```

### test

```
npm test
```
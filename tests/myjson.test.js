
const myjson = require("../src/myjson")

describe("MyJson tests", () => {
	test("Open all databases", () => {
		myjson.open().then(dbs => {
			expect(dbs).toMatchObject({ company: {}, system: {}, test: {} });
		});
	});

	test("Get all company.users", () => {
		myjson.get("company").then(db => {
			db.get("users").then(users => {
				users.findAll().forEach(row => {
					expect(row).toMatchObject({
						_id: expect.any(Number),
						nif: expect.any(String),
						correo: expect.any(String)
					});
				});
			});
		});
	});

	test("Get all company.menus", () => {
		myjson.get("company").then(db => {
			db.get("menus").then(menus => {
				menus.findAll().forEach(row => {
					expect(row).toMatchObject({
						_id: expect.any(Number),
						accion: expect.any(String)
					});
				});
			});
		});
	});

	test("Update and find company.menus", () => {
		myjson.get("company").then(db => {
			db.get("menus").then(menus => {
				menus.save({_id: 2, accion: "#top", text: "anchor" });
				expect(menus.findById(2)).toMatchObject({ _id: 2 });
			});
		});
	});
});

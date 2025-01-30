import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client } from "../src/database";
import { drizzle } from "drizzle-orm/postgres-js";

const main = async () => {
	try {
		await migrate(drizzle(client), { migrationsFolder: "drizzle" });
		console.log("Migration completed");
	} catch (error) {
		console.error("Error during migration:", error);
		process.exit(1);
	}
};

void main();

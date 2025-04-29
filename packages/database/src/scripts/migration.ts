import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../database";

async function main() {
	console.log("running migrations...");
	try {
		await migrate(db, { migrationsFolder: "drizzle" });
		console.log("Migrations completed successfully");
	} catch (error) {
		console.error("migrations failed", error);
		process.exit(1);
	}
	process.exit(0);
}

main();

import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
const port = Number(process.env.PORT || 4000);
connectDatabase()
  .then(() => app.listen(port, () => console.info(`API listening on ${port}`)))
  .catch((error) => {
    console.error("Startup failed", error);
    process.exit(1);
  });

import App from "./src/app";
import validateEnv from "./src/utils/validateEnv";

validateEnv();

const app = new App();
app.listen();
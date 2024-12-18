import { app, port} from "./index.js";

const start = () => {
    app.listen(port, console.log(`App s listining on PORT: ${port}`));
}

start();
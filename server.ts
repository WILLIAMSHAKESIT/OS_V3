import { join, resolve } from "path";
import { promises as fs } from "fs";
import { createServer } from "http";

const STATIC_PATH = resolve("./build");
const PORT = 8080;

createServer(async (req, res) => {
    if(req.headers.host == "slotdemo.agaglobal.com"){
        const url = req.url === "/oceanstory" ? "/index.html" : req.url;
        const filePath = join(STATIC_PATH, `${url}`);
        try {
            const data = await fs.readFile(filePath);
            res.end(data);
        } catch (err) {
            res.statusCode = 404;
            res.end(`File "${url}" is not found`);
        }
    }
    else{
        res.writeHead(301, {
            Location: "https://www.google.com/"
          });
          res.end();
    }
}).listen(PORT, () => console.log(`Static on port ${PORT}`));

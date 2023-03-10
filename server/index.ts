import path from "path"
import express from "express"
import config from "./config"
import { serveStream } from "./serveAudio"
import { generateHtmlFromDir } from "./readLibDir"

const app = express()

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const web = path.resolve("..", "web")
console.log("libdir", config.libPath)

app.use('/static', express.static(web))

app.get("/file/*", (req, res) => {
    let filePath = req.path
    console.log("requested file path", filePath)
    filePath = filePath.replace("/file/", "")
    try {
        return serveStream(req, res, filePath)
    } catch (err) {
        console.error(err)
        return res.sendStatus(404)
    }
})

app.get('*', (req, res) => {
    let path = req.path
    console.log("path*", path)
    const html = generateHtmlFromDir(path)
    res.send(html)
})
if (!config.libPath)
    throw Error("missing libpath!!")

let port = config.port ? config.port : 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})


import toml from "toml"
import fs from "fs/promises"
import path from "path"
import process from "process"

const language = "python"

async function parse() {
  const content = await fs.readFile(path.resolve(`src/data/${language}.toml`), {
    encoding: "utf8",
  })
  const data = toml.parse(content)
  fs.writeFile(path.resolve(`src/data/${language}.json`), JSON.stringify(data))
}

parse()

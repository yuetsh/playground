import fs from "fs/promises"
import path from "path"
import toml from "toml"

const language = "python"

async function parse() {
  const content = await fs.readFile(
    path.resolve(`src/contents/${language}.toml`),
    {
      encoding: "utf8",
    },
  )
  const data = toml.parse(content)
  fs.writeFile(
    path.resolve(`src/contents/${language}.json`),
    JSON.stringify(data),
  )
}

parse()

import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";
import svgexport from "svgexport";
import tempy from "tempy";
import fs from "fs";

const server = fastify({ logger: true });

server.get("/*", (request, reply) => {
  if (request.params["*"] === "favicon.ico") return reply.send("");
  let path = request.params["*"];
  const type = path.includes(".svg") ? "svg" : "png";
  path = path.replace(".svg", "");
  if (type == "png") {
    const svg = drawCanvas(path, 'svg');
    const input = tempy.file({extension: 'svg'})
    const output = tempy.file({extension: 'png'})
    fs.writeFileSync(input, svg);
    svgexport.render({input: [input] , output: [[output, "100%", "1000:1000"]], cwd: process.cwd()}, (err) => {
      if (err) {
        console.log(err)
        return reply.code(500).send()
      } else {
        reply.type("image/png").send(fs.readFileSync(output));
      }
    });
  } else {
    const svg = drawCanvas(path, type);
    reply
      .header("Content-Disposition", "inline")
      .type("image/svg+xml ")
      .send(svg);
  }
});

server.listen(process.env.PORT || 3000, "0.0.0.0");

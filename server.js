import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";
import svg2img from 'node-svg2img';
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
    svg2img(svg, { width: 1000, height: 1000 }, function (err, data) {
      console.log(err)
      fs.writeFileSync('dest.png', data);
      reply.type("image/jpeg").send(data);
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

process.on('SIGTERM', async function onSigterm () {
  await svgexport.cleanup()
})

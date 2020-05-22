import fastify from "fastify";
import drawCanvas from "./draw-canvas.js";

const server = fastify({ logger: true });

server.get("/*", (request, reply) => {
  if (request.params["*"] === "favicon.ico") return reply.send("");
  let path = request.params["*"];
  const type = path.includes(".svg") ? "svg" : "png";
  path = path.replace(".svg", "");
  if (type == "png") {
    const canvas = drawCanvas(path, type);
    const data = canvas.toDataURL({ type: "image/png" });
    const stripped = data.replace(/^data:image\/\w+;base64,/, "");
    const buff = new Buffer(stripped, "base64");
    reply.type("image/png").send(buff);
  } else {
    const svg = drawCanvas(path, type);
    reply
      .header("Content-Disposition", "inline")
      .type("image/svg+xml ")
      .send(svg);
  }
});

server.listen(process.env.PORT || 3000, "0.0.0.0");

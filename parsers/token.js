import CoordParser from "./coord-parser.js";
import ColourParser from "./colour-parser.js";

const sizeLookups = new Map([
  ["T", "tiny"],
  ["S", "small"],
  ["M", "medium"],
  ["L", "large"],
  ["H", "huge"],
  ["G", "gargantuan"],
]);

export default class TokenParser {
  parse(str) {
    let trimmed = str.trim();
    if (trimmed[0] === "/") trimmed = trimmed.substr(1);
    if (trimmed[trimmed.length - 1] === "/")
      trimmed = trimmed.substr(0, length - 1);
    if (str.length < 2) return false;

    // a string matching a token definition eg. d3rp-wizard
    const reg = /^([a-zA-Z]{1,2}[0-9]{1,2})([tsmlhgTSMLHG]?)([a-zA-Z]{1,2})?(-([\w-\s]*))?$/;
    if (reg.test(trimmed)) {
      const matches = trimmed.match(reg);

      let coords = CoordParser.parse(matches[1]);
      let size = matches[2] ? sizeLookups.get(matches[2][0].toUpperCase()) : 'medium';
      let color = ColourParser.parse(matches[3])

      return {
        x: coords.x,
        y: coords.y,
        color,
        size,
        name: matches[5] || "",
      };
    }

    return false;
  }
}

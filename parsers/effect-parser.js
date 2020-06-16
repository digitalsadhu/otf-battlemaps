import CoordParser from "./coord-parser.js";
import TriangleEffect from "../effects/triangle-effect.js";
import CircleEffect from "../effects/circle-effect.js";
import SquareEffect from "../effects/square-effect.js";
import ColourParser from "./colour-parser.js";

const effectShapes = new Map([
  ['T', "triangle"], // aka cone
  ['C', "circle"],
  ['L', "line"],
  ['S', "square"],
  ['R', "rectangle"]
]);

export default class EffectParser {
  parse(str) {
    let trimmed = str.trim().toUpperCase();
    if (trimmed.charAt(0) !== '*')
      return false;

    const reg = /\*([TLSRC])([0-9]*?)(\,[0-9]*?)?([a-zA-Z]{1,2})?(([A-Z]{1,2}[0-9]{1,2})+)/;
    if (!reg.test(trimmed)) 
      return false;

    const matches = trimmed.match(reg);
    let shape = effectShapes.get(matches[1]);
    let size = matches[2];
    let size2 = 0;
    let colour = ColourParser.parse(matches[4]);
    let coords = CoordParser.parseSet(matches[5]);
 
    switch (shape) {
      case "triangle":
        return new TriangleEffect({size, colour, startPt: coords[0], endPt: coords[1]});
      case "circle":
        let anchorAtCenter = matches[3] ? false : true;
        size2 = matches[3] ? matches[3].substr(1) : 0;
        return new CircleEffect({size, colour, anchorPt: coords[0], offset: size2, anchorAtCenter});
      case "square":
        if (coords.length == 1)
          return new SquareEffect({width: size, length:size, colour, startPt: coords[0], endPt: null, anchorTopLeft: true});
        return new SquareEffect({width: size, length:size, colour, startPt: coords[0], endPt: coords[1], anchorTopLeft: false});  
      case "rectangle":
        size2 = matches[3] ? matches[3].substr(1) : 5;
        return new SquareEffect({width: size2, length:size, colour, startPt: coords[0], endPt: coords[1], anchorTopLeft: false}); 
    }
    return false;
  }
}

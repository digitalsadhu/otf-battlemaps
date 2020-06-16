const singleColours = new Map([
  ["W", "white"],
  ["K", "black"],
  ["E", "grey"],
  ["R", "firebrick"],
  ["G", "forestgreen"],
  ["B", "cornflowerblue"],
  ["Y", "gold"],
  ["P", "darkviolet"],
  ["C", "deepskyblue"],
  ["N", "darkgoldenrod"],
  ["O", "orange"]
]);

const doubleColours = new Map([
  ["WH", "white"],
  ["KB", "black"],
  ["GY", "grey"],
  ["RE", "firebrick"],
  ["GN", "forestgreen"],
  ["BL", "cornflowerblue"],
  ["YE", "gold"],
  ["PU", "darkviolet"],
  ["CY", "deepskyblue"],
  ["BN", "darkgoldenrod"],
  ["OR", "orange"]
]);

export default class ColourParser {
  /**
   * parse a colour
   * @param {string} str colour code 
   */
  static parse(str) {
    if (str) {
      var upper = str.toUpperCase();
      switch (upper.length) {
        case 1:
          return singleColours.get(upper) || "black";     
        case 2:
          return doubleColours.get(upper) || "black";
      }
    }
    return "black";
  }
}

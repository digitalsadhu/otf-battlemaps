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

export default class ColourParser {
  /**
   * parse a colour
   * @param {string} str colour code 
   */
  static parse(str) {
    if (str) {
      var upper = str.toUpperCase();
      return singleColours.get(upper) || "black";  
    }
    return "black";
  }
}

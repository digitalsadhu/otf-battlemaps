import canvas from "canvas";
const { Image } = canvas;

const PADDING = 15;

export default class Board {
  constructor({
    width,
    height,
    gridsize,
    padding,
    ctx,
    strokeStyle = "#CCCCCC",
  }) {
    this.width = width;
    this.height = height;
    this.gridsize = gridsize;
    this.ctx = ctx;
    this.padding = padding;
    this.strokeStyle = strokeStyle;
    this.state = [];
    this.background = null;

    for (let x = 0; x < width; x++) {
      let arr = [];
      for (let y = 0; y < height; y++) {
        arr[y] = null;
      }
      this.state[x] = arr;
    }
  }

  placeItem(x, y, item) {
    this.state[x][y] = item;
  }

  addBackground(background) {
    this.background = background;
  }

  get(x, y) {
    return this.state[x][y] || null;
  }

  [Symbol.iterator]() {
    let x = 0;
    let y = 0;
    return {
      next: () => {
        if (x < this.state.length || (y && y < this.state[x].length)) {
          const value = { value: { x, y, item: this.get(x, y) }, done: false };
          if (y < this.state[x].length - 1) y++;
          else {
            x++;
            y = 0;
          }
          return value;
        } else {
          return { done: true };
        }
      },
    };
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(
      0,
      0,
      this.width * this.gridsize,
      this.height * this.gridsize
    );

    if (this.background) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, 2550, 3300);
      };
      img.onerror = (err) => {
        throw err;
      };
      img.src = this.background;
    }

    for (let i = 0; i <= this.width; i += this.gridsize) {
      // this.ctx.beginPath();
      this.ctx.moveTo(0.5 + i + this.padding, this.padding);
      this.ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.stroke();

      const num = i / this.gridsize;
      if (num < 1) continue;
      this.ctx.beginPath();
      this.ctx.fillStyle = "slategray";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      const character =
        num > 26
          ? String.fromCharCode(num + 70)
          : String.fromCharCode(num + 64);
      this.ctx.fillText(
        character,
        this.padding + i - this.gridsize / 2,
        this.padding - 5
      );
    }

    for (let i = 0; i <= this.height; i += this.gridsize) {
      this.ctx.moveTo(this.padding, 0.5 + i + this.padding);
      this.ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.fillStyle = "slategray";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      const num = i / this.gridsize;
      if (num < 1) continue;
      this.ctx.fillText(
        String(num),
        this.padding - 7,
        this.padding + i - this.gridsize / 2
      );
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = "slategray";
    this.ctx.fillText(
      "1 square = 5ft",
      this.width - this.padding - 10,
      this.height + this.padding + 7
    );

    for (const { x, y, item } of this) {
      if (item) {
        item.draw(this.ctx, x, y, this.gridsize, this.padding);
      }
    }
  }

  drawSvg() {
    const columns = this.width / this.gridsize;
    const rows = this.height / this.gridsize;
    const canvasWidth = this.width + 2 * PADDING;
    const canvasHeight = this.height + 2 * PADDING;
    let rowData = [];
    for (let i = 0; i < rows; i++) {
      rowData.push(
        `<path d="M 0 ${i * this.gridsize} h${
          this.width
        }" stroke="black" stroke-width="0.2"/>`
      );

      const character =
        i > 26 ? String.fromCharCode(i + 71) : String.fromCharCode(i + 65);
      rowData.push(
        `<text fill="slategray" x="-10" y="${
          i * this.gridsize + this.gridsize / 2
        }" font-size="10">${character}</text>`
      );
    }
    rowData.push(
      `<path d="M 0 ${rows * this.gridsize} h${
        this.width
      }" stroke="slategray" stroke-width="0.2"/>`
    );
    let columnData = [];
    for (let i = 0; i < columns; i++) {
      columnData.push(
        `<path d="M ${i * this.gridsize} 0 v${
          this.height
        }" stroke="slategray" stroke-width="0.2"/>`
      );
      columnData.push(
        `<text fill="slategray" x="${
          i * this.gridsize + this.gridsize / 2
        }" y="-4" font-size="10">${i + 1}</text>`
      );
    }
    columnData.push(
      `<path d="M ${columns * this.gridsize} 0 v${
        this.height
      }" stroke="slategray" stroke-width="0.2"/>`
    );

    const itemData = [];
    for (const { x, y, item } of this) {
      if (item) {
        itemData.push(item.drawSvg(x, y, this.gridsize, this.padding));
      }
    }

    return `<svg viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <g id="grid">
      ${rowData.join("\n")}
      ${columnData.join("\n")}
    </g>
  </defs>

  <use  href="#grid" x="${PADDING}" y="${PADDING}" />
  ${itemData.join("\n")}
</svg>`;
  }
}

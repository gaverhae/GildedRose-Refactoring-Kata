class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const genericItem = (name, sellIn, quality) => {
  return new Item(name, sellIn, quality);
};

const capQuality = (f) => () => {
  const item = f();
  return {...item, quality: Math.min(50, item.quality)};
};

const AgedBrie = (sellIn, quality) => {
  const tick = () => AgedBrie(sellIn - 1, sellIn > 0 ? quality + 1 : quality + 2);
  return {name: "Aged Brie",
          tick: capQuality(tick),
          sellIn, quality};
};

const Sulfuras = (sellIn) => {
  const tick = () => Sulfuras(sellIn);
  return {name: "Sulfuras, Hand of Ragnaros",
          quality: 80,
          sellIn, tick};
};

const BackstagePasses = (bandName, sellIn, quality) => {
  const tick = () =>
    BackstagePasses(
      bandName,
      sellIn - 1,
      sellIn > 10 ? quality + 1
      : sellIn > 5 ? quality + 2
      : sellIn > 0 ? quality + 3
      : 0);
  return {sellIn, quality,
          tick: capQuality(tick),
          name: "Backstage passes to a " + bandName + " concert"};
};

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].name === "Sulfuras, Hand of Ragnaros"
         || this.items[i].name === "Aged Brie"
         || this.items[i].name === 'Backstage passes to a TAFKAL80ETC concert') {
        this.items[i] = this.items[i].tick();
        continue;
      };
      if (this.items[i].quality > 0) {
        this.items[i].quality = this.items[i].quality - 1;
      }
      this.items[i].sellIn = this.items[i].sellIn - 1;
      if (this.items[i].sellIn < 0) {
        if (this.items[i].quality > 0) {
          this.items[i].quality = this.items[i].quality - 1;
        }
      }
    }

    return this.items;
  }
}

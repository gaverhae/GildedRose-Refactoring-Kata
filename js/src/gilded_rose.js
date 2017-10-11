class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const tick = (item) => ({...item,
                         quality: item.nextQuality(item),
                         sellIn: item.nextSellIn(item)});

const cap = (q) => Math.max(0, Math.min(50, q));

const genericItem = (name, sellIn, quality) => {
  const nextQuality = (i) => cap(i.sellIn > 0 ? i.quality - 1 : i.quality - 2);
  const nextSellIn = (i) => i.sellIn - 1;
  return {name, sellIn, quality, nextSellIn, nextQuality};
};

const AgedBrie = (sellIn, quality) => {
  const item = genericItem("Aged Brie", sellIn, quality);
  return {...item,
          nextQuality: (i) => cap(i.sellIn > 0 ? i.quality + 1 : i.quality + 2)};
};

const Sulfuras = (sellIn) => {
  const item = genericItem("Sulfuras, Hand of Ragnaros", sellIn, 80);
  return {...item,
          nextSellIn: (i) => i.sellIn,
          nextQuality: (_) => 80};
};

const BackstagePasses = (bandName, sellIn, quality) => {
  const item = genericItem("Backstage passes to a " + bandName + " concert",
                           sellIn, quality);
  return {...item,
          nextQuality: (i) => cap(i.sellIn > 10 ? i.quality + 1
                                  : i.sellIn > 5 ? i.quality + 2
                                  : i.sellIn > 0 ? i.quality + 3
                                  : 0)};
};

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    this.items = this.items.map(item => item.tick());
    return this.items;
  }
}

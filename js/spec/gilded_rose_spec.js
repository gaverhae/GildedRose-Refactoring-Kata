describe("Gilded Rose", function() {
  describe("when time passes", function() {
    it("decreases sellIn by one", function() {
      const gildedRose = new Shop([ createItem("foo", 10, 0),
                                    createItem("bar", 0, 0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(9);
      expect(items[1].sellIn).toEqual(-1);
    });
  });
  describe("quality of normal items", function() {
    it("decreases by 1 before the due date", function() {
      const gildedRose = new Shop([ createItem("foo", 10, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(9);
    });
    it("decreases by 2 after the due date", function() {
      const gildedRose = new Shop([ createItem("foo", 0, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(8);
    });
    it("never has a negative quality", function() {
      const gildedRose = new Shop([ createItem("foo", 10, 0),
                                    createItem("bar", 0, 0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(0);
      expect(items[1].quality).toEqual(0);
    });
  });
  describe("quality of Sulfuras", function() {
    it("is always 80", function() {
      const gildedRose = new Shop([ createItem("Sulfuras, Hand of Ragnaros", 10, 80),
                                    createItem("Sulfuras, Hand of Ragnaros", 0, 80) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(80);
      expect(items[1].quality).toEqual(80);
    });
  });
  describe("quality of Aged Brie", function() {
    it("increases by 1 before due date, by 2 after", function() {
      const gildedRose = new Shop([ createItem("Aged Brie", 10, 0),
                                    createItem("Aged Brie", 0, 0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(1);
      expect(items[1].quality).toEqual(2);
    });
    it("never increases beyond 50", function() {
      const gildedRose = new Shop([ createItem("Aged Brie", 10, 50),
                                    createItem("Aged Brie", 0, 49) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(50);
    });
  });
  describe("quality of Backstage passes", function() {
    it("increases depending on due date", function() {
      const gildedRose = new Shop([ createItem("Backstage passes to a TAFKAL80ETC concert", 20, 50),
                                    createItem("Backstage passes to a TAFKAL80ETC concert", 20, 10),
                                    createItem("Backstage passes to a TAFKAL80ETC concert", 10, 10),
                                    createItem("Backstage passes to a TAFKAL80ETC concert", 5, 10),
                                    createItem("Backstage passes to a TAFKAL80ETC concert", 1, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(11);
      expect(items[2].quality).toEqual(12);
      expect(items[3].quality).toEqual(13);
      expect(items[4].quality).toEqual(13);
    });
    it("drops to 0 after the due date", function() {
      const gildedRose = new Shop([ createItem("Backstage passes to a TAFKAL80ETC concert", 1, 50),
                                    createItem("Backstage passes to a TAFKAL80ETC concert", 0, 50) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(0);
    });
  });
});

describe("Gilded Rose", function() {
  describe("when time passes", function() {
    it("decreases sellIn by one, except for Sulfuras", function() {
      const gildedRose = new Shop([ genericItem("foo", 10, 0),
                                    genericItem("bar", 0, 0),
                                    Sulfuras(10),
                                    AgedBrie(20, 10),
                                    BackstagePasses("TAFKAL80ETC", 30, 10),
                                    Conjured(genericItem("baz", 10, 0)) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toEqual(9);
      expect(items[1].sellIn).toEqual(-1);
      expect(items[2].sellIn).toEqual(10);
      expect(items[3].sellIn).toEqual(19);
      expect(items[4].sellIn).toEqual(29);
      expect(items[5].sellIn).toEqual(9);
    });
  });
  describe("quality of normal items", function() {
    it("decreases by 1 before the due date", function() {
      const gildedRose = new Shop([ genericItem("foo", 10, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(9);
    });
    it("decreases by 2 after the due date", function() {
      const gildedRose = new Shop([ genericItem("foo", 0, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(8);
    });
    it("never has a negative quality", function() {
      const gildedRose = new Shop([ genericItem("foo", 10, 0),
                                    genericItem("bar", 0, 0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(0);
      expect(items[1].quality).toEqual(0);
    });
  });
  describe("quality of Sulfuras", function() {
    it("is always 80", function() {
      const gildedRose = new Shop([ Sulfuras(10),
                                    Sulfuras(0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(80);
      expect(items[1].quality).toEqual(80);
    });
  });
  describe("quality of Aged Brie", function() {
    it("increases by 1 before due date, by 2 after", function() {
      const gildedRose = new Shop([ AgedBrie(10, 0),
                                    AgedBrie( 0, 0) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(1);
      expect(items[1].quality).toEqual(2);
    });
    it("never increases beyond 50", function() {
      const gildedRose = new Shop([ AgedBrie(10, 50),
                                    AgedBrie( 0, 49) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(50);
    });
  });
  describe("quality of Backstage passes", function() {
    it("increases depending on due date", function() {
      const gildedRose = new Shop([ BackstagePasses("TAFKAL80ETC", 20, 50),
                                    BackstagePasses("TAFKAL80ETC", 20, 10),
                                    BackstagePasses("TAFKAL80ETC", 10, 10),
                                    BackstagePasses("TAFKAL80ETC", 5, 10),
                                    BackstagePasses("some other band", 1, 10) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(11);
      expect(items[2].quality).toEqual(12);
      expect(items[3].quality).toEqual(13);
      expect(items[4].quality).toEqual(13);
    });
    it("drops to 0 after the due date", function() {
      const gildedRose = new Shop([ BackstagePasses("TAFKAL80ETC", 1, 50),
                                    BackstagePasses("TAFKAL80ETC", 0, 50) ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toEqual(50);
      expect(items[1].quality).toEqual(0);
    });
  });
  describe("quality of Conjured items", function() {
    it("evolves twice as fast", function() {
      const items = [ BackstagePasses("TAFKAL80ETC", 20, 50),
                      BackstagePasses("TAFKAL80ETC", 20, 10),
                      BackstagePasses("TAFKAL80ETC", 10, 10),
                      BackstagePasses("TAFKAL80ETC", 6, 10),
                      BackstagePasses("some other band", 1, 10),
                      AgedBrie(10, 0),
                      AgedBrie( 0, 0),
                      AgedBrie( 0, 49),
                      Sulfuras(0),
                      genericItem("foo", 10, 0),
                      genericItem("bar", 0, 0) ]
      const conj_shop = new Shop(items.map(item => Conjured(item)));
      const conj_items_1 = conj_shop.updateQuality().map(item => item.quality);
      const conj_items_2 = conj_shop.updateQuality().map(item => item.quality);
      expect(conj_items_1).toEqual(
        [50, 12, 14, 14, 16, 2, 4, 50, 80, 0, 0]);
      expect(conj_items_2).toEqual(
        [50, 14, 18, 20, 0, 4, 8, 50, 80, 0, 0]);
    });
  });
});

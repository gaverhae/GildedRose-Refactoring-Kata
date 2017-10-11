# Gilded Rose Kata

## Requirements

```
======================================
Gilded Rose Requirements Specification
======================================

Hi and welcome to team Gilded Rose. As you know, we are a small inn with a
prime location in a prominent city ran by a friendly innkeeper named Allison.
We also buy and sell only the finest goods.  Unfortunately, our goods are
constantly degrading in quality as they approach their sell by date. We have a
system in place that updates our inventory for us. It was developed by a
no-nonsense type named Leeroy, who has moved on to new adventures. Your task is
to add the new feature to our system so that we can begin selling a new
category of items. First an introduction to our system:

    - All items have a SellIn value which denotes the number of days we have to
      sell the item
	- All items have a Quality value which denotes how valuable the item is
	- At the end of each day our system lowers both values for every item

Pretty simple, right? Well this is where it gets interesting:

	- Once the sell by date has passed, Quality degrades twice as fast
	- The Quality of an item is never negative
	- "Aged Brie" actually increases in Quality the older it gets
	- The Quality of an item is never more than 50
    - "Sulfuras", being a legendary item, never has to be sold or decreases in
      Quality
    - "Backstage passes", like aged brie, increases in Quality as its SellIn
      value approaches;
      - Quality increases by 2 when there are 10 days or less and by 3 when
        there are 5 days or less but
	  - Quality drops to 0 after the concert

We have recently signed a supplier of conjured items. This requires an update
to our system:

	- "Conjured" items degrade in Quality twice as fast as normal items

Feel free to make any changes to the UpdateQuality method and add any new code
as long as everything still works correctly. However, do not alter the Item
class or Items property as those belong to the goblin in the corner who will
insta-rage and one-shot you as he doesn't believe in shared code ownership (you
can make the UpdateQuality method and Items property static if you like, we'll
cover for you).

Just for clarification, an item can never have its Quality increase above 50,
however "Sulfuras" is a legendary item and as such its Quality is 80 and it
never alters.
```

## Clarifications & assumptions

There are a number of unclear requirements in the above description. Here are
the ones I have identified and the assumptions I've made to clarify them:

* SellIn date is an integer that decreases by one per update, and keeps
  "growing" towards negative infinity.
* Sulfuras has a SellIn value, but contrary to all other types of items, its
  SellIn value does not change.
* The provided code deals with specific items, rather than specific types of
  items, based on their name. The most flagrant example of that is the
  "Backstage passes" type of item: while the requirements given seem to talk
  about any kind of backstage pass (i.e. a type of item), the provided code works
  by matching an exact string, which include the band's name. I have assumed this
  is not the desired behaviour and all backstage passes should behave the same,
  regardless of the band.
* I have decided that it is acceptable, in order to implement the previous
  point, to introduce a notion of type of object, possibly disconnected from
  its name. That is, with my changes it will be possible to create an item that
  has the name "Aged Brie", but does not behave like an "Aged Brie".
* Based on the wording for Aged Brie, and the fact that in the current code
  they improve twce as fast after their due date, I have decided to interpret
  the Conjured requirement as, essentially, update the quality twice as fast.
  This boils down to applying all of the relevant rules to update the quality of
  that item twice for each update to its SellIn value.

## Approach

The provided code, while it works, is very hard to follow because of the amount
of nested conditions. There is no apparent structure to them (i.e. one would
expect, at the very least, a top-level switch on type of item). Adding even
more conditionals to that mess would be very risky, so I've opted for a pretty
big refactoring of that code.

In order for the change to be a refactoring, though, it has to follow some
methodical process that ensures nothing gets broken. To achieve this, here are
the steps I've followed:

1. Add a generous amount of tests, based on the problem statement, and verify
   that they pass on the current code.
1. Get the Texttest process to run. I am not very familiar with the Python
   tooling, especially on a Mac (I tried installing Python through `brew` to
   get `pip`, then running `pip install texttest`, which seemed to work, but
   afterwards it looked like my Python installation had trouble finding its
   `site-package` folder, so at that point I gave up), so I've cobbled together a
   very quick solution to run the code and compare the outputs directly in a
   browser. This allowed me to develop with two auto-refreshing browser windows
   open, yielding very fast feedback.
1. For one type of item at a time, implement a separate function that updates
   that type of item, then short-circuit the main body of the loop if that item
   is matched. Check that all tests still pass.
1. Go through the code of the main body of the loop, and remove all
   conditionals on the type of object I have just implemented.
1. Repeat the above process until the body of the loop is empty.

Up to that point, the refactoring was more about making the problem statement
explicit in the code. The next steps are about actually adding the new feature.

1. Based on the new feature we want to add, refactor existing code to make it
   easier (but still don't add it).
1. Check that all tests still pass.
1. Add the new behaviour. At this point it can be added as a purely additive
   alternative to existing code, ensuring no existing functionality is broken
   (by this step).

This approach gives me a fairly high confidence that the new implementation is
correct. It's also much easier to work with, so bugs (if present and found)
should be much easier to fix than in the original provided code. This is also
true of changes in business requirements.

## Comments on solution

The end solution represents items as objects with two methods: one to compute
the next sellIn value, and one to compute the next quality value. They both
take the current object as an explicit parameter. The reason for this design,
as opposed to the obvious solution of representing each item type as a class
with mutative methods that would update them, is the desire to be able to
simulate both of them being updated at the same time, i.e. I need to be able to
run both methods independently, passing the original, unchanged object. This is
not impossible to implement with classes, but the added value of classes for
this design seems minimal at best.

This independent update step is what makes the Conjured trait easy to implement
by simply calling the nextQuality operation twice.

Adding new types of object should be very easy in the current scheme as long as
they keep only changing the sellIn and quality attributes.

I am not very familiar with JS engine optimizations. I  strongly suspect the
approach I have chosen (of creating objects through explicit functions, rather
than through instanciation of classes or through prototype methods) is going to
be suboptimal in both memory use (lots of functions are created on-the-fly,
which implies they would be new function objects, rather than sharing the same
one across all objects that need the same behaviour) and in terms of
computation (I imagine JS engines can do better inlining on classes and
prototypes than random functions as properties). I have assumed that it would
not be a problem for this application.

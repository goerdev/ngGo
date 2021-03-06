/**
 * Specifications
 */
describe('GameScore', function() {

  //Load module and service
  beforeEach(module('ngGo'));
  beforeEach(module('ngGo.Game.Score.Service'));

  //Inject StoneColor and GameScore
  let StoneColor, GameScore, score;
  beforeEach(inject(function(_StoneColor_, _GameScore_) {
    StoneColor = _StoneColor_;
    GameScore = _GameScore_;
  }));

  /**
   * Should have black and white score objects
   */
  it('should have score objects for all colors', function() {
    score = new GameScore();
    for (let c in score.colors) {
      if (score.colors.hasOwnProperty(c)) {
        let color = score.colors[c];
        expect(typeof score.get(color)).toBe('object');
      }
    }
  });

  /**
   * Scoring properties
   */
  it('should have all scoring properties at 0 initially', function() {
    score = new GameScore();
    for (let c in score.colors) {
      if (score.colors.hasOwnProperty(c)) {
        let color = score.colors[c];
        for (let i in score.items) {
          if (score.items.hasOwnProperty(i)) {
            let item = score.items[i];
            expect(score.get(color, item)).toBe(0);
          }
        }
      }
    }
  });

  /**
   * No winner
   */
  it('should have no winner initially', function() {
    expect(score.winner()).toBe(StoneColor.EMPTY);
  });

  /**
   * Random score values
   */
  describe('with random score values', function() {

    /**
     * Create some random values for each property
     */
    let rand;
    beforeAll(function() {
      rand = {};
      score = new GameScore();
      for (let c in score.colors) {
        if (score.colors.hasOwnProperty(c)) {
          let color = score.colors[c];
          rand[color] = {};
          for (let i in score.items) {
            if (score.items.hasOwnProperty(i)) {
              let item = score.items[i];
              rand[color][item] = Math.floor(Math.random() * 100);
            }
          }
        }
      }
    });

    /**
     * Setting and getting
     */
    it('should remember the set score values', function() {
      for (let c in score.colors) {
        if (score.colors.hasOwnProperty(c)) {
          let color = score.colors[c];
          for (let i in score.items) {
            if (score.items.hasOwnProperty(i)) {
              let item = score.items[i];

              //Set property in score
              score.set(color, item, rand[color][item]);

              //Compare
              expect(score.get(color, item)).toEqual(rand[color][item]);
            }
          }
        }
      }
    });

    /**
     * Total
     */
    it('should have matching score totals', function() {
      for (let c in score.colors) {
        if (score.colors.hasOwnProperty(c)) {

          //Init
          let color = score.colors[c];
          let totalFromRand = 0;
          let totalFromGet = 0;

          //Loop items
          for (let i in score.items) {
            if (score.items.hasOwnProperty(i)) {
              let item = score.items[i];
              totalFromRand += rand[color][item];
              totalFromGet += score.get(color, item);
            }
          }

          //Validate totals
          expect(totalFromGet).toEqual(totalFromRand);
          expect(score.total(color)).toEqual(totalFromRand);
          expect(score.total(color)).toEqual(totalFromGet);
        }
      }
    });

    /**
     * Winner
     */
    it('should declare the correct winner', function() {
      let winner = StoneColor.EMPTY;
      let highestScore = 0;
      for (let c in score.colors) {
        if (score.colors.hasOwnProperty(c)) {

          //Init
          let color = score.colors[c];
          let totalFromRand = 0;

          //Get total in rand
          for (let i in score.items) {
            if (score.items.hasOwnProperty(i)) {
              let item = score.items[i];
              totalFromRand += rand[color][item];
            }
          }

          //Determine highest score
          if (totalFromRand > highestScore) {
            highestScore = totalFromRand;
            winner = color;
          }
          else if (totalFromRand === highestScore) {
            winner = StoneColor.EMPTY;
          }
        }
      }

      //Compare winner
      expect(score.winner()).toEqual(winner);
    });

    /**
     * After a reset
     */
    describe('after a reset', function() {

      //Reset score
      beforeAll(function() {
        score.reset();
      });

      /**
       * No scores
       */
      it('should have no scores', function() {
        for (let c in score.colors) {
          if (score.colors.hasOwnProperty(c)) {
            let color = score.colors[c];
            for (let i in score.items) {
              if (score.items.hasOwnProperty(i)) {
                let item = score.items[i];
                expect(score.get(color, item)).toBe(0);
              }
            }
          }
        }
      });

      /**
       * No winner
       */
      it('should have no winner', function() {
        expect(score.winner()).toBe(StoneColor.EMPTY);
      });
    });

    /**
     * Draw handling
     */
    describe('with a draw', function() {

      //Reset score and create draw
      beforeAll(function() {
        score.reset();
        for (let c in score.colors) {
          if (score.colors.hasOwnProperty(c)) {
            let color = score.colors[c];
            for (let i in score.items) {
              if (score.items.hasOwnProperty(i)) {
                let item = score.items[i];
                score.set(color, item, 1);
              }
            }
          }
        }
      });

      /**
       * Matching totals
       */
      it('should have matching totals', function() {
        let prevTotal;
        for (let c in score.colors) {
          if (score.colors.hasOwnProperty(c)) {
            let color = score.colors[c];
            let total = score.total(color);
            if (typeof prevTotal !== 'undefined') {
              expect(prevTotal).toEqual(total);
            }
            prevTotal = total;
          }
        }
      });

      /**
       * No winner
       */
      it('should have no winner', function() {
        expect(score.winner()).toBe(StoneColor.EMPTY);
      });
    });
  });
});

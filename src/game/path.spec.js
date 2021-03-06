describe('Game', function() {
  let GamePath;

  function getPopulatedPath(gamePath) {
    const clonedGamePath = gamePath.clone();
    const path = clonedGamePath.path;
    for (let i = 0; i < clonedGamePath.move; ++i) {
      path[i] = path[i] || 0;
    }
    return clonedGamePath;
  }

  function verifyInitialState(gamePath) {
    const populatedGamePath = getPopulatedPath(gamePath);
    expect(populatedGamePath.move).toEqual(0);
    expect(populatedGamePath.branches).toEqual(0);
    expect(populatedGamePath.path).toEqual({});
  }

  //Load modules
  beforeEach(module('ngGo.Game.Path.Service'));

  //Get injectable functions
  beforeEach(inject(function(_GamePath_) {
    GamePath = _GamePath_;
  }));

  describe('#advance', function() {
    it('advances on the main line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(0);

      //Verify
      const populatedGamePath = getPopulatedPath(gamePath);
      expect(populatedGamePath.move).toEqual(1);
      expect(populatedGamePath.branches).toEqual(0);
      expect(populatedGamePath.path).toEqual({
        0: 0,
      });
    });

    it('advances on the 1st branch line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(1);

      //Verify
      const populatedGamePath = getPopulatedPath(gamePath);
      expect(populatedGamePath.move).toEqual(1);
      expect(populatedGamePath.branches).toEqual(1);
      expect(populatedGamePath.path).toEqual({
        0: 1,
      });
    });

    it('advances on the 2nd branch line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(2);

      //Verify
      const populatedGamePath = getPopulatedPath(gamePath);
      expect(populatedGamePath.move).toEqual(1);
      expect(populatedGamePath.branches).toEqual(1);
      expect(populatedGamePath.path).toEqual({
        0: 2,
      });
    });

    it('advances on the main line, then on the branches line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(0);
      gamePath.advance(1);
      gamePath.advance(2);

      //Verify
      const populatedGamePath = getPopulatedPath(gamePath);
      expect(populatedGamePath.move).toEqual(3);
      expect(populatedGamePath.branches).toEqual(2);
      expect(populatedGamePath.path).toEqual({
        0: 0,
        1: 1,
        2: 2,
      });
    });
  });

  describe('#retreat', function() {
    it('should be initial state when retreating on the main line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(0);
      gamePath.retreat();

      //Verify
      verifyInitialState(gamePath);
    });

    it('should be initial state when retreating on the branch line', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(2);
      gamePath.advance(1);
      gamePath.advance(0);
      gamePath.retreat();
      gamePath.retreat();
      gamePath.retreat();

      //Verify
      verifyInitialState(gamePath);
    });
  });

  describe('#setMove', function() {
    it('should have no effect when setting invalid move number', function() {
      const gamePath = new GamePath();

      //Set negative low move number
      gamePath.setMove(-1);

      //Verify
      verifyInitialState(gamePath);
    });

    it('should be back to initial state', function() {
      const gamePath = new GamePath();

      //Exercise
      gamePath.advance(2);
      gamePath.advance(1);
      gamePath.advance(0);
      gamePath.setMove(0);

      //Verify
      verifyInitialState(gamePath);
    });
  });
});


/**
 * Gib2Jgf :: This is a parser wrapped by the KifuParser which is used to convert fom GIB to JGF.
 * Since the Gib format is not public, the accuracy of this parser is not guaranteed.
 */

/**
 * Module definition and dependencies
 */
angular.module('ngGo.Kifu.Parsers.Gib2Jgf.Service', [
  'ngGo',
  'ngGo.Kifu.Blank.Service',
])

/**
 * Factory definition
 */
.factory('Gib2Jgf', function(ngGo, KifuBlank) {

  /**
   * Regular expressions
   */
  let regMove = /STO\s0\s([0-9]+)\s(1|2)\s([0-9]+)\s([0-9]+)/gi;
  let regPlayer = /GAME(BLACK|WHITE)NAME=([A-Za-z0-9]+)\s\(([0-9]+D|K)\)/gi;
  let regKomi = /GAMEGONGJE=([0-9]+)/gi;
  let regDate = /GAMEDATE=([0-9]+)-\s?([0-9]+)-\s?([0-9]+)/g;
  let regResultMargin = /GAMERESULT=(white|black)\s([0-9]+\.?[0-9]?)/gi;
  let regResultOther = /GAMERESULT=(white|black)\s[a-z\s]+(resignation|time)/gi;

  /**
   * Player parser function
   */
  function parsePlayer(jgf, match) {

    //Initialize players container
    if (typeof jgf.game.players === 'undefined') {
      jgf.game.players = [];
    }

    //Determine player color
    let color = (match[1].toUpperCase() === 'BLACK') ? 'black' : 'white';

    //Create player object
    let player = {
      color: color,
      name: match[2],
      rank: match[3].toLowerCase(),
    };

    //Check if player of this color already exists, if so, overwrite
    for (let p = 0; p < jgf.game.players.length; p++) {
      if (jgf.game.players[p].color === color) {
        jgf.game.players[p] = player;
        return;
      }
    }

    //Player of this color not found, push
    jgf.game.players.push(player);
  }

  /**
   * Komi parser function
   */
  function parseKomi(jgf, match) {
    jgf.game.komi = parseFloat(match[1] / 10);
  }

  /**
   * Date parser function
   */
  function parseDate(jgf, match) {

    //Initialize dates container
    if (typeof jgf.game.dates === 'undefined') {
      jgf.game.dates = [];
    }

    //Push date
    jgf.game.dates.push(match[1] + '-' + match[2] + '-' + match[3]);
  }

  /**
   * Result parser function
   */
  function parseResult(jgf, match) {

    //Winner color
    let result = (match[1].toLowerCase() === 'black') ? 'B' : 'W';
    result += '+';

    //Win condition
    if (match[2].match(/res/i)) {
      result += 'R';
    }
    else if (match[2].match(/time/i)) {
      result += 'T';
    }
    else {
      result += match[2];
    }

    //Set in JGF
    jgf.game.result = result;
  }

  /**
   * Move parser function
   */
  function parseMove(jgf, node, match) {

    //Determine player color
    let color = match[2];
    if (color === 1) {
      color = 'B';
    }
    else if (color === 2) {
      color = 'W';
    }
    else {
      return;
    }

    //Create move container
    node.move = {};
    node.move[color] = [Number(match[3]), Number(match[4])];
  }

  /**
   * Parser class
   */
  let Parser = {

    /**
     * Parse GIB string into a JGF object or string
     */
    parse(gib, stringified) {

      //Get new JGF object
      let jgf = KifuBlank.jgf();

      //Initialize
      let match;
      let container = jgf.tree;

      //Create first node for game, which is usually an empty board position, but can
      //contain comments or board setup instructions, which will be added to the node
      //later if needed.
      let node = {root: true};
      container.push(node);

      //Find player information
      while ((match = regPlayer.exec(gib))) {
        parsePlayer(jgf, match);
      }

      //Find komi
      if ((match = regKomi.exec(gib))) {
        parseKomi(jgf, match);
      }

      //Find game date
      if ((match = regDate.exec(gib))) {
        parseDate(jgf, match);
      }

      //Find game result
      if ((match = regResultMargin.exec(gib)) || (match = regResultOther.exec(gib))) {
        parseResult(jgf, match);
      }

      //Find moves
      while ((match = regMove.exec(gib))) {

        //Create new node
        node = {};

        //Parse move
        parseMove(jgf, node, match);

        //Push node to container
        container.push(node);
      }

      //Return stringified
      if (stringified) {
        return angular.toJson(jgf);
      }

      //Return jgf
      return jgf;
    },
  };

  //Return object
  return Parser;
});

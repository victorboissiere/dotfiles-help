const HelpProgram = require('./HelpProgram');
const _ = require('lodash');

class I3 extends HelpProgram {

  parse() {
    const commentLines = HelpProgram.getCommentLines(this.getLines());

    const matchingCommands = I3.getMatchingCommands();

    commentLines.forEach((commentLine) => {
      matchingCommands.forEach((matchingCommand) => {
        this.processCommentLine(matchingCommand, commentLine.comment, commentLine.command);
      });
    });
  }

  processCommentLine(matchingCommand, comment, command) {
    const match = command.match(matchingCommand.regex);
    if (match) {
      const help = _.capitalize(comment.replace(/^#(\s)?/, ''));
      const action = matchingCommand.replacement(match);

      this.helpData.push({ help, action });
    }
  }

  static getMatchingCommands() {
    return [
      {
        regex: /bindsym\s([\w|$]*(\+[\w|$]*)+)\s/,
        replacement: match => match[1],
      },
      {
        regex: /bindcode\s([\w|$]*(\+[\w|$]*)+)\s/,
        replacement: match => match[1],
      },
    ];
  }
}

module.exports = I3;

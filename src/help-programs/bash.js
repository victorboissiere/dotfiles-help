const HelpProgram = require('./HelpProgram');
const _ = require('lodash');

class BASH extends HelpProgram {

  parse() {
    const commentLines = HelpProgram.getCommentLines(this.getLines());

    const matchingCommands = BASH.getMatchingCommands();

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
        regex: /^alias\s(.*)=.*$/,
        replacement: match => match[1],
      },
    ];
  }
}

module.exports = BASH;

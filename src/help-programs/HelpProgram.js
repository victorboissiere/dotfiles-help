const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');
const expandHomeDir = require('expand-home-dir');

class HelpProgram {
  constructor(configPath) {
    this.helpData = [];
    this.fullPath = expandHomeDir(configPath);
    this.configContent = fs.readFileSync(this.fullPath, 'utf8');
  }

  parse() {
    throw new Error(`Method parse should be overwritten for ${this.constructor.name} class`);
  }

  displayHelp() {
    let template = '';
    const maxActionNameLength = _.maxBy(this.helpData, data => data.action.length);
    const maxActionNameCharacters = maxActionNameLength ? maxActionNameLength.action.length : 0;

    this.helpData.forEach((data) => {
      const neededSpaces = new Array((maxActionNameCharacters - data.action.length) + 1).join(' ');

      template += `\n${chalk.blue(data.action)}${neededSpaces} - ${data.help}`;
    });

    process.stdout.write(template);
  }

  getLines() {
    return this.configContent.split('\n');
  }

  static getCommentLines(lines) {
    const commentData = [];

    for (let i = 0; i < lines.length; i += 1) {
      if (HelpProgram.isComment(lines, i)) {
        const commands = HelpProgram.getCommands(lines, i + 1);

        commands.forEach((command) => {
          const comment = lines[i].replace(/^#(\s)*/, '');

          commentData.push({ comment, command });
        });

        i += commands.length;
      }
    }

    return commentData;
  }

  static getCommands(lines, index) {
    const commands = [];

    for (let i = index; i < lines.length; i += 1) {
      if (HelpProgram.isComment(lines, i) || HelpProgram.isBlankLine(lines, i)) {
        return commands;
      }

      commands.push(lines[i]);
    }

    return commands;
  }

  static isComment(lines, index) {
    return lines[index].startsWith('#') && index + 1 < lines.length;
  }

  static isBlankLine(lines, index) {
    return lines[index].match(/^(\s)+$/);
  }


}

module.exports = HelpProgram;

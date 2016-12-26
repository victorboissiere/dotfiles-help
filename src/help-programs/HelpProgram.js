const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');
const expandHomeDir = require('expand-home-dir');

// Parsing type
type CommentData = {
  comment: string,
  command: string
}

// Output type
type HelpData = {
  action: string,
  help: string
}

class HelpProgram {
  helpData: Array<HelpData>;
  fullPath: string;
  configContent: string;

  constructor(configPath) {
    this.helpData = [];
    this.fullPath = expandHomeDir(configPath);
    this.configContent = fs.readFileSync(this.fullPath, 'utf8');
  }

  /**
  * MAIN FUNCTIONS
  */

  parse(): void {
    throw new Error(`Method parse should be overwritten for ${this.constructor.name} class`);
  }

  displayHelp(): void {
    let template = '';
    const maxActionNameLength = _.maxBy(this.helpData, data => data.action.length);
    const maxActionNameCharacters = maxActionNameLength ? maxActionNameLength.action.length : 0;

    this.helpData.forEach((data) => {
      const neededSpaces = new Array((maxActionNameCharacters - data.action.length) + 1).join(' ');

      template += `\n${chalk.blue(data.action)}${neededSpaces} - ${data.help}`;
    });

    process.stdout.write(template);
  }

  getLines(): Array<string> {
    return this.configContent.split('\n');
  }

  /**
  * PARSING FUNCTIONS
  */

  static getCommentLines(lines: Array<string>): Array<CommentData> {
    const commentData: Array<CommentData> = [];

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

  static getCommands(lines: Array<string>, index: number): Array<string> {
    const commands: Array<string> = [];

    for (let i = index; i < lines.length; i += 1) {
      if (HelpProgram.isComment(lines, i) || HelpProgram.isBlankLine(lines, i)) {
        return commands;
      }

      commands.push(lines[i]);
    }

    return commands;
  }

  /**
  * UTILS FUNCTIONS
  */

  static isComment(lines: Array<string>, index: number): boolean {
    return lines[index].startsWith('#') && index + 1 < lines.length;
  }

  static isBlankLine(lines: Array<string>, index: number): boolean {
    const match = lines[index].match(/^(\s)*$/);

    return match !== null && match.length > 0;
  }


}

module.exports = HelpProgram;

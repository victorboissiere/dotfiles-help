const _ = require('lodash');
const assert = require('assert');
const inquirer = require('inquirer');
const I3 = require('./help-programs/i3');
const VIM = require('./help-programs/vim');
const BASH = require('./help-programs/bash');

type HelpProgram = {
  configFile: string,
  Create: Class
}

type HelpPrograms = {
  [key: string]: HelpProgram
}

const HELP_PROGRAMS: HelpPrograms = {
  i3: {
    configFile: '~/.i3/config',
    Create: I3,
  },
  vim: {
    configFile: '~/.vimrc',
    Create: VIM,
  },
  zshrc: {
    configFile: '~/.zshrc',
    Create: BASH,
  },
};

function runHelpProgram(programName: string): void {
  assert(programName in HELP_PROGRAMS, `Program ${programName} not supported`);

  const currentHelpProgram: HelpProgram = HELP_PROGRAMS[programName];

  const helpProgram = new currentHelpProgram.Create(currentHelpProgram.configFile);
  helpProgram.parse();
  helpProgram.displayHelp();
}

function start(): Promise<void> {
  return inquirer.prompt([{
    type: 'list',
    name: 'helpProgram',
    message: 'Choose program to get help from',
    choices: _.keys(HELP_PROGRAMS),
  }])
  .then(answer => runHelpProgram(answer.helpProgram))
  .catch((err) => {
    throw new Error(err);
  });
}

if (require.main === module) {
  start().then(() => {});
}


module.exports = start;

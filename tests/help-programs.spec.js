/* global describe,it,beforeEach,afterEach */

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

// Programs
const I3 = require('../src/help-programs/i3');
const BASH = require('../src/help-programs/bash');

const PROGRAMS = [I3, BASH];

describe('Generic program testing', () => {
  PROGRAMS.forEach((Program) => {
    describe(Program.name, () => {
      // Get all test files and run them
      const testFiles = glob.sync(`./tests/fake-dotfiles/${Program.name.toLowerCase()}/*.json`);
      testFiles.forEach((file) => {
        const fileData = JSON.parse(fs.readFileSync(file, 'utf8'));
        it(`${path.basename(file)} -- ${fileData.description}`, () => {
          const helpProgram = new Program(file);
          // Override file content
          helpProgram.configContent = fileData.content;

          helpProgram.parse();
          expect(helpProgram.helpData).to.deep.equal(fileData.helpData);
        });
      });
    });
  });
});

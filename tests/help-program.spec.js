/* global describe,it,beforeEach,afterEach */
const sinon = require('sinon');
const expect = require('chai').expect;
const HelpProgram = require('../src/help-programs/HelpProgram');

describe('I3 help', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('HelpProgram', () => {
    it('Should throw an error when invalid configPath', () => {
      try {
        new HelpProgram('invalid_path'); // eslint-disable-line
        throw new Error('Should have thrown an error');
      } catch (err) {
        expect(err.code).to.equal('ENOENT');
      }
    });

    describe('Line parsing', () => {
      it('Should recognize valid comment lines', () => {
        const validComments = [
          '#Test',
          '# Test',
          '#  Test',
        ];

        validComments.forEach((comment) => {
          expect(HelpProgram.isComment([comment, ''], 0)).to.equal(true, `Cannot recognized comment line ${comment}`);
        });
      });

      it('Should not recognized invalid comment lines', () => {
        expect(HelpProgram.isComment(['some comment'], 0)).to.equal(false, 'Comment without a line below is valid');
        expect(HelpProgram.isComment(['# some comment'], 0)).to.equal(false, 'Comment without a line below is valid');
      });

      it('Should recognize blank lines', () => {
        const blankLines = [
          '',
          ' ',
          '\n',
          '\n   ',
          ' \n ',
          '  \n  ',
        ];

        blankLines.forEach((line) => {
          expect(HelpProgram.isBlankLine([line], 0)).to.equal(true, `Line ${line} is not a blank line`);
        });
      });
    });
  });
});

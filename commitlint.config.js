// https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
const config = {
  extends: ['@commitlint/config-conventional'],
  // https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
  // 0 disables the rule. For 1 it will be considered a warning. For 2 an error.
  rules: {
    // I configured semantic-release git plugin to create a release commit with
    // a message body containing the release notes. Since these release notes
    // can be quite long, this would sometimes exceed the limit set by the
    // config-conventional preset (100 characters). That's why I decided to
    // override this rule.
    'body-max-line-length': [2, 'always', Infinity]
  }
}

// As a reminder, a convential commit message has the following structure:

///////////////////////////
// type(scope?): subject //
//                       //
// body?                 //
// footer?               //
///////////////////////////

// type must be one of:
// - build
// - chore
// - ci
// - docs
// - feat (triggers a MINOR release)
// - fix (triggers a PATCH release)
// - perf
// - refactor
// - revert
// - style
// - test

// scope, body, footer are optional.

// BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a !
// after the type/scope, introduces a breaking API change (correlating with
// MAJOR in Semantic Versioning).
// A BREAKING CHANGE can be part of commits of any type.

// https://www.conventionalcommits.org/en/v1.0.0/

// console.log('=== commitlint config ===', config)

module.exports = config

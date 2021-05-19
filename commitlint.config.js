// https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
const config = { extends: ['@commitlint/config-conventional'] }

// As a reminder, a convential commit message has the following structure:
//////////////////////////
// type(scope): subject //
//////////////////////////
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
// TODO: what about a type of BREAKING CHANGE?

module.exports = config

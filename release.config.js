// configuration for semantic-release

// IMPORTANT: this file is executed in a package root, not in the monorepo root.
// That's why there is this: ../../commitlint.config.js
// Note: each plugin is configured as an array. It's a bit weird...

// https://github.com/semantic-release/changelog
const changelog = [
  '@semantic-release/changelog',
  {
    changelogFile: 'CHANGELOG.md'
  }
]

// https://github.com/semantic-release/commit-analyzer
// I prefer to keep the configuration for the commit linter in
// commitlint.config.js,so I can run npm run lint even when I am not releasing
// (I like to lint commits with a pre-push git hook).
// Since in commitlint.config.js I am using conventional commits, these 2
// configurations for @semantic-release/commit-analyzer are equivalent:
// 1. config: './commitlint.config.js'
// 2. preset: 'conventionalcommits'
const commitAnalyzer = [
  '@semantic-release/commit-analyzer',
  {
    config: './commitlint.config.js'
  }
]

// https://github.com/semantic-release/git
const git = [
  '@semantic-release/git',
  {
    assets: [
      'dist/index.js',
      'CHANGELOG.md',
      'package.json',
      'package-lock.json'
    ],
    message:
      'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
  }
]

// https://github.com/semantic-release/github
// I am not using the github plugin when publishing on Verdaccio because I am
// using Verdaccio just to test the release process, and I don't want to create
// a GitHub release when doing it.
const github = [
  '@semantic-release/github',
  {
    assets: [
      { path: 'README.md' },
      { path: 'LICENSE' },
      { path: 'CHANGELOG.md' },
      { path: 'dist/index.js', label: 'JS bundle' }
    ]
  }
]

// https://github.com/semantic-release/npm
// Even if not publishing on npm, the npm plugin is needed to bump the version.
const npm = ['@semantic-release/npm', { npmPublish: false, pkgRoot: '.' }]

// https://github.com/semantic-release/release-notes-generator
const releaseNotesGenerator = [
  '@semantic-release/release-notes-generator',
  {
    config: './commitlint.config.js'
  }
]

const config = {
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches
  branches: ['main', 'release'],
  ci: true,
  // The git plugin must be called after the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  plugins: [commitAnalyzer, releaseNotesGenerator, changelog, npm, github, git]
}

// console.log('=== semantic-release config ===', config)

module.exports = config

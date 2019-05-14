#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync
const pegjs = require('pegjs')
const yaml = require('js-yaml')

const colors = require('./colors')
const pk = require('../package.json')

const templateFileName = '.gitcommit_template'
const definitionsFileName = '.git_consistent'

const version = pk.version

//
// Functions
//
const getGitProjectRootPath = () => {
  try {
    return execSync('git rev-parse --show-toplevel 2> /dev/null')
      .toString()
      .trim()
  } catch (_e) {
    return undefined
  }
}

const getFilePath = (filePaths, fileName) => {
  const filePath = filePaths.find((filePath) => fs.existsSync(path.join(filePath, fileName)))

  return filePath ? path.join(filePath, fileName) : undefined
}

const loadYaml = (path) => {
  return yaml.safeLoad(fs.readFileSync(path, 'utf8'))
}

const createGrammer = (_program, templateFilePath, definitionsFilePath) => {
  if (!templateFilePath) throw new Error(`Not found '${templateFileName}'.`)
  if (!definitionsFilePath) throw new Error(`Not found '${definitionsFileName}'.`)

  const template = fs.readFileSync(templateFilePath, 'utf8')
  const _definitions = loadYaml(definitionsFilePath)

  let match
  const regexp = /<([^\n>]+)>/gm
  while ((match = regexp.exec(template))) {
    const _term = match[1]
    // hoge = hoge.replace(new RegExp(`<${term}>`), 'string')
  }

  // console.log(hoge)

  // TODO
  return `
    start = "hello"
  `
}

const tryParseInput = (_program, templateFilePath, definitionsFilePath) => {
  let input = ''
  process.stdin.on('readable', () => {
    let chunk
    while ((chunk = process.stdin.read()) !== null) {
      input += chunk
    }
  })

  const perser = pegjs.generate(createGrammer(_program, templateFilePath, definitionsFilePath))

  process.stdin.on('end', () => {
    try {
      perser.parse(input)
      console.log(`${colors.success}Done${colors.reset}`)
      process.exit(1)
    } catch (e) {
      if (e.name == 'SyntaxError') {
        console.error(`${colors.error}${e.message}${colors.reset}`)
      }
      process.exit(1)
    }
  })
}

//
// Main
//
const rootPath = getGitProjectRootPath() || '.'
const templateFilePath = getFilePath([rootPath, process.env.HOME], templateFileName)
const definitionsFilePath = getFilePath([rootPath, process.env.HOME], definitionsFileName)

program
  .on('--help', () => {
    console.log('')
    console.log('File Paths:')
    console.log(`  ${templateFileName}:\t ${templateFilePath}`)
    console.log(`  ${definitionsFileName}:    \t ${definitionsFilePath}`)
  })
  .version(version)

program.parse(process.argv)

process.stdin.setEncoding('utf8')

tryParseInput(program, templateFilePath, definitionsFilePath)

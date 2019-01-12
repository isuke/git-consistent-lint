#!/usr/bin/env node

const program = require('commander')
const _path = require('path')
const _fs = require('fs')
const _pegjs = require('pegjs')

const pk = require('../package.json')

const _templateFileName = '.gitcommit_template'
const _definitionsFileName = '.git_consistent'

const version = pk.version

const createGrammer = (_program) => {
  console.log('hello')
}

program.version(version)

program.parse(process.argv)

createGrammer(program)

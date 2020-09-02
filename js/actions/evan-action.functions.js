/* jslint browser: true */
/* global doStuff */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

/**
 * getVarsToFileName() makes a GET variable string usable as a
 * file name
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function getVarsToFileName (input, extraInputs, GETvars) {
  var output = input.replace(/^.*?\?/g, '')
  output = output.replace(/&/g, '_')
  output = output.replace(/=/g, '-')
  return output
}

doStuff.register({
  action: 'getVarsToFileName',
  func: getVarsToFileName,
  group: 'even',
  ignore: false,
  name: 'Convert GET variable string to file name string'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

function extractURLs (input, extraInputs, GETvars) {
  const regex = new RegExp('(\'|"|\\()(https?:\\/\\/.*?((?:[^\\."\'/]+\\.)+(js|css|svg|eot|woff2|woff|ttf|png|jpe?g|gif|ico)))(?:\'|"|\\))', 'g')
  let matches
  // let URLs = []
  let output = ''
  let dir = ''
  let sep = ''

  matches = regex.exec(input)
  console.log('matches:', matches)

  while (Array.isArray(matches)) {
    // URLs.push(matches[2])
    switch (matches[4].toLowerCase()) {
      case 'css':
      case 'js':
        dir = matches[4]
        break
      case 'eot':
      case 'woff2':
      case 'woff':
      case 'ttf':
        dir = 'fonts'
        break
      default:
        dir = 'img'
    }
    output += sep + matches[2] + '\n\t..\\' + dir + '\\' + matches[3]
    sep = '\n\n'
    matches = regex.exec(input)
    console.log('matches:', matches)
  }

  return output
}

doStuff.register({
  action: 'extractURLs',
  func: extractURLs,
  group: 'evan',
  ignore: false,
  name: 'Extract all the URLs in a string'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * fixDS() Fix Data Source keywords
 * file name
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixDS (input, extraInputs, GETvars) {
  const reg = new RegExp('%ds_+([^\\^%]+)(?:\\^[^%]+)*(?=%)', 'g')
  let output = ''

  const replaceCallback = (match0, match1) => {
    return '%ds__' + match1.toLowerCase() + '^trim^json_encode'
  }
  output = input.replace(reg, replaceCallback)

  return output.replace(/^/g, '  ')
}

doStuff.register({
  action: 'fixDS',
  func: fixDS,
  group: 'evan',
  ignore: false,
  name: 'Fix Data Source keywords'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * stringToConstFormat() Make string usable as a constant name (UPPER_CASE)
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function stringToConstFormat (input, extraInputs, GETvars) {
  const reg = new RegExp('[^0-9a-z]+', 'ig')

  let output = input.replace(reg, '_')
  output = output.replace(/_(?=[st]_)/ig, '')

  return output.toUpperCase()
}

doStuff.register({
  action: 'stringToConstFormat',
  func: stringToConstFormat,
  group: 'evan',
  ignore: false,
  name: 'Make string usable as a constant identifier'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * formAdminLocalURLs() Make string usable as a constant name (UPPER_CASE)
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function formAdminLocalURLs (input, extraInputs, GETvars) {
  const findReplace = [
    [
      new RegExp('https://apps\\.acu\\.edu\\.au/~trevorg/form_admin', 'g'),
      'html'
    ],
    [
      new RegExp('((?:href|src)=")(?=(?:style|js)/)', 'g'),
      '$1html/'
    ],
    [
      new RegExp('((?:href|src)=")\\.\\./acustaff(?=/ckeditor)', 'g'),
      '$1html/js'
    ]
  ]
  let output = input
  for (let a = 0; a < findReplace.length; a += 1) {
    output = output.replace(findReplace[a][0], findReplace[a][1])
  }

  return output
}

doStuff.register({
  action: 'formAdminLocalURLs',
  func: formAdminLocalURLs,
  ignore: false,
  group: 'evan',
  name: 'Make form admin URLs local'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * buildAcroSQL() Generate an SQL statement for inserting SA Main
 * acronyms into form_build
 *
 * created by: Evan Wills
 * created: 2020-03-02
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function buildAcroSQL (input, extraInputs, GETvars) {
  const findReplace = [
    [
      new RegExp('^SA ID\\t(?:[^\\t]*\\t+){6}Sitecore URL[\\r\\n]+'),
      ''
    ],
    [
      new RegExp('(?:^|[\\r\\n])[0-9]+\\t[0-9]+\\t([a-z0-9]+)\\t(?:[^\\t]*\\t+){5}(https://.*?)(?=[\\r\\n]|$)', 'ig'),
      '\n(\'$1\', \'$2\'),'
    ],
    [
      new RegExp(',$'),
      ';'
    ]
  ]

  let output = input.trim()
  for (let a = 0; a < findReplace.length; a += 1) {
    output = output.replace(findReplace[a][0], findReplace[a][1])
    output = output.trim()
  }
  return 'INSERT INTO `form_acro` ( `acro`, `acro_url` ) VALUES' + output
}

doStuff.register({
  action: 'buildAcroSQL',
  func: buildAcroSQL,
  group: 'evan',
  ignore: false,
  name: 'SQL for inserting SA Main acros into form_build'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * Use to reliably rewrite some PHP code after an API change.
 *
 * created by: Evan Wills
 * created: 2020-03-02
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixSet (input, extraInputs, GETvars) {
  console.log('inside fixSet()')
  const replaceCallback = (whole, func, value, prop, key1a, key1b, key2a, key2b) => {
    key2a = (typeof key2a === 'undefined') ? '' : key2a
    key2b = (typeof key2b === 'undefined') ? '' : key2b

    return '$config->' + func + "('" + prop.toLowerCase() + key1a.toUpperCase() + key1b + key2a.toUpperCase() + key2b + "', " + value
  }
  const find = new RegExp('(?:RegexAPI::|\\$config->)(set)Config\\(([^,]+)(?:,\\s+\'([a-z]+)\')?(?:,\\s+\'([a-z])([a-z]+)\')?(?:,\\s+\'([a-z])([a-z]+)\')?(?=\\);)', 'ig')

  return input.replace(find, replaceCallback)
}

doStuff.register({
  action: 'fixSet',
  func: fixSet,
  group: 'evan',
  ignore: true,
  name: 'Fix config set order'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

// ====================================================================
// START: Animal Crossing 1

/**
 * animalCrossing1() Rewrite Animal Crossing price list table
 *
 * created by: Evan Wills
 * created: 2020-07-07
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function animalCrossing1 (input, extraInputs, GETvars) {
  var output = input
  var regex = new RegExp('"No. ([0-9]+)(.*?)\\s+\\(([^)]+)\\)"\\t([^\\t]+)\\t([0-9]+)\\t([^\\t]+)\\t"N: (.*?)\\s+S:\\s+(.*?)(All (?:Day|night)|[0-9]+[ap]m ~ [0-9]+[ap]m)"\\t"[^"]+"', 'ig')

  function replace (whole, pos, name, scarcity, size, price, location, northern, southern, time) {
    location = location.replace(/\s+/g, ' ')

    return name + '\t' + price + '\t' + scarcity + '\t' + location + '\t' + size + '\t' + time + '\t' + southern + '\t' + northern
  }

  return output.replace(regex, replace)
}

doStuff.register({
  action: 'animalCrossing1',
  func: animalCrossing1,
  description: 'Rewrite Animal Crossing price list table',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Animal Crossing 1'
})

//  END:  Animal Crossing 1
// ====================================================================
// START: Clean CSS

/**
 *
 *
 * created by: Evan Wills
 * created: 2020-08-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function CSSclean (input, extraInputs, GETvars) {
  const regex = new RegExp('(.key-val-2-col--[0-9]+)(>)(dt:nth-of-type\\([0-9]+\\) {)\\s+(order: [0-9]+)\\+s(?=\\})', 'igs')
  return input.replace(regex, '$1 $2; ')
}

doStuff.register({
  action: 'CSSclean',
  func: CSSclean,
  description: '',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'CSS Clean'
})

//  END: Clean CSS
// ====================================================================

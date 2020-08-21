/* jslint browser: true */
/* global doStuff */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

// ====================================================================
// START: CEG course advice HTML

function CEGcourseAdvice (input, extraInputs, GETvars) {
  var output = ''
  var campuses = [
    { name: 'Adelaide', abbr: 'adel' },
    { name: 'Ballarat', abbr: 'ball' },
    { name: 'Blacktown', abbr: 'btown' },
    { name: 'Brisbane', abbr: 'bris' },
    { name: 'Canberra', abbr: 'canb' },
    { name: 'North Sydney', abbr: 'nsyd' },
    { name: 'Rome', abbr: 'rome' },
    { name: 'Strathfield', abbr: 'strath' }
  ]
  var a = 0

  function tmplP (label, keyword, campusAbbr) {
    var outputP = ''

    outputP += '\n<p class="CEG-ca-links">\n'
    outputP += '\t<strong class="CEG-ca-label">' + label + ':</strong>\n\t'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1^preg_match:1377261%'
    outputP += '<a href="tel:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%" class="CEG-ca-email">\n'
    outputP += '%else_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%'
    outputP += '<a href="mailto:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%?subject=Course advice for \'%asset_name%\'" class="CEG-ca-email">\n'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%'
    outputP += '\n\t\t%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%\n'
    outputP += '\t</a>'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%<br />\n\t'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^preg_match:1377261%'
    outputP += '<a href="tel:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^trim%" class="CEG-ca-email">'
    outputP += '%else_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%'
    outputP += '<a href="mailto:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^trim%?subject=Professional experience advice for \'%asset_name%\'" class="CEG-ca-email">'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%'
    outputP += '\n\t\t%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%\n'
    outputP += '\t</a>'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%\n'
    outputP += '</p>\n'

    return outputP
  }

  for (a = 0; a < campuses.length; a += 1) {
    output += '\n\n<!-- start: CEG-course-advice__' + campuses[a].abbr + '__course-admin_1 -->\n'
    output += '%begin_asset_metadata___CEG-course-advice__' + campuses[a].abbr + '__course-admin_1%\n'
    output += '<h4 class="overline-head--small">' + campuses[a].name + ' campus</h4>\n'
    output += tmplP('Course administrator', 'course-admin', campuses[a].abbr)
    output += '\n\n<!-- start: CEG-course-advice__' + campuses[a].abbr + '__prof-exp-advisor_1 -->\n'
    output += '%begin_asset_metadata___CEG-course-advice__' + campuses[a].abbr + '__prof-exp-advisor_1%'
    output += tmplP('Professional Experience Advice', 'prof-exp-advisor', campuses[a].abbr)
    output += '%end_asset_metadata___CEG-course-advice__' + campuses[a].abbr + '__prof-exp-advisor_1%\n'
    output += '<!--  end:  CEG-course-advice__' + campuses[a].abbr + '__prof-exp-advisor_1 -->\n'
    output += '%end_asset_metadata___CEG-course-advice__' + campuses[a].abbr + '__course-admin_1%\n'
    output += '<!--  end:  CEG-course-advice__' + campuses[a].abbr + '__course-admin_1 -->\n\n'
  }

  return output
}

doStuff.register({
  action: 'CEGcourseAdvice',
  // description: 'Remove all whitespace from HTML Code',
  func: CEGcourseAdvice,
  ignore: true,
  name: 'CEG course advice HTML'
})

//  END:  CEG course advice HTML
// ====================================================================
// START: Convert Stiecore mega-menu to Matrix mega-menu

function sitecoreMM2matrixMM (input, extraInputs, GETvars) {
  var output = input

  var regexFinds = [
    new RegExp('\\s*<button.*?</button>', 'igs')
  ]

  var regexReplaces = [
    ''
  ]

  for (var a = 0; a < regexFinds.length; a += 1) {
    output = output.replace(regexFinds[a], regexReplaces[a])
  }

  return output
}

doStuff.register({
  action: 'sitecoreMM2matrixMM',
  // description: 'Remove all whitespace from HTML Code',
  func: sitecoreMM2matrixMM,
  ignore: false,
  name: 'Convert Stiecore mega-menu to Matrix mega-menu'
})

//  END:  Convert Stiecore mega-menu to Matrix mega-menu
// ====================================================================
// START: New Relic-ify

function newRelicify (input, extraInputs, GETvars) {
  var a = 0
  var className = extraInputs.className()
  var find = [
    '(function\\s+([a-z0-9_]+)\\s*\\([^)]*\\))\\s*\\{(\\s*)',
    '\\?>\\s*',
    '$'
  ]
  var replace = []
  var space = '\n\t'
  var output = input
  var tmp = null

  // console.log('input:', input)

  className = className.replace(/^\s+|\s+$/g, '')

  if (className !== '') {
    className += '::'
    space += '\t'
  }

  replace = [
    '$1 {' + space + 'if( NEW_RELIC ) { newrelic_add_custom_tracer(\'' + className + '$2\'); }\n$3',
    '',
    '\n\nif(!defined(\'NEW_RELIC\')) { define(\'NEW_RELIC\', extension_loaded(\'newrelic\')); }\n'
  ]

  for (a = 0; a < find.length; a += 1) {
    tmp = new RegExp(find[a], 'ig')
    output = output.replace(tmp, replace[a])
  }

  return output
}

doStuff.register({
  action: 'newRelicify',
  func: newRelicify,
  ignore: false,
  name: 'New Relic-ify',
  description: 'Add New Relic instrumentation to PHP code',
  extraInputs: [
    {
      id: 'className',
      label: 'Class name',
      type: 'text',
      pattern: '^[a-zA-Z_][a-zA-Z0-9_]+$',
      placeHolder: 'Leave empty for global functions'
    }
  ]
})

//  END:  New Relic-ify
// ====================================================================
// START: fixSassLintIssues

/**
 * Fix ACU.Sitecore scss issues
 *
 * created by: Evan Wills
 * created: 2020-08-22
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
function fixSassLintIssues (input, extraInputs, GETvars) {
  const fixSinglePix = (whole, preSpace, value) => {
    const output = Math.round((value / extraInputs.remValue()) * 100) / 100
    return preSpace + output + 'rem'
  }
  const fixMultiPix = (whole) => {
    return whole.replace(/(\s+-?)([0-9]+)px/ig, fixSinglePix)
  }
  const colours = [
    { find: new RegExp('#ed0c00', 'ig'), replace: '$red--100' },
    { find: new RegExp('#d00a00', 'ig'), replace: '$red--120' },
    { find: new RegExp('#f15047', 'ig'), replace: '$red--80' },
    { find: new RegExp('#f57c75', 'ig'), replace: '$red--60' },
    { find: new RegExp('#f8a7a3', 'ig'), replace: '$red--40' },
    { find: new RegExp('#fcd3d1', 'ig'), replace: '$red--20' },
    { find: new RegExp('#3c1053', 'ig'), replace: '$purple--100' },
    { find: new RegExp('#260b34', 'ig'), replace: '$purple--120' },
    { find: new RegExp('#634075', 'ig'), replace: '$purple--80' },
    { find: new RegExp('#8a7098', 'ig'), replace: '$purple--60' },
    { find: new RegExp('#b19fba', 'ig'), replace: '$purple--40' },
    { find: new RegExp('#d8cfdd', 'ig'), replace: '$purple--20' },
    { find: new RegExp('#e03c31', 'ig'), replace: '$health-sciences' },
    { find: new RegExp('#007932', 'ig'), replace: '$education-arts' },
    { find: new RegExp('#bc333b', 'ig'), replace: '$law-business' },
    { find: new RegExp('#702082', 'ig'), replace: '$theology-philosophy' },
    { find: new RegExp('#B8A8C1', 'ig'), replace: '$testimonial-text' },
    { find: new RegExp('#ccc', 'ig'), replace: '$grey' },
    // { find: new RegExp('#747474', 'ig'), replace: '$text-colour' },
    // { find: new RegExp('#747474', 'ig'), replace: '$grey-border' },
    { find: new RegExp('#3d3935', 'ig'), replace: '$dark-brown' },
    { find: new RegExp('#8c857b', 'ig'), replace: '$stone' },
    { find: new RegExp('#e8e3db', 'ig'), replace: '$sand' },
    { find: new RegExp('#747474', 'ig'), replace: '$dark-grey' },
    { find: new RegExp('#eeeeee', 'ig'), replace: '$light-grey' },
    { find: new RegExp('#fafafa', 'ig'), replace: '$x-light-grey' },
    // { find: new RegExp('#fff', 'ig'), replace: '$body-bg' },
    // { find: new RegExp('#fff', 'ig'), replace: '$text-colour-light' },
    { find: new RegExp('#3d3935', 'ig'), replace: '$charcoal--100' },
    { find: new RegExp('#252320', 'ig'), replace: '$charcoal--120' },
    { find: new RegExp('#000', 'ig'), replace: '$black' },
    { find: new RegExp('#747474', 'ig'), replace: '$black--80' },
    { find: new RegExp('#ccc', 'ig'), replace: '$black--40' },
    { find: new RegExp('#eee', 'ig'), replace: '$black--20' },
    { find: new RegExp('#fafafa', 'ig'), replace: '$black--10' }
  ]

  console.log('extraInputs.doColours():', extraInputs.doColours())
  console.log('typeof extraInputs.doColours():', typeof extraInputs.doColours())
  let output = input.replace(/(\s+-?[0-9]+px)+(?=\s+|;)/ig, fixMultiPix)
  // console.log('input:', input)
  // console.log('output:', output)

  if (extraInputs.doColours() === true) {
    for (let a = 0; a < colours.length; a += 1) {
      console.log('colours[' + a + '].find:', colours[a].find)
      console.log('colours[' + a + '].replace:', colours[a].replace)
      output = output.replace(colours[a].find, colours[a].replace)
    }
  }
  return output
}

doStuff.register({
  action: 'fixSassLintIssues',
  func: fixSassLintIssues,
  description: '',
  // docsULR: '',
  inputLabel: 'scss code to be modified',
  extraInputs: [{
    id: 'doColours',
    label: 'Convert colour HEX values to variables',
    options: [
      {
        label: 'convert',
        value: 'true'
      }
    ],
    type: 'checkbox'
  },
  {
    id: 'remValue',
    label: 'Pixel value of 1rem',
    default: 16,
    min: 8,
    max: 24,
    step: 1,
    type: 'number'
  }],
  ignore: false,
  name: 'Fix (some) ACU.Sitecore scss issues'
})

//  END: fixSassLintIssues
// ====================================================================

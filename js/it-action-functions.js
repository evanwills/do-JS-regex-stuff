/* jslint browser: true */
/* global doStuff multiRegexReplace */

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
  group: 'it',
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
  group: 'it',
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
  group: 'it',
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
  /**
   * Convert pixel values to REMs with accuracy of up to 2 decimal
   * places.
   *
   * @param {string} whole    Whole match
   * @param {string} preSpace Leading white space
   * @param {string} value    Numeric value to be converted
   *
   * @returns {string} rem unit version of initial value
   */
  const fixSinglePix = (whole, preSpace, value) => {
    let output = Math.round((value / extraInputs.remValue()) * 100) / 100
    output = output + ''
    output = output.replace(/^0+/, '')
    return preSpace + output + 'rem'
  }

  /**
   * Convert multiple pixel values to REMs for a given CSS property
   *
   * @param {string} whole Pixel values for CSS property
   *
   * @returns {string} Converted property value
   */
  const fixMultiPix = (whole) => {
    return whole.replace(/([\s:]+-?)([0-9]+)px/ig, fixSinglePix)
  }

  /**
   * rewrite text & border/background hex colours so ACU branding
   * colour variables are used instead
   *
   * @param {string} whole     Whole regular expression match
   * @param {string} wholeProp CSS property
   * @param {string} propMain  primary part of CSS property
   * @param {string} value     Value of CSS property
   *                           (may include border-style and/or
   *                           border-size)
   *
   * @returns {string} Updated CSS property key/value pair
   */
  const fixWhiteHex = (whole, wholeProp, propMain, value) => {
    const _wholeProp = wholeProp.toLowerCase()
    const _mainProp = propMain.toLowerCase()

    const cleanWhole = (input) => {
      let _output = input.trim()
      _output = _output.toLowerCase()
      _output = _output.replace(/\s+/g, ' ')
      return _output.replace(/\s+(?=:|;)/g, '')
    }

    const _colour = value.replace(/^.*?(#(?:(?:(?:f{3}){1,2})|(?:74){3})).*$/i, '$1')
    let _other = value.replace(_colour, '')

    if (_other === value) {
      // This is not a value we care about.
      // Hand it back unchanged
      console.log('value:', value)
      console.log('_colour:', _colour)
      console.log('_other:', _other)
      return cleanWhole(whole)
    }

    _other = _other.trim()
    if (_other !== '') {
      _other += ' '
    }

    const _isLight = (_colour === '#fff' || _colour === '#ffffff')

    console.log('whole:', '"' + whole + '"')
    console.log('_wholeProp:', '"' + _wholeProp + '"')
    console.log('_mainProp:', '"' + _mainProp + '"')
    console.log('_colour:', '"' + _colour + '"')
    console.log('_isLight:', '"' + _isLight + '"')

    let _colourVar = ''

    switch (_mainProp) {
      case 'color': // text colour
        _colourVar = (_isLight) ? 'text-colour-light' : 'text-colour'
        break
      case 'background':
        _colourVar = (_isLight) ? 'black--80' : 'body-bg'
        break
      case 'border':
        _colourVar = (_isLight) ? 'text-colour-light' : 'grey-border'
        break
      default:
        return cleanWhole(whole)
    }

    return _wholeProp.trim() + ': ' + _other + '$' + _colourVar
  }

  /**
   * @constant colour Brand colour hex values and variable names
   */
  const colours = [
    { find: '#ed0c00', replace: '$red--100' },
    { find: '#d00a00', replace: '$red--120' },
    { find: '#f15047', replace: '$red--80' },
    { find: '#f57c75', replace: '$red--60' },
    { find: '#f8a7a3', replace: '$red--40' },
    { find: '#fcd3d1', replace: '$red--20' },
    { find: '#3c1053', replace: '$purple--100' },
    { find: '#260b34', replace: '$purple--120' },
    { find: '#634075', replace: '$purple--80' },
    { find: '#8a7098', replace: '$purple--60' },
    { find: '#b19fba', replace: '$purple--40' },
    { find: '#d8cfdd', replace: '$purple--20' },
    { find: '#e03c31', replace: '$health-sciences' },
    { find: '#007932', replace: '$education-arts' },
    { find: '#bc333b', replace: '$law-business' },
    { find: '#702082', replace: '$theology-philosophy' },
    { find: '#B8A8C1', replace: '$testimonial-text' },
    // { find: '#ccc', replace: '$grey' }, // duplicate of $black--40
    // { find: '#747474', replace: '$text-colour' },
    // { find: '#747474', replace: '$grey-border' },
    { find: '#3d3935', replace: '$dark-brown' },
    { find: '#8c857b', replace: '$stone' },
    { find: '#e8e3db', replace: '$sand' },
    // { find: '#747474', replace: '$dark-grey' },
    { find: '#eeeeee', replace: '$light-grey' },
    { find: '#fafafa', replace: '$x-light-grey' },
    // { find: '#fff', replace: '$body-bg' },
    // { find: '#fff', replace: '$text-colour-light' },
    { find: '#3d3935', replace: '$charcoal--100' },
    { find: '#252320', replace: '$charcoal--120' },
    { find: '#000', replace: '$black' },
    // { find: '#747474', replace: '$black--80' },
    { find: '#ccc', replace: '$black--40' },
    { find: '#eee', replace: '$black--20' },
    { find: '#fafafa', replace: '$black--10' },
    { find: '((background|border|color)(?:-(?:bottom|left|right|top))?(?:-color)?)\\s*:\\s*([^;!]+?)\\s*(?=(?:!important)?\\s*;)', replace: fixWhiteHex }
  ]
  // ((background|border|color)(?:-(bottom|color|left|right|top))?(?:-(color))?)\\s*:((?:\\s*([0-9.]+(?:px|r?em)|solid|dotted|dashed|hidden|double|groove|ridge|inset|outset)){2})?\\s*(?:#((?:f{3}){1,2}|(?:74){3}))\\s*?(?=;|\\s*!important)

  /**
   * @constant {array} mainModifiers A list of find/replace objects
   *                                 "find" contains a string that is
   *                                 converted to a RegExp object
   */
  const mainModifiers = [
    { find: '([\\s:]+-?[0-9]+px)+(?=\\s+|;)', replace: fixMultiPix },
    { find: '0(?:px|r?em)', replace: '0' },
    { find: '0(\\.[0-9]+)', replace: '$1' },
    { find: '(border(?:-(?:top|right|bottom|left))?)\\s*:\\s*0\\s*(?=;)', replace: '$1: none' },
    {
      find: '(margin|padding)\\s*:\\s*([0-9.]+(?:r?em|px)?)(?:\\s+\\2){3}\\s*(?=;)',
      replace: '$1: $2'
    },
    {
      find: '(margin|padding)\\s*:\\s*([0-9.]+(?:r?em|px)?)\\s*([0-9.]+(?:r?em|px)?)\\s+\\2\\s+\\3\\s*(?=;)',
      replace: '$1: $2 $3'
    },
    {
      find: '(margin|padding)\\s*:\\s*([0-9.]+(?:r?em|px)?)\\s*([0-9.]+(?:r?em|px)?)\\s*([0-9.]+(?:r?em|px)?)\\s+\\3\\s*(?=;)',
      replace: '$1: $2 $3 $4'
    },
    { find: '\\s+(?=[\r\n])', replace: '' }, // remove trailing white space
    { find: '\\s*$', replace: '\n' } // ensure file ends with a new line
    // { find: '', replace: '' },
  ]

  let output = multiRegexReplace(input, mainModifiers)

  output = multiRegexReplace(output, colours)
  // if (extraInputs.doColours() === true) {
  // }
  return output
}

doStuff.register({
  action: 'fixSassLintIssues',
  func: fixSassLintIssues,
  description: '',
  // docsULR: '',
  inputLabel: 'scss code to be modified',
  extraInputs: [{
    id: 'remValue',
    label: 'Pixel value of 1rem',
    default: 16,
    min: 8,
    max: 24,
    step: 1,
    type: 'number'
  }],
  group: 'it',
  ignore: false,
  name: 'Fix (some) ACU.Sitecore scss issues'
})

//  END: fixSassLintIssues
// ====================================================================

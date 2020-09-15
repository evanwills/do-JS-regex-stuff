/* jslint browser: true */
/* global doStuff multiRegexReplace */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

const kssCommentStart = '/**\n * Component title\n *\n * Comment description goes here (may be multiple lines)\n *\n * Sample file path: [relative to \\ACU.Sitecore\\website\n *                    e.g. src\\Project\\ACUPublic\\ACU.Static\\components\\anchor_links.html]\n *\n *\n * Markup:\n '
const kssCommentEnd = '\n *\n * .modifiers - Description of Modifier\n *\n * StyleGuide: Molecule.Molecule name\n */\n// {{modifier_class}} - use this in place of a modifier class name in the sample "Markup" block\n'

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
  const remPixels = extraInputs.remValue()
  const _hasStyleGuide = new RegExp('styleguide:', 'i')

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
    const mediaPx = {
      320: '$mobile-width',
      480: '$screen-xs',
      510: '$content-width-xs',
      690: '$content-width-sm',
      768: '$screen-sm',
      930: '$content-width-md',
      992: '$screen-md',
      1140: '$content-width-lg',
      1200: '$screen-lg'
    }
    const key = (value * 1)
    let output = ''

    if (typeof mediaPx[key] === 'string') {
      output = mediaPx[key]
    } else {
      output = Math.round((value / remPixels) * 100) / 100
      output = output + ''
      output = output.replace(/^0+/, '')
      output += 'rem'
    }

    return preSpace + output
  }

  /**
   * Convert multiple pixel values to REMs for a given CSS property
   *
   * @param {string} whole Pixel values for CSS property
   *
   * @returns {string} Converted property value
   */
  const fixMultiPix = (whole) => {
    console.log(whole.replace(/([\s:]+-?)([0-9]+)px/ig, fixSinglePix))
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

    if (value.indexOf('#') === -1) {
      return cleanWhole(whole)
    }

    const _colour = value.replace(/^.*?(#(?:(?:(?:f{3}){1,2})|(?:74){3})).*$/i, '$1')
    let _other = value.replace(_colour, '')

    if (_other === value) {
      // This is not a value we care about.
      // Hand it back unchanged
      return cleanWhole(whole)
    }

    _other = _other.trim()
    if (_other !== '') {
      _other += ' '
    }

    const _isLight = (_colour === '#fff' || _colour === '#ffffff')

    let _colourVar = ''

    switch (_mainProp) {
      case 'color': // text colour
        _colourVar = (_isLight) ? 'text-colour-light' : 'text-colour'
        break
      case 'background':
        _colourVar = (_isLight) ? 'body-bg' : 'black--80'
        break
      case 'border':
        _colourVar = (_isLight) ? 'text-colour-light' : 'grey-border'
        break
      default:
        return cleanWhole(whole)
    }

    return _wholeProp.trim() + ': ' + _other + '$' + _colourVar
  }

  const fixFontFamily = (whole, prop, value) => {
    const fontVars = [
      {
        family: 'AvenirLTStd-Book',
        var: 'font--sans-serif'
      },
      {
        family: 'Miller Text Rom',
        var: 'font--serif'
      },
      {
        family: 'Nexa-Heavy',
        var: 'heading-font'
      },
      {
        family: 'Miller Text Bd',
        var: 'heading-2way-font'
      // },
      // {
      //   family: 'AvenirLTStd-Heavy',
      //   var: ''
      // },
      // {
      //   family: 'AvenirLTStd-Bold',
      //   var: ''
      // },
      // {
      //   family: 'Miller Text Bd',
      //   var: ''
      // },
      // {
      //   family: 'Nexa-Bold',
      //   var: ''
      }
    ]
    const lowerVal = value.toLowerCase()

    for (let a = 0; a < fontVars.length; a += 1) {
      if (lowerVal.indexOf(fontVars[a].family.toLowerCase()) >= 0) {
        return 'font-family: $' + fontVars[a].var + ';'
      }
    }

    return whole
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
    { find: '#(?:eee){1, 2}', replace: '$light-grey' },
    { find: '#(?:fa){3}', replace: '$x-light-grey' },
    // { find: '#fff', replace: '$body-bg' },
    // { find: '#fff', replace: '$text-colour-light' },
    { find: '#3d3935', replace: '$charcoal--100' },
    { find: '#252320', replace: '$charcoal--120' },
    { find: '#(?:000){1, 2}', replace: '$black' },
    // { find: '#747474', replace: '$black--80' },
    { find: '#(?:ccc){1, 2}', replace: '$black--40' },
    { find: '#(?:eee){1, 2}', replace: '$black--20' },
    { find: '#(?:fa){3}', replace: '$black--10' },
    { find: '((background|border|color)(?:-(?:bottom|left|right|top))?(?:-color)?)\\s*:\\s*([^;!]+?)\\s*(?=(?:!important)?\\s*;)', replace: fixWhiteHex },
    { find: '\\s*!important\\s*', replace: ' !important' }
  ]

  // ((background|border|color)(?:-(bottom|color|left|right|top))?(?:-(color))?)\\s*:((?:\\s*([0-9.]+(?:px|r?em)|solid|dotted|dashed|hidden|double|groove|ridge|inset|outset)){2})?\\s*(?:#((?:f{3}){1,2}|(?:74){3}))\\s*?(?=;|\\s*!important)

  /**
   * @constant {array} mainModifiers A list of find/replace objects
   *                                 "find" contains a string that is
   *                                 converted to a RegExp object
   */
  const mainModifiers = [
    { find: '([\\s:]+-?[0-9]+px)+(?=\\s+|;|\\))', replace: fixMultiPix },
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
    { find: 'font-family:\\s*([^;]+;)', replace: fixFontFamily },
    { find: '\\s+(?=[\r\n])', replace: '' }, // remove trailing white space
    { // Wrap URLs in single quotes
      find: '(url\\()[\'"]?([^)\'"]+)[\'"]?(?=\\))',
      replace: '$1\'$2\''
    },
    { // ensure file ends with a new line
      find: '\\s*$',
      replace: '\n'
    },
    { // add missing new lines caused by the find/replace pair above
      find: '([};])(?:[\\t ]*[\\r\\n]+)*([\\t ]*)(?=(?:[.#]|\\&|[a-z]+|\\[|@(?:media|supports|font-face|import|keyframes))[^,;{]*?\\s*[,{])',
      replace: '$1\n\n$2'
    },
    { // add missing new lines caused by the find/replace pair above
      find: '(\\})(?:[\\t ]*[\\r\\n]+)*([\\t ]*)(?=/\\*)',
      replace: '$1\n\n$2'
    }
    // { find: '', replace: '' },
    // { find: '', replace: '', flags: 'ig' },
  ]
  // console.log('mainModifiers:', mainModifiers)
  // console.log('colours:', colours)

  let output = multiRegexReplace(input, mainModifiers)

  output = multiRegexReplace(output, colours)

  if (extraInputs.addKSS('true')) {
    if (!_hasStyleGuide.test(output)) {
      output = kssCommentStart + '*' + kssCommentEnd + output
    }
  }
  // if (extraInputs.doColours() === true) {
  // }
  return output
}

doStuff.register({
  action: 'fixSassLintIssues',
  func: fixSassLintIssues,
  description: '',
  // docsULR: '',
  inputLabel: 'SCSS code to be modified',
  extraInputs: [{
    id: 'remValue',
    label: 'Pixel value of 1rem',
    default: 16,
    min: 8,
    max: 24,
    step: 1,
    type: 'number'
  },
  {
    id: 'addKSS',
    label: 'Add KSS comment block',
    type: 'checkbox',
    options: [{
      value: 'true',
      label: 'Yes! Add a KSS comment block at the top of the file',
      default: true
    }]
  }],
  group: 'it',
  ignore: false,
  name: 'Fix (some) ACU.Sitecore scss issues'
})

//  END: fixSassLintIssues
// ====================================================================
// START: KSS comment block

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-09-04
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
const kssCommentBlock = (input, extraInputs, GETvars) => {
  const doWhole = extraInputs.wholeComment('true')
  console.log('doWhole:', doWhole)

  if (input.trim() === '') {
    return kssCommentStart + '*' + kssCommentEnd
  } else {
    const findReplace = {
      html: {
        find: '(^|[\\r\\n])+(?=[\\t ]*<)',
        replace: '$1 *'
      }
    }

    if (doWhole) {
      findReplace.start = {
        find: '^\\s*(?=\\*)?',
        replace: kssCommentStart
      }
      findReplace.end = {
        find: '\\s*$',
        replace: kssCommentEnd
      }
    }

    console.log('findReplace:', findReplace)

    return multiRegexReplace(input, findReplace, 'ig')
  }
}

doStuff.register({
  action: 'kssCommentBlock',
  func: kssCommentBlock,
  description: 'Generate a KSS comment block (or make HTML code safe to use in a KSS comment block',
  // docsULR: '',
  extraInputs: [{
    id: 'wholeComment',
    label: 'Build whole KSS comment',
    type: 'checkbox',
    options: [
      { value: 'true', label: 'Yes! Build whole comment', default: true }
    ]
  }],
  // group: 'it',
  ignore: false,
  name: 'KSS comment block'
})

//  END: KSS comment block
// ====================================================================
// START: Sort components alphabetically

/**
 * Sort components alphabetically
 *
 * created by: Evan Wills
 * created: 2020-09-04
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
const sortComponentsAlpha = (input, extraInputs, GETvars) => {
  const allItems = new RegExp('(<ul[^>]*?class="component-list"[^>]*?>)\\s*(.*?)(?=</ul>)', 'igs')
  const singleItem = new RegExp('<li(?: class="([^"]+)")?>\\s*<a(?: (href|target)="([^"]+)")(?: (href|target)="([^"]+)")?>(.*?)</a>\\s*</li>', 'igs')
  const noHTML = new RegExp('<[^>]+>|[^a-z0-9\\-]+', 'igs')

  const sortableText = (input) => {
    const output = input.replace(noHTML, '')
    console.log('output:', output)
    console.log('output.toLowerCase():', output.toLowerCase())
    return output.toLowerCase()
  }

  const sortByText = (a, b) => {
    const foo = a.comp
    const bar = b.comp
    // console.group('sortByText')
    // console.log('a.text:', a.text)
    // console.log('foo:', foo)
    // console.log('b.text:', b.text)
    // console.log('bar:', bar)

    if (foo < bar) {
      // console.log('foo is less than bar:')
      // console.groupEnd()
      return -1
    }

    if (foo > bar) {
      // console.log('foo is greater than bar:')
      // console.groupEnd()
      return 1
    }

    // console.log('foo is the same as bar:')
    // console.groupEnd()
    return 0
  }

  const sortItems = (whole, openWrapp, allLis) => {
    const itemObjects = []
    const unsorted = [...allLis.matchAll(singleItem)]
    let output = ''
    console.group('sortItems')
    console.log(unsorted)

    for (const key in unsorted) {
      const tmp = {
        comp: sortableText(unsorted[key][6]),
        text: unsorted[key][6].replace('( ', '('),
        state: unsorted[key][1],
        url: (unsorted[key][2] === 'href') ? unsorted[key][3] : unsorted[key][5]
      }
      console.log('tmp:', tmp)
      itemObjects.push(tmp)
    }
    console.log('itemObjects:', itemObjects)

    // itemObjects.sort(sortByText)

    console.log('itemObjects.sort(sortByText):', itemObjects.sort(sortByText))

    for (const key in itemObjects) {
      // console.group('outputing list')
      // console.log('key:', key)
      // console.log('itemObjects[key]:', itemObjects[key])
      // console.log('itemObjects[key].state:', itemObjects[key].state)
      // console.log('itemObjects[key].url:', itemObjects[key].url)
      // console.log('itemObjects[key].text:', itemObjects[key].text)
      // console.log('itemObjects[key].comp:', itemObjects[key].text)
      output += '\n\t\t\t\t<li class="' + itemObjects[key].state + '">\n\t\t\t\t\t<a href="' + itemObjects[key].url + '" target="_blank">\n\t\t\t\t\t\t' + itemObjects[key].text.trim() + '\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n'
      // console.groupEnd()
    }
    console.groupEnd()
    return openWrapp + output + '\t\t\t'
  }

  return input.replace(allItems, sortItems)
}

doStuff.register({
  action: 'sortComponentsAlpha',
  func: sortComponentsAlpha,
  description: 'Sort list of components into alphabetical order',
  // docsULR: '',
  extraInputs: [],
  // group: 'it',
  ignore: false,
  name: 'Sort components alphabetically'
})

//  END: Sort components alphabetically
// ====================================================================

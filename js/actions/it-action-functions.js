/* jslint browser: true */
/* global doStuff multiRegexReplace */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

const kssComponentName = 'Component name'
const kssCommentStart = '/**\n * [[COMPONENT_NAME]]\n *\n * Comment description goes here (may be multiple lines)\n *\n * Sample file path: [[SAMPLE_PATH]]\n *\n *\n * Markup:\n '
const kssSamplePath = '[relative to \\ACU.Sitecore\\website\n *                    e.g. src\\Project\\ACUPublic\\ACU.Static\\components\\anchor_links.html]'
const kssCommentEnd = '\n *\n * .modifiers - Description of Modifier\n *\n * StyleGuide: Molecule.[[COMPONENT_NAME]]\n */\n// {{modifier_class}} - use this in place of a modifier class name in the sample "Markup" block\n'

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
// START: Make KSS comment

/**
 * Create a full KSS comment
 *
 * @param {string} componentName Name of component
 * @param {string} samplePath    Path to sample HTML file
 * @param {string} html          Component HTML
 *
 * @returns {string}
 */
const makeKssComment = (componentName, samplePath, html) => {
  const pathClean = [
    {
      find: '\\/',
      replace: '\\'
    },
    {
      find: '^.*?(?=\\ACU.Sitecore)',
      replace: ''
    }
  ]
  const _kssReplace = [
    {
      find: '\\[\\[COMPONENT_NAME\\]\\]',
      replace: (componentName === '') ? kssComponentName : componentName
    }, {
      find: '\\[\\[SAMPLE_PATH\\]\\]',
      replace: (samplePath === '') ? kssSamplePath : multiRegexReplace(samplePath, pathClean)
    }
  ]
  const _kssCommentStart = multiRegexReplace(kssCommentStart, _kssReplace)
  const _kssCommentEnd = multiRegexReplace(kssCommentEnd, _kssReplace)
  const tab2space = (whole, before, after) => {
    console.log('whole:', whole)
    console.log('before:', before)
    console.log('after:', after)
    return '\n *' + after.replace(/\t/g, '  ')
  }

  if (html === '') {
    return _kssCommentStart + '*' + _kssCommentEnd
  } else {
    const findReplace = {
      html: {
        find: '(^|[\\r\\n])+([\\t ]*<)',
        replace: tab2space
      },
      start: {
        find: '^\\s*(?=\\*)?',
        replace: _kssCommentStart
      },
      end: {
        find: '\\s*$',
        replace: _kssCommentEnd
      }
    }

    return multiRegexReplace(html, findReplace, 'ig')
  }
}

//  END:  KSS comment builder
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

  const alphabetiseProps = (_input) => {
    const propFinder = new RegExp(
      '([0-9a-z]+\\s*\\{)' +
      '((?:\\s*(?:\\/\\/\\s*)?' +
      '(?:-?[a-z]+(?:-[a-z]+)*\\s*:[^\\r\\n;]+;)' +
      '|' +
      '(?:\\s*\\/\\/[^\\r\\n]+(?=[\\r\\n]))+' +
      ')+)',
      'igs'
    )

    /**
     * Compare CSS properties so they can be sorted alphabetically
     *
     * @param {array} a First CSS property
     * @param {array} b Second CSS property
     *
     * @returns {number} -1 if A is less than B, +1 if B is less than A & 0 ir they are the same
     */
    const propCompare = (a, b) => {
      const l = a[2].length
      let i = 0

      for (i = 0; i < l; i += 1) {
        if (typeof b[2][i] === 'undefined') {
          // So far A & B props match exactly but
          // B prop is shorter than A prop so put it before A prop
          return 1
        }

        if (a[2][i] < b[2][i]) {
          return -1
        } else if (a[2][i] > b[2][i]) {
          return 1
        }
      }

      // So far A & B props match exactly but
      // If B is longer than A, put it after A,
      // Otherwise leave it where it is
      return (typeof b[2][i] !== 'undefined') ? -1 : 0
    }

    /**
     * Sort all the props for a style declaration alphabetically
     *
     * @param {string} whole    The whole string match by the parent
     *                          Regex
     * @param {string} selector The last part of the CSS selector
     *                          plus the style's opening curley
     *                          bracket
     * @param {string} props    All the props for the style
     */
    const sortProps = (whole, selector, props) => {
      /**
       * Regular expression to capture the individual CSS properties
       * within a style declaration.
       *
       * @var {RegExp} singleProp
       */
      const singleProp = new RegExp(
        '(?:\\s*\\/\\/[^:;\\r\\n]+(?=[\\r\\n]))*' +
        '(?:\\s*(?:\\/\\/\\s*)?(?:' +
        '(-(?:moz|webkit|ie|opera)-)?' +
        '([a-z]+(?:-[a-z]+)*)\\s*:' +
        '[^\\r\\n;]+;))',
        'igs'
      )
      let z = 0
      let output = selector

      let individualProps = singleProp[Symbol.matchAll](props)
      individualProps = Array.from(individualProps)
      individualProps = individualProps.sort(propCompare)

      for (z = 0; z < individualProps.length; z += 1) {
        output += individualProps[z][0]
      }

      return output
    }

    return input.replace(propFinder, sortProps)
  }

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
    // console.group('fixSinglePix()')
    // console.log('whole:', whole)
    // console.log('value:', value)
    // console.log('preSpace:', preSpace)

    if (typeof mediaPx[key] === 'string') {
      output = mediaPx[key]
    } else if (value == 0) {
      output = '0'
    } else {
      output = Math.round((value / remPixels) * 100) / 100
      output = output + ''
      output = output.replace(/^0+/, '')
      output += 'rem'
    }
    // console.log('output:', output)
    // console.groupEnd()
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
    // console.log(whole.replace(/([\s:]+-?)([0-9]+)px/ig, fixSinglePix))
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

    // console.groupCollapsed('fixWhiteHex()')

    if (value.indexOf('#') === -1) {
      // console.groupEnd()
      return cleanWhole(whole)
    }

    const _colour = value.replace(/^.*?(#[a-f0-9]{3,6})/i, '$1')
    let _other = value.replace(_colour, '')
    // console.log('whole:', whole)
    // console.log('wholeProp:', wholeProp)
    // console.log('propMain:', propMain)
    // console.log('value:', value)
    // console.log('_colour:', _colour)
    // console.log('_other:', _other)
    // console.log('(_other === value):', (_other === value))

    if (_other === value) {
      // console.groupEnd()
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
        // console.groupEnd()
        return cleanWhole(whole)
    }
    // console.groupEnd()
    return _wholeProp.trim() + ': ' + _other + '$' + _colourVar
  }

  const fixFontFamily = (whole, value) => {
    const fontVars = [
      {
        // 'AvenirLTStd-Book',
        family: 'avenirltstd-book',
        var: 'font--sans-serif'
      },
      {
        // 'Miller Text Rom',
        family: 'miller text rom',
        var: 'font--serif'
      },
      {
        // 'Nexa-Heavy',
        family: 'nexa-heavy',
        var: 'heading-font'
      },
      {
        // 'Miller Text Bd',
        family: 'miller text bd',
        var: 'heading-2way-font'
      },
      {
        // 'AvenirLTStd-Heavy',
        family: 'avenirltstd-heavy',
        var: 'font--sans-serif-heavy'
      },
      {
        // 'AvenirLTStd-medium',
        family: 'avenirltstd-medium',
        var: 'font--sans-serif-medium'
      // },
      // {
      //   // 'Miller Text Bd',
      //   family: 'miller text bd',
      //   var: ''
      // },
      // {
      //   // 'Nexa-Bold',
      //   family: 'nexa-bold',
      //   var: ''
      }
    ]

    if (typeof value === 'string') {
      const lowerVal = value.toLowerCase()

      for (let a = 0; a < fontVars.length; a += 1) {
        if (lowerVal.indexOf(fontVars[a].family) >= 0) {
          return 'font-family: $' + fontVars[a].var + ';'
        }
      }
    }

    return whole
  }

  /**
   * @constant colour Brand colour hex values and variable names
   */
  const colours = [
    { find: '#ed0c00', replace: '$red--100' },
    { find: ':\\s*red(?=[\\s;])', replace: ': $red--100' },
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
    {
      find: '([\\s:]+-?[0-9]+px)+(?=\\s+|;|\\))',
      replace: fixMultiPix
    },
    { find: '0(?:px|r?em)', replace: '0' },
    { find: '([^0-9])0(?=\\.[0-9]+)', replace: '$1' },
    {
      find: '(border(?:-(?:top|right|bottom|left))?)\\s*:\\s*0\\s*(?=;)',
      replace: '$1: none'
    },
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
    {
      find: 'font-family:\\s*([^;]+;)',
      replace: fixFontFamily
    },
    { // remove trailing white space
      find: '\\s+(?=[\r\n])',
      replace: ''
    },
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
    },
    {
      find: '([^:]//)(?=[^\\s])',
      replace: '$1 '
    }
    // { find: '', replace: '' },
    // { find: '', replace: '', flags: 'ig' },
  ]
  // console.log('mainModifiers:', mainModifiers)
  // console.log('colours:', colours)

  let output = alphabetiseProps(input)

  output = multiRegexReplace(output, mainModifiers)
  output = multiRegexReplace(output, colours)

  if (extraInputs.addKSS('true')) {
    if (!_hasStyleGuide.test(output)) {
      output = makeKssComment(
        extraInputs.componentName(),
        extraInputs.samplePath(),
        extraInputs.sampleHTML()
      ) + output
    }
  }
  // if (extraInputs.doColours() === true) {
  // }
  return output
}

doStuff.register({
  action: 'fixSassLintIssues',
  func: fixSassLintIssues,
  description: 'Fix common issues identified by sass-lint and use standard branding variables for colour and spacing.',
  // docsURL: '',
  inputLabel: 'SCSS code to be modified',
  extraInputs: [
    {
      id: 'remValue',
      label: 'Pixel value of 1rem',
      default: 16,
      description: 'The number of pixels set for the font size on the HTML (or body) element',
      min: 8,
      max: 24,
      step: 1,
      type: 'number'
    }, {
      id: 'addKSS',
      label: 'Add KSS comment block',
      type: 'checkbox',
      options: [{
        value: 'true',
        label: 'Yes! Add a KSS comment block at the top of the file',
        default: true
      }]
    }, {
      id: 'componentName',
      label: 'Component name',
      default: '',
      type: 'text'
    }, {
      id: 'samplePath',
      label: 'Path to sample HTML file',
      default: '',
      description: 'The file system path to an HTML file that shows how the component is used. (Path should either be absolute or relative to the repo base. It should always include "ACU.Sitecore")',
      type: 'text'
    }, {
      id: 'sampleHTML',
      label: 'Sample HTML for KSS comment',
      default: '',
      type: 'textarea',
      description: 'Sample HTML is embedded in the KSS comment and used by KSS to create an example of the componenet'
    }
  ],
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
  console.log("extraInputs.wholeComment('true'):", extraInputs.wholeComment('true'))

  if (extraInputs.wholeComment('true')) {
    return makeKssComment(
      extraInputs.componentName(),
      extraInputs.samplePath(),
      input
    )
  } else {
    return input.replace(/(^|[\r\n])+(?=[\t ]*<)/ig, '$1 *')
  }
}

doStuff.register({
  action: 'kssCommentBlock',
  func: kssCommentBlock,
  description: 'Generate a KSS comment block (or make HTML code safe to use in a KSS comment block',
  // docsURL: '',
  extraInputs: [{
    id: 'wholeComment',
    label: 'Build whole KSS comment',
    type: 'checkbox',
    options: [
      { value: 'true', label: 'Yes! Build whole comment', default: true }
    ]
  }, {
    id: 'componentName',
    label: 'Component name',
    default: '',
    type: 'text'
  }, {
    id: 'samplePath',
    label: 'Path to Sample HTML',
    default: '',
    type: 'text'
  }],
  group: 'it',
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
    return output.toLowerCase()
  }

  const sortByText = (a, b) => {
    const foo = a.comp
    const bar = b.comp

    if (foo < bar) {
      return -1
    }

    if (foo > bar) {
      return 1
    }

    return 0
  }

  const sortItems = (whole, openWrapp, allLis) => {
    const itemObjects = []
    const unsorted = [...allLis.matchAll(singleItem)]
    let output = ''

    for (const key in unsorted) {
      const tmp = {
        comp: sortableText(unsorted[key][6]),
        text: unsorted[key][6].replace('( ', '('),
        state: unsorted[key][1],
        url: (unsorted[key][2] === 'href') ? unsorted[key][3] : unsorted[key][5]
      }
      itemObjects.push(tmp)
    }

    itemObjects.sort(sortByText)

    for (const key in itemObjects) {
      output += '\n\t\t\t\t<li class="' + itemObjects[key].state + '">\n\t\t\t\t\t<a href="' + itemObjects[key].url + '" target="_blank">\n\t\t\t\t\t\t' + itemObjects[key].text.trim() + '\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n'
    }
    return openWrapp + output + '\t\t\t'
  }

  return input.replace(allItems, sortItems)
}

doStuff.register({
  action: 'sortComponentsAlpha',
  func: sortComponentsAlpha,
  description: 'Sort list of components into alphabetical order',
  // docsURL: '',
  extraInputs: [],
  // group: 'it',
  ignore: false,
  name: 'Sort components alphabetically'
})

//  END: Sort components alphabetically
// ====================================================================
// START: Remove duplicate characters from a list

/**
 * Sort components alphabetically
 *
 * created by: Evan Wills
 * created: 2020-09-18
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
const uniqueCharsOnly = (input, extraInputs, GETvars) => {
  const found = []
  const lost = {}
  const digits = []
  const requiredChars = extraInputs.requiredChars()
  const dataSet = requiredChars.split('')
  const maxDigits = 10
  let output = ''
  let sep0 = ' '
  let sep1 = ''

  // input = extraInputs.base()
  const src = input.split('')

  // console.log('dataSet:', dataSet)

  for (let a = 0; a < src.length; a += 1) {
    if (found.indexOf(src[a]) === -1 && dataSet.indexOf(src[a]) >= 0) {
      found.push(src[a])
      if (found.length === dataSet.length) {
        console.log('a', a)
        console.log('src.length', src.length)
        break
      }
    }
  }

  // console.log('found:', found)

  let b = 0
  for (let a = 0; a < found.length; a += 1) {
    if (typeof digits[b] === 'undefined') {
      digits[b] = [found[a]]
    } else {
      digits[b].push(found[a])
    }
    lost[found[a]] = b

    b += 1
    if (b >= maxDigits) {
      b = 0
    }
  }

  // console.log('digits:', digits)
  // console.log('lost:', lost)

  output = '$dictionary = array('
  for (let a = 0; a < digits.length; a += 1) {
    sep1 = ''
    console.log('digits[' + a + ']:', digits[a])
    console.log('digits[' + a + '].length:', digits[a].length)
    output += sep0 + '\n\tarray( '
    for (let b = 0; b < digits[a].length; b += 1) {
      output += sep1 + "'" + digits[a][b] + "'"
      sep1 = ', '
    }
    output += ' )'
    sep0 = ','
  }

  output += '\n);\n\n$chars = array('
  sep0 = ' '
  for (const key in lost) {
    output += sep0 + "'" + key + "' => '" + lost[key] + "'"
    sep0 = ', '
  }

  output += ');'

  return output
}

doStuff.register({
  action: 'uniqueCharsOnly',
  func: uniqueCharsOnly,
  description: 'Remove duplicate characters from a string',
  // docsURL: '',
  extraInputs: [{
    id: 'requiredChars',
    label: 'Required Characters',
    type: 'text',
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }, {
    id: 'base',
    label: 'default source',
    type: 'text',
    default: 'zgqXOnRN7i4Gqe2x4JNjaH4wDm35e9FWb2dmrkKEjYs6RaDh8RrBbgZecxWOWUirEYFydC0AzGFCOJ35GTbSPgDrdrwwfTSreH1HeiEmRNo1x27v4qAgOIkhc95AbeVVRJVfXuz4rLdAnpZMPYxe7Ugj8OQbgjedUJGJ2xAUF6ht2KLAy1meS9HMshRaukvakvoTLk7wvsyaqWX8zTJ7QmX67s1cPRkMQJqFdwT7c9YJDUq15NfHqy0Omgo0OnTr3oIE3ZxXB50Erm9lWTiWFNSiQqtcTXnsRBebJA4x0ccZiu2SslxQmF93CUY'
  }],
  // group: 'it',
  ignore: true,
  name: 'Unique characters only'
})

//  END: Sort components alphabetically
// ====================================================================
// START: Sitecore HTML to local HTML

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
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
const sitecore2local = (input, extraInputs, GETvars) => {
  const idClean = (_whole, _start, _id) => {
    return _start + _id.replace(/[^a-z0-9]+/ig, '-')
  }
  const getTitle = new RegExp('<title>([^<]+)</title>', 'igs')
  let titleBits
  let _title = ''

  if ((titleBits = getTitle.exec(input)) !== null) {
    _title = titleBits[1]
    _title = _title.trim()
    _title = _title.replace(/[^a-z0-9]+/ig, '-')
    _title = _title.toLowerCase()
    if (_title !== '') {
      input += '\n\n\n<!-- file-name: ' + _title + '.html -->'
    }
  }

  const regex = [
    {
      find: '/assets/acupublic/(?:custom)?(?=(?:css|js|fonts)/)',
      replace: '../../../../Foundation/ACUPublic/Theming/code/assets/ACUPublic/'
      // replace: '../'
    }, {
      find: '(<img src=")(?=/-/media/feature/)',
      replace: '$1https://' + extraInputs.domain() + '.acu.edu.au'
    // }, {
    //   find: '\\.\\.(?=\\/js\\/(?:cta-bar|sticky|side-accordion)\\.js)',
    //   replace: '../../../../Foundation/ACUPublic/Theming/code/assets/ACUPublic'
    }, {
      find: '\\s+target=""',
      replace: ''
    }, {
      find: '\\s+v-model="[^"]*"',
      replace: ''
    }, {
      find: '(\\s+id=")([^"]+)(?=")',
      replace: idClean
    }, {
      find: '\\s*<meta (?:name|property)="[^"]+"(?:\\s*/)?>',
      replace: ''
    }, {
      find: '(<meta http-equiv="X-UA-Compatible" content="IE=edge" />).*?(?=\\s*<meta name="viewport")',
      replace: '$1',
      flags: 'is'
    }, {
      find: ' type="text/javascript"',
      replace: ''
    }, {
      find: '<%--.*?--%>',
      replace: '',
      flags: 'igs'
    }, {
      find: '(<input type="hidden" id="hdnStickyEncodeValue" />.*?</button>.*?</label>\\s+)+',
      replace: '$1',
      flags: 'igs'
    }, {
      find: '<!--(GoogleAnalytics Section) Starts-->.*?<!--GoogleAnalytics Section Ends-->',
      replace: '',
      flags: 'igs'
    }, {
      find: '<linked-c.*?data-code=[\'"]([^\'"]+)[\'"] data-name=[\'"]([^\'"]+)[\'"].*?</linked-co>',
      replace: '<a href="/Handbook/Handbook-2021/Course/unit/$1" title="$2">$1</a>',
      flags: 'igs'
    }, {
      find: '/sitecore%20modules/Web/ExperienceForms/scripts/',
      replace: '../js/sitecore/'
    }, {
      find: '(href="#)course(?=overview")',
      replace: '$1'
    }, {
      find: '<script.*?src="[^"]+(?:bluebird|addevent)[^"]+".*?></script>',
      replace: ''
    }, {
      find: '(src=")[^"]+((?:acu-logo-white|acu_logo_purple|askacu).svg)[^"]*(?=")',
      replace: '$1../img/$2'
    }
  ]

  return multiRegexReplace(input, regex)
}

doStuff.register({
  action: 'sitecore2local',
  func: sitecore2local,
  description: 'Rewrite URLs to point to local version of CSS, font & JS files. Plus rewrite image URLs to point to server.',
  // docsURL: '',
  extraInputs: [{
    id: 'domain',
    label: 'Domain',
    type: 'select',
    options: [{
      value: 'uat',
      label: 'UAT'
    }, {
      value: 'auth.uat',
      label: 'Auth UAT'
    }, {
      value: 'qa',
      label: 'QA'
    }, {
      value: 'auth.qa',
      label: 'Auth QA'
    }, {
      value: 'www',
      label: 'WWW'
    }, {
      value: 'auth',
      label: 'Auth WWW'
    }]
  }],
  group: 'it',
  ignore: false,
  name: 'Sitecore HTML to local HTML'
})

//  END: Sitecore HTML to local HTML
// ====================================================================
// START: Transform RYI Suburb/Schools JSON

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
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
const transformSchoolsJSON = (input, extraInputs, GETvars) => {
  let json

  const sortByKey = (obj) => {
    const output = {}
    const keys = Object.keys(obj)
    keys.sort()
    for (let a = 0; a < keys.length; a += 1) {
      output[keys[a]] = obj[keys[a]]
    }

    return output
  }
  const noQuotes = (input) => {
    return JSON.stringify(input).replace(/"([^"]+)"(?=:)/ig, '$1').replace(/^(\[|\{)/, '$1\n  ').replace(/(\}|\])$/, '\n$1\n')
  }

  if (extraInputs.mode() === 'suburbs') {
    try {
      json = JSON.parse(input.replace(/(^|[\r\n])[\t ]*\/\/[^\r\n]+/ig , ''))
    } catch (e) {
      console.error('Schools JSON failed to parse.', e)
      return ''
    }
    return '\n\n/**' +
           '\n * A list of Australian suburbs hosting High Schools that offer' +
           '\n * ATAR programs.' +
           '\n *' +
           '\n * NOTE: This variable was generated using' +
           '\n *       https://test-webapps.acu.edu.au/mini-apps/do-JS-regex-stuff/?group=mer&action=transformschoolsjson' +
           '\n *       (following the instructions in the tool)' +
           '\n *' +
           '\n *       The tool converts the JSON into a Javascript variable' +
           '\n *       appropriate for use in this script' +
           '\n *' +
           '\n *       (Repo for the tool is at https://gitlab.acu.edu.au/evwills/do-JS-regex-stuff)\n *' +
           '\n * @var {array} RYIschoolSuburbs\n */\n' +
           'var RYIschoolSuburbs = ' +
           noQuotes(json.Suburbs)
  } else if (extraInputs.mode() === 'studyArea') {
    try {
      json = JSON.parse(input.replace(/^var Campuses = /, '').replace(/([a-z]+)(?=:)/ig, '"$1"'))
    } catch(e) {
      console.error('failed to parse study area object', e)
      return ''
    }

    for (campus in json) {
      for (level in json[campus]) {
        if (typeof json[campus][level] !== 'string') {
          json[campus][level] = sortByKey(json[campus][level])
        }
      }
    }

    console.log('json:', json)
    return 'var Campuses = ' + noQuotes(json)
  } else {
    console.error('No mode specified.')
    return ''
  }

}

doStuff.register({
  action: 'transformSchoolsJSON',
  func: transformSchoolsJSON,
  description: 'Transform RYI Suburb/Schools JSON string to JavaScript variable for use in WWW RYI from</p><p>For creating the JavaScript variable use in the public website RYI form</p><ol><li>Copy the whole JSON (supplied by marketing) into the text box below</li><li>click MODIFY INPUT (green button on the bottom left)</li><li>Copy the (modified) contents of the text box</li><li>Then replace the existing variable in the sitecore <code>ryi-script.js</code> file</li></ol><p>',
  // docsURL: '',
  extraInputs: [{
    id: 'mode',
    type: 'radio',
    label: 'What to transform',
    options: [{
      value: 'suburbs',
      label: 'Convert Suburbs JSON to variable'
    }, {
      value: 'studyArea',
      label: 'Alphabetise study areas',
      default: true
    }]
  }],
  group: 'mer',
  ignore: false,
  name: 'Transform RYI Suburb/Schools JSON'
})

//  END:  Transform RYI Suburb/Schools JSON
// ====================================================================

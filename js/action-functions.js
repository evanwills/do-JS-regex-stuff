/* jslint browser: true */
/* global doStuff, makeHumanReadableAttr */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

/**
 * action-functions.js contains all the possible actions available to
 * "Do JS regex stuff"
 *
 * Each action has two parts:
 * 1. A function declaration which is the business part. This function
 *    gets called when the user clicks "Modify input"
 * 2. Passing a "Registration" object to doStuff.register() which
 *    provides all the configuration "Do JS regex stuff" needs to
 *    make the action work.
 *
 * __NOTE:__ If you are have created an action and want to keep it but
 * don't need it at the moment, add the property 'ignore' with a value
 * of TRUE to remove it from the list of actions.
 */

// ====================================================================
// START: Sample code

/**
 * exposeChickens() finds all the vowels in a string and converts them
 * to what a chicken might say if it could speak English.
 *
 * created by: Evan Wills
 * created: 2019-03-22
 *
 * @param {string} input user supplied content
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function exposeChickens (input, extraInputs, GETvars) {
  var _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
  var _angry = extraInputs.mood('angry')
  var _boc = 'BOC! BOC!!'
  var _chicken = 'chicken'
  var _excited = extraInputs.mood('excited')
  // We retrieve the value of _gender by calling the function that
  // matches the ID (or name) of the input field
  var _gender = extraInputs.gender()
  var output = ''
  var _spring = ''
  // We do the same for _year
  var _year = extraInputs.year()

  // Test the gender of the chicken
  if (_gender === 'male') {
    _chicken = 'rooster'
    _boc = 'COCK-A-DOODLE-DO'
  } else if (_gender === 'female') {
    _chicken = 'hen'
  } else if (_gender === 'other') {
    _chicken += ' first don\'t try to pigeon hole me'
  }

  // Test the Year (as defined by the user)
  if (_year >= 2018) {
    _spring = ' spring'
  } else if (_year < 2016) {
    _spring = 'n old'
    _chicken += '. Please don\'t boil me and make me into soup.'
  }

  if (_excited === true) {
    _boc += ' BOC-OCK!!! '
    output = ' [[' + _boc + _unsure + ' ' + _boc + _boc + 'I am a ' + _boc + _boc + _boc + _spring + ' ' + _boc + _boc + _boc + _boc + _chicken + ' ' + _boc + _boc + _boc + _boc + _boc + '!!]] '
  } else {
    output = ' [[' + _boc + '!!' + _unsure + ' I am a' + _spring + ' ' + _chicken + ']] '
  }

  if (_angry === true) {
    output = output.toUpperCase()
  }

  if (typeof GETvars.backwards === 'boolean' && GETvars.backwards === true) {
    output = output.split('').reverse().join('')
  }

  // Do the replacement and return the updated string
  return input.replace(/[aeiou]+/ig, output)
}

doStuff.register({
  action: 'doChicken',
  description: 'Change all vowels into chickens',
  // docURL: 'docs/expose-chickens.html',
  docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/expose-chickens',
  extraInputs: [
    {
      id: 'year',
      label: 'Year chicken was hatched',
      type: 'number',
      min: 2013,
      max: 2019,
      step: 1,
      default: 2019
    },
    {
      id: 'gender',
      label: 'Gender of chicken',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male (rooster)' },
        { value: 'female', label: 'Female (hen)', default: true },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'mood',
      label: 'Mood of the chicken',
      type: 'checkbox',
      options: [
        { value: 'unsure', label: 'Chicken is confused about its identity' },
        { value: 'angry', label: 'Chicken woke up on the wrong side of its purch', default: true },
        { value: 'excited', label: 'Chicken is super excited', default: true }
      ]
    }
  ],
  func: exposeChickens,
  ignore: true,
  name: 'Expose the chickens'
})

//  END:  Sample code
// ====================================================================
// START: heading to accordion

function makeAccordion (input, extraInputs, GETvars) {
  var heading = extraInputs.heading()
  var multi = extraInputs.multiCollpase('multi')
  var parent = extraInputs.parent()
  // var content = ''
  // var tmp = ''
  var regexDLwrapper = new RegExp('<dl[^>]*>\\s*([\\s\\S]*?)\\s*</dl>', 'ig')
  var regexHead = new RegExp('\\s*<h' + heading + '[^>]*>\\s*([\\s\\S]*?)\\s*</h' + heading + '>\\s*([\\s\\S]*?)\\s*(?=<h' + heading + '[^>]*>|$)', 'ig')
  var regexDL = new RegExp('\\s*<dt[^>]*>\\s*([\\s\\S]*?)\\s*</dt>\\s*<dd[^>]*>([\\s\\S]*?)\\s*</dd>', 'ig')
  var expand = true
  // var clean = new RegExp('(?:<div[^>]*>\\s*){2}<h2[^>]*>\\s*<a[^>]*>\\s*([\\s\\S]*?)\\s*<span[^>]*>[\\s\\S]*?</div>\\s*<div class="panel-body">\\s*([\\s\\S]*?)(?:\\s*</div>){3}', 'ig')
  var expandMode = extraInputs.expandMode()
  var defaultExpand = false

  if (expandMode === 'closeAll') {
    expand = false
    defaultExpand = false
  } else if (expandMode === 'openAll') {
    expand = true
    defaultExpand = true
  }

  /**
   * getExpanded() returns an object with the expanded attributes and
   * for both open button and panel body.
   *
   * @returns {object}
   */
  function getExpanded () {
    var __output = {
      expanded: '',
      in: ''
    }

    if (expand === true) {
      __output.expanded = ' aria-expanded="true"'
      __output.in = ' in'
      expand = defaultExpand
    }
    return __output
  }

  /**
   * wrapAccordion() wraps all the accordion items in the accordion
   * wrapper (with apporpriate attributes set)
   *
   * @param {string} input whole accordion block to be wrapped in HTML for a accordion (panel) group
   *
   * @returns {string} Full bootstrap compliant accordion
   */
  function wrapAccordion (input) {
    var __output = ''
    var _multi = (multi) ? ' aria-multiselectable="true"' : ''

    __output = '\n<div class="panel-group" id="' + parent + '" role="tablist"' + _multi + '>\n'
    __output += input
    __output += '</div>'

    return __output
  }

  /**
   * makeAccordFunc() returns a string of HTML code with appropriate
   * markup for bootstrap accordion blocks
   *
   * NOTE: this doesn't include makup for the 'panel-group' wrapper.
   *       the 'panel-group' wrapper must be applied after all the
   *       accordion blocks are generated.
   *
   * @param {string} match All the characters matched by the regular expression
   * @param {string} headingTxt Heading text for the accordion block
   * @param {string} accodionBody Body of the accordion block
   * @param {number} offset number where abouts in the whole string the match started
   * @param {string} whole the original string the match was found in
   *
   * @returns {string} marked up accordion block
   */
  function makeAccordFunc (match, headingTxt, accordionBody, offset, whole) {
    var __output = ''
    var _id = makeHumanReadableAttr(headingTxt)
    var _expanded = getExpanded()

    __output += '\t<div class="panel panel-default">\n'
    __output += '\t\t<div class="panel-heading" role="tab" id="head-' + _id + '">\t\n'
    __output += '\t\t\t<h' + heading + ' class="panel-title">\n'
    __output += '\t\t\t\t<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + _id + '" ' + _expanded.expanded + ' aria-controls="' + _id + '">\n'
    __output += '\t\t\t\t\t' + headingTxt + '\n'
    __output += '\t\t\t\t</a>\n'
    __output += '\t\t\t</h4>\n'
    __output += '\t\t</div>\n'
    __output += '\t\t<div id="' + _id + '" class="panel-collapse collapse ' + _expanded.in + '" role="tabpanel" aria-labelledby="head-' + _id + '">\n'
    __output += '\t\t\t<div class="panel-body">\n'
    __output += accordionBody
    __output += '\n\t\t\t</div>\n'
    __output += '\t\t</div>\n'
    __output += '\t</div>\n'

    return __output
  }

  /**
   * headingFunc() finds all the headings at a specific level and
   * wrap them and their following content in a bootstrap accordion
   * block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  function headingFunc (_input) {
    return wrapAccordion(_input.replace(regexHead, makeAccordFunc))
  }

  /**
   * dlFunc() finds all the "definition titles" and
   * "definition descriptions" a definiton list and wrap them in a
   * bootstrap accordion block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  function dlFunc (_input) {
    var __output = _input.replace(regexDLwrapper, '$1')
    return wrapAccordion(__output.replace(regexDL, makeAccordFunc))
  }

  switch (extraInputs.mode()) {
    case 'headings':
      console.log('regexHead', regexHead)
      console.log('regexHead.test(input)', regexHead.test(input))
      return headingFunc(input)
      // return ''
      // break

    case 'dl':
      return dlFunc(input)
      // break

    case 'clean':
      return ''
      // break
  }
}

doStuff.register({
  action: 'heading2accordion',
  description: 'Convert content to an accordion using specific headings as the separator for the accordion',
  // docsULR: '',
  extraInputs: [
    {
      id: 'mode',
      label: 'Convert mode',
      options: [
        {
          value: 'headings',
          label: 'Use headings as block delimiters',
          default: true
        },
        {
          value: 'dl',
          label: 'Use definition list <DT>/<DD> as block delimiters'
        // },
        // {
        //   // not yet implemented
        //   value: 'clean',
        //   label: 'Make ID\'s (and anchors) based on headings'
        }
      ],
      type: 'radio'
    },
    {
      description: 'If "Convert mode" is "Use headings as block delimiters" content is matched based on the level of the heading specified here and also the heading level within the output HTML. If "Convert mode" is "Use definition list <DT>/<DD> as block delimiters" then this is only used to define the heading level within the output HTML.',
      id: 'heading',
      label: 'Heading level',
      options: [
        { value: 1, label: 'h1' },
        { value: 2, label: 'H2', default: true },
        { value: 3, label: 'H3' },
        { value: 4, label: 'H4' }
      ],
      type: 'select'
    },
    {
      default: 'accordion',
      id: 'parent',
      label: 'ID for accordion wrapper',
      pattern: '^[a-zA-Z_][a-zA-Z0-9_\\-]+$',
      type: 'text'
    },
    {
      id: 'multiCollpase',
      label: 'Multi Collapse',
      options: [
        {
          default: true,
          label: 'Allow multiple accordion blocks open at the same time.',
          value: 'multi'
        }
      ],
      type: 'checkbox'
    },
    {
      id: 'expandMode',
      label: 'Expand mode',
      options: [
        {
          default: true,
          label: 'No blocks open by default',
          value: 'closeAll'
        },
        {
          label: 'Open first block only',
          value: 'openFirst'
        },
        {
          label: 'Open ALL blocks by default',
          value: 'openAll'
        }
      ],
      type: 'radio'
    }
  ],
  func: makeAccordion,
  // ignore: true,
  name: 'Convert content to Bootstrap accordion blocks'
})

//  END:  heading to accordion
// ====================================================================
// START: Syntax highlighting for JS

function jsSyntaxHighlight (input, extraInputs, GETvars) {
  var find = [
    '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*\\()', // 0 function name
    '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*[,:=+)])', // 1 variable name
    '(^|\\s)(function|var|return|if|else)(?=\\s)', // 2 token
    '(\\s)(?:<em>)?//(.*?)(?:</em>)?(?=[\r\n])', // 3 comment
    '([0-9]+)', // 4 number
    '(true|false)', // 5 boolean
    '(\\s|\\()(\'[^\']*\')(?=\\s|\\)|,)', // 6 string
    '([\\[\\]{}()]+)', // 7 brackets
    '<span class="vName">(<span class="(?:num|bool|str)">.*?</span>|class)</span>' // 8 fix
  ]
  var replace = [
    '<span class="fName">$1</span>', // 0
    '<span class="vName">$1</span>', // 1
    '$1<span class="tkn">$2</span>', // 2
    '$1<span class="comm">//<span class="commTxt">$2</span></span>', // 3
    '<span class="num">$1</span>', // 4
    '<span class="bool">$1</span>', // 5
    '$1<span class="str">$2</span>', // 6
    '<span class="bkt">$1</span>', // 7
    '$1'
  ]
  var output = input
  var tmp = null
  var a = 0

  for (a = 0; a < find.length; a += 1) {
    tmp = new RegExp(find[a], 'ig')
    output = output.replace(tmp, replace[a])
  }
  return output
}

doStuff.register({
  action: 'jsSyntaxHighlight',
  func: jsSyntaxHighlight,
  ignore: false,
  name: 'Syntax highlighting for JS'
})

//  END:  Syntax highlighting for JS
// ====================================================================
// START: Fix heading levels when Migrating HTML from one system to another

/**
 * incrementH() finds all the headings in HTML code and increments or
 * decrements the level based on the option set in
 *  "Decrement/Increment heading importance"
 *
 * created by: Evan Wills
 * created: 2019-08-22
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
function incrementH (input, extraInputs, GETvars) {
  var find = new RegExp('<(/?)h([1-6])', 'ig')
  var mode = Number.parseInt(extraInputs.mode())
  var replace = function (matches, close, level) {
    var h = '<'
    var newLevel = (Number.parseInt(level) + mode)

    // HTML only accepts headings between 1 & 6 (inclusive)
    // make sure the output level is between 1 & 6
    newLevel = (newLevel > 6) ? '6' : (newLevel < 1) ? 1 : newLevel
    h += (typeof (close) !== 'string' || close !== '/') ? '' : '/'
    h += 'h' + newLevel
    return h
  }
  return input.replace(find, replace)
}

doStuff.register({
  action: 'incrementH',
  func: incrementH,
  ignore: false,
  name: 'Decrement or Increment HTML heading',
  description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
  extraInputs: [
    {
      id: 'mode',
      label: 'Decrement/Increment heading importance',
      options: [
        {
          value: '1',
          label: 'Reduce heading\'s importance',
          default: true
        },
        {
          value: '-1',
          label: 'Increase heading\'s importance'
        }
      ],
      type: 'radio'
    }
  ]
})

//  END:  Syntax highlighting for JS
// ==================================================================
// START: Match unfinished payment IDs to confirmed payments.

/**
 * matchPaymentIDs() tries to match payment IDs from unfinished
 * payments in form build with payment IDs supplied by Finance
 *
 * created by: Evan Wills
 * created: 2019-08-28
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
function matchPaymentIDs (input, extraInputs, GETvars) {
  var paymentIDs = []
  var regex = new RegExp('^.*?_([0-9]+)\\s*$')

  /**
   * splitPaymentID() takes a list of payment IDs as provided by
   * Finance and extracts the payment ID as listed in Form Build
   *
   * @param {string} str list of Finance payment IDs
   * @returns {array} list of payment IDs as seen in Form Build
   */
  function splitPaymentID (str) {
    var tmp = str.trim()
    tmp = tmp.replace(regex, '$1')
    return (isNaN(tmp)) ? '' : tmp
  }

  /**
   * splitNclean() splits a given string on new line characters
   *
   * @param {string} input string to be split
   * @returns {array} the input split by new line
   *          (each line has leading and trailing white space stripped)
   */
  function splitNclean (input) {
    var splitStr = input.split('\n')
    return splitStr.map(splitPaymentID).filter(str => str !== '')
  }

  /**
   * grep() builds a regular expression to find any lines starting
   * with the input string in the main input then returns the whole
   * line that string (or an empty string if nothing was matched)
   *
   * @param {string} str
   * @return {string}
   */
  function grep (str) {
    var findID = new RegExp('(?:^|[\r\n])(' + str + '\\s+[^\r\n]+)(?=[\r\n]|$)')
    var found = input.match(findID)
    return (found !== null) ? found[1] : ''
  }

  /**
   * implode() takes the contents of an array and implodes it with a
   * new line separator
   *
   * @param {string} accum accumulated value of the array
   * @param {string} str current item to be appended to the output
   * @returns {string}
   */
  function implode (accum, str) {
    var sep = (accum !== '') ? '\r\n' : ''
    return (str !== '') ? accum + sep + str : accum
  }

  paymentIDs = splitNclean(extraInputs.paymentIDs())

  return paymentIDs.map(grep).filter(str => str !== '').reduce(implode, '')
}

doStuff.register({
  action: 'matchPaymentIDs',
  func: matchPaymentIDs,
  ignore: false,
  name: 'Match unfinished payment IDs to confirmed payments.',
  // docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/match_unfinished_payment_ids_to_confirmed_payments.',
  docURL: 'docs/match-unfinished-payment.html',
  inputLabel: 'Copied "Unfinished" payments listing',
  extraInputs: [
    {
      id: 'paymentIDs',
      label: 'Transaction Reference IDs (from finance)',
      type: 'textarea'
    }
  ]
})

//  END:  Match unfinished payment IDs to confirmed payments.
// ==================================================================
// START: URL decode/encode

/**
 * urlDecodeEncode() does a better job of URL encoding/decoding
 * special characters than built in JS function
 *
 * created by: Evan Wills
 * created: 2019-08-28
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
function urlDecodeEncode (input, extraInputs, GETvars) {
  var a = 0
  var find = 0
  var output = input
  var replace = 1
  var findReplace = [
    ['%25', '%', '%'], ['%09', '\t', '\\\t'], ['%0A', '\r', '\\\r'], ['%0D', '\n', '\\\n'],
    ['%20', ' ', ' '], ['%21', '!', '!'], ['%22', '"', '"'], ['%23', '#', '#'],
    ['%24', '$', '\\$'], ['%26', '&', '\\&'], ['%27', '\'', '\\\''], ['%28', '(', '\\('],
    ['%29', ')', '\\)'], ['%2A', '*', '\\*'], ['%2B', '+', '\\+'], ['%2C', ',', ','],
    ['%2D', '-', '-'], ['%2E', '.', '\\.'], ['%2F', '/', '\\/'],
    ['%3A', ':', ':'], ['%3B', ';', ';'], ['%3C', '<', '<'], ['%3D', '=', '='],
    ['%3E', '>', '>'], ['%3F', '?', '\\?'], ['%40', '@', '@'],
    ['%5B', '[', '\\['], ['%5C', '\\', '\\\\'], ['%5D', ']', '\\]'], ['%5E', '^', '\\^'],
    ['%60', '`', '`'],
    ['%7B', '{', '\\{'], ['%7C', '|', '\\|'], ['%7D', '}', '\\}'], ['%7E', '~', '~'],
    ['%A2', '¢', '¢'], ['%A3', '£', '£'], ['%A5', '¥', '¥'], ['%A6', '|', '\\|'],
    ['%A7', '§', '§'], ['%AB', '«', '«'], ['%AC', '¬', '¬'], ['%AD', '¯', '¯'],
    ['%B0', 'º', 'º'], ['%B1', '±', '±'], ['%B2', 'ª', 'ª'], ['%B4', ',', ','],
    ['%B5', 'µ', 'µ'], ['%BB', '»', '»'], ['%BC', '¼', '¼'], ['%BD', '½', '½'],
    ['%BF', '¿', '¿'],
    ['%C0', 'À', 'À'], ['%C1', 'Á', 'Á'], ['%C2', 'Â', 'Â'], ['%C3', 'Ã', 'Ã'],
    ['%C4', 'Ä', 'Ä'], ['%C5', 'Å', 'Å'], ['%C6', 'Æ', 'Æ'], ['%C7', 'Ç', 'Ç'],
    ['%C8', 'È', 'È'], ['%C9', 'É', 'É'], ['%CA', 'Ê', 'Ê'], ['%CB', 'Ë', 'Ë'],
    ['%CC', 'Ì', 'Ì'], ['%CD', 'Í', 'Í'], ['%CE', 'Î', 'Î'], ['%CF', 'Ï', 'Ï'],
    ['%D0', 'Ð', 'Ð'], ['%D1', 'Ñ', 'Ñ'], ['%D2', 'Ò', 'Ò'],
    ['%D3', 'Ó', 'Ó'], ['%D4', 'Ô', 'Ô'], ['%D5', 'Õ', 'Õ'], ['%D6', 'Ö', 'Ö'],
    ['%D8', 'Ø', 'Ø'],
    ['%D9', 'Ù', 'Ù'], ['%DA', 'Ú', 'Ú'], ['%DB', 'Û', 'Û'], ['%DC', 'Ü', 'Ü'],
    ['%DD', 'Ý', 'Ý'], ['%DE', 'Þ', 'Þ'], ['%DF', 'ß', 'ß'],
    ['%E0', 'à', 'à'], ['%E1', 'á', 'á'], ['%E2', 'â', 'â'], ['%E3', 'ã', 'ã'],
    ['%E4', 'ä', 'ä'], ['%E5', 'å', 'å'], ['%E6', 'æ', 'æ'], ['%E7', 'ç', 'ç'],
    ['%E8', 'è', 'è'], ['%E9', 'é', 'é'], ['%EA', 'ê', 'ê'], ['%EB', 'ë', 'ë'],
    ['%EC', 'ì', 'ì'], ['%ED', 'í', 'í'], ['%EE', 'î', 'î'], ['%EF', 'ï', 'ï'],
    ['%F0', 'ð', 'ð'], ['%F1', 'ñ', 'ñ'], ['%F2', 'ò', 'ò'], ['%F3', 'ó', 'ó'],
    ['%F4', 'ô', 'ô'], ['%F5', 'õ', 'õ'], ['%F6', 'ö', 'ö'],
    ['%F7', '÷', '÷'], ['%F8', 'ø', 'ø'],
    ['%F9', 'ù', 'ù'], ['%FA', 'ú', 'ú'], ['%FB', 'û', 'û'], ['%FC', 'ü', 'ü'],
    ['%FD', 'ý', 'ý'], ['%FE', 'þ', 'þ'], ['%FF', 'ÿ', 'ÿ']
  ]
  if (extraInputs.mode() === 'encode') {
    find = 2
    replace = 0
  }
  for (a = 0; a < findReplace.length; a += 1) {
    output = output.replace(new RegExp(findReplace[a][find], 'g'), findReplace[a][replace])
  }
  return output
}

doStuff.register({
  action: 'urlDecodeEncode',
  description: 'Add or remove URI encoding from a URL',
  func: urlDecodeEncode,
  ignore: false,
  name: 'URI decode (or encode)',
  // docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/match_unfinished_payment_ids_to_confirmed_payments.',
  // docURL: 'docs/match-unfinished-payment.html',
  inputLabel: 'action',
  extraInputs: [
    {
      id: 'mode',
      label: 'Mode',
      type: 'radio',
      options: [
        {
          value: 'decode',
          label: 'Decode',
          default: true
        },
        {
          value: 'encode',
          label: 'Encode'
        }
      ]
    }
  ]
})

//  END:  Match unfinished payment IDs to confirmed payments.
// ====================================================================
// START: SVG ACU Logo cleanup
/**
 * acuLogoClean() remove all unnecessary junk from the ACU logo
 *
 * created by: Evan Wills
 * created: 2019-09-23
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
function acuLogoClean (input, extraInputs, GETvars) {
  var a = 0
  var output = input
  var regexes = [
    [
      new RegExp('<g id="_Group_"[^>]+>', 'i'),
      '<g class="logo-txt">'
    ],
    [
      new RegExp(' class="cls-2"', 'i'),
      '---baahh---'
    ],
    [
      new RegExp(' class="cls-2"', 'ig'),
      ''
    ],
    [
      new RegExp('---baahh---', 'i'),
      ' class="cls-2"'
    ],
    [
      new RegExp(' (?:id|data-name)="[^"]+"', 'ig'),
      ''
    ],
    [
      new RegExp('</?g>', 'ig'),
      ''
    ],
    [
      new RegExp('\\s+', 'g'),
      ' '
    ],
    [
      new RegExp('(?: (?=[<,{}@/.])|([>,{};/.]) )', 'g'),
      '$1'
    ],
    [
      ' id="acu-logo"',
      ''
    ],
    [
      '</svg>',
      '</g></svg>'
    ],
    [
      'Artboard 1',
      'Australian Catholic University (ACU)'
    ],
    [
      new RegExp('(<style xmlns="http://www.w3.org/2000/svg">).*?(?=</style>)', 'i'),
      '$1.cls-1{fill:#ed0c00;}.cls-2,.logo-txt{fill:#fff;}@media print{.logo-txt,.cls-1{fill:#3c1053;}}'
    ],
    [
      new RegExp('<g class="logo-txt">', 'ig'),
      '---blah---'
    ],
    [
      new RegExp('---blah---'),
      '<g class="logo-txt">'
    ],
    [
      new RegExp('---blah---'),
      ''
    ]
  ]

  for (a = 0; a < regexes.length; a += 1) {
    console.log('regexes[' + a + '][0]:', regexes[a][0], typeof regexes[a][0])
    console.log('regexes[' + a + '][1]:', '"' + regexes[a][1] + '"', typeof regexes[a][1])
    output = output.replace(regexes[a][0], regexes[a][1])
  }
  return output
}

doStuff.register({
  action: 'acuLogoClean',
  func: acuLogoClean,
  ignore: false,
  name: 'Minify ACU Logo SVG'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

//  END:  Syntax highlighting for JS
// ====================================================================
// START: Staff Access Card URL

function staffAccessCard (input, extraInputs, GETvars) {
  var baseURL = 'https://forms.acu.edu.au/public/staff_access_card'
  var altURL = 'https://forms.acu.edu.au/public/staff_access_card_validation_test'
  var raw = window.btoa('?email=' + extraInputs.email() + '&gender=' + extraInputs.gender())
  var a = 0
  var data = ''

  for (a = (raw.length - 1); a >= 0; a -= 1) {
    data += raw[a]
  }

  return baseURL + '?data=' + window.btoa(data) + '\n\n\n' + altURL + '?data=' + window.btoa(data)
}

doStuff.register({
  action: 'staffAccessCard',
  func: staffAccessCard,
  description: 'Generate a staff access card URL with email and gender bound in',
  // docsULR: '',
  extraInputs: [
    {
      id: 'email',
      label: 'Email address',
      type: 'email'
    },
    {
      id: 'gender',
      label: 'Gender',
      options: [
        {
          label: 'Male',
          value: 'm'
        },
        {
          label: 'Female',
          value: 'f'
        }
      ],
      type: 'radio'
    }
  ],
  ignore: true,
  name: 'Staff Access Card URL'
})

//  END:  Staff Access Card URL
// ====================================================================
// START: Fix CEG unit modal URLs

/**
 * fixCEGunitURLs() Fix CEG unit modal URLs
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
function fixCEGunitURLs (input, extraInputs, GETvars) {
  var output = input
  var regex = [
    {
      find: new RegExp('https://(?:enrolment-guides|handbook)\\.acu\\.edu\\.au/(?:handbooks/handbook_)?[0-9]{4}/unit_display(?=\\?unit=)', 'ig'),
      replace: './?a=2318995'
    },
    {
      find: RegExp('(\\&nbsp;)', 'ig'),
      replace: ' '
    },
    {
      find: RegExp('\\&amp;(?=SQ_DESIGN_NAME=modal)', 'ig'),
      replace: '&'
    }
  ]

  for (var a = 0; a < regex.length; a += 1) {
    output = output.replace(regex[a].find, regex[a].replace)
  }

  return output
}

doStuff.register({
  action: 'fixCEGunitURLs',
  func: fixCEGunitURLs,
  description: 'Fix CEG unit modal URLs',
  // docsULR: '',
  extraInputs: [],
  ignore: false,
  name: 'Fix CEG unit URLs'
})

//  END:  Fix CEG unit modal URLs
// ====================================================================
// START: fixPoliciesAnchorLinks

/**
 * Make sure invalid anchors and ToC are converted to valid links and
 * anchors
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
function fixPoliciesAnchorLinksV1 (input, extraInputs, GETvars) {
  let output = input
  let labelsAndIDs = []

  const anchorIDs = new RegExp('<h([1-5])(?: id="([^"]+)")>((?:[0-9]+\\.?)+\\s*)(.*?)\\s*(?=</h\\1>)', 'ig')
  const anchorLinks = new RegExp('<a(?:\\s+(title|href)="(#?)([^"]+)")(?:\\s+(title|href)="(#?)([^"]+)")?>([^<]+)(?=</a>)', 'ig')

  /**
   * Make a sure string only contains alpha-numeric characters,
   * hyphens & underscores
   *
   * @param {string} subID string to be used as the Sub-ID for a link
   *
   * @returns {string}
   */
  const makeIdSafeSub = (subID) => {
    if (typeof subID === 'undefined') {
      return ''
    }

    subID = subID.replace(/^[^a-z0-9]+|[^a-z0-9]+$/ig, '')

    return subID.replace(/[^a-z0-9_\\-]+/ig, '-')
  }

  /**
   * Make ID safe as HTML ID
   *
   * @param {string} id           ID string to be cleaned
   * @param {number} headingLevel
   *
   * @returns {string}
   */
  const makeIdSafe = (id, subID) => {
    let output = id.trim()

    output = output.replace(/[^a-z0-9]+/ig, '-')
    output = 'a' + makeIdSafeSub(subID) + '__' + output.toLowerCase()

    return output
  }

  /**
   * Find all the headings in a policy and create new IDs for them
   *
   * @param {string} whole   Whole matched pattern
   * @param {string} level   Heading level
   * @param {string} id      ID for heading
   * @param {string} num     Hierarchical number of heading
   * @param {string} heading Heading text
   *
   * @returns {string}
   */
  const updateHeadings = (whole, level, id, num, heading) => {

    const _id = makeIdSafe(heading, id)

    if (labelsAndIDs.indexOf(_id) === -1) {
      labelsAndIDs.push(_id)
    }

    return '<a id="' + _id + '" name="' + _id + '" class="sticky-safe-anchor">&nbsp;</a><h' + level + '>' + num + heading
  }

  /**
   * Update the links in the Table of Contents
   *
   * @param {string} whole      Whole matched pattern
   * @param {string} attribute1 First attribute name
   * @param {string} hash1      First attribute hash character
   * @param {string} value1     First attribute value
   * @param {string} attribute2 Second attribute name
   * @param {string} hash2      Second attribute hash character
   * @param {string} value2     Second attribute value
   * @param {string} linkText   Link text
   *
   * @returns {string}
   */
  const updateLinks = (whole, attribute1, hash1, value1, attribute2, hash2, value2, linkText) => {
    if (hash1 === '#' || hash2 === '#') {
      if (value1 !== 'top' && value2 !== 'top') {
        const subID = (hash1 === '#') ? value1 : value2
        // console.log('tmpID:', tmpID)
        const _id = makeIdSafe(linkText, subID)

        if (labelsAndIDs.indexOf(_id) >= 0) {
          return '<a href="#' + _id + '">' + linkText
        }
      }
    }
    return whole
  }

  output = output.replace(anchorIDs, updateHeadings)
  output = output.replace(anchorLinks, updateLinks)

  return output
}

doStuff.register({
  action: 'fixPoliciesAnchorLinksV1',
  func: fixPoliciesAnchorLinksV1,
  description: '',
  // docsULR: '',
  extraInputs: [],
  ignore: false,
  name: 'Fix policy anchor links'
})

//  END: fixPoliciesAnchorLinksV1
// ====================================================================
// START: DUMMY action

/**
 *
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
// function functionName (input, extraInputs, GETvars) {
// }

// doStuff.register({
//   action: '',
//   func: functionName,
//   description: '',
//   // docsULR: '',
//   extraInputs: [],
//   ignore: false,
//   name: ''
// })

//  END: DUMMY action
// ====================================================================

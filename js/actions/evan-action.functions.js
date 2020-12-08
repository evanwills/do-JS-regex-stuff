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
  ignore: true,
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
// START: Action name

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
const artBotSpeeds = (input, extraInputs, GETvars) => {
  const ratio = extraInputs.ratio() * 1
  const swap = extraInputs.swap('true')
  const baseSpeed = extraInputs.baseSpeed() * 1
  const maxSpeed = extraInputs.maxSpeed() * 1
  const _backwards = (ratio < 0)
  const _primes = [
    '1', '2', '3', '5', '7', '11',
    '13', '17', '19', '23', '29', '31',
    '37', '41', '43', '47', '53', '59',
    '61', '67', '71', '73', '79', '83',
    '89', '97'
  ]
  const _okNonPrimes = {
    4: ['2'],
    6: ['2', '3'],
    9: ['3'],
    10: ['2', '5'],
    14: ['2', '7'],
    15: ['3', '5'],
    21: ['3', '7'],
    22: ['2', '11'],
    25: ['5'],
    26: ['2', '13'],
    33: ['3', '11'],
    34: ['2', '17'],
    35: ['5', '7'],
    38: ['2', '19'],
    39: ['3', '13'],
    46: ['2', '23'],
    49: ['7'],
    51: ['3', '17'],
    55: ['5', '11'],
    57: ['3', '19'],
    58: ['2', '29'],
    62: ['2', '31'],
    65: ['5', '13'],
    69: ['3', '23'],
    74: ['2', '37'],
    77: ['7', '11'],
    82: ['2', '41'],
    85: ['5', '17'],
    86: ['2', '43'],
    87: ['3', '29'],
    91: ['7', '13'],
    93: ['3', '31'],
    94: ['2', '47'],
    95: ['5', '19']
  }

  /**
   * Get the nearest viable value to the one supplied
   *
   * @param {string} input Number whose closest viable number is to
   *                       be returned
   * @param {number} prox  relative proximity to input
   */
  const getNearest = (input, prox) => {
    const _prox = (typeof prox === 'number') ? prox : 0
    let _tmp = 0

    if (_prox === 0) {
      if (_primes.indexOf(input) > -1) {
        return {
          val: input,
          isPrime: true,
          factors: []
        }
      }
      if (typeof _okNonPrimes[input] !== 'undefined') {
        return {
          val: input,
          isPrime: false,
          factors: _okNonPrimes[input]
        }
      }
    } else {
      // adjacent prime
      _tmp = input + _prox
      _tmp = _tmp.toString()
      if (_primes.indexOf(_tmp) > -1) {
        return {
          val: _tmp,
          isPrime: true,
          factors: []
        }
      }

      // adjacent prime
      _tmp = input - _prox
      _tmp = _tmp.toString()
      if (_primes.indexOf(_tmp) > -1) {
        return {
          val: _tmp,
          isPrime: true,
          factors: []
        }
      }

      // adjacent OK non-prime
      _tmp = input + _prox
      _tmp = _tmp.toString()
      if (typeof _okNonPrimes[_tmp] !== 'undefined') {
        return {
          val: _tmp,
          isPrime: false,
          factors: _okNonPrimes[_tmp]
        }
      }

      // adjacent OK non-prime
      _tmp = input - _prox
      _tmp = _tmp.toString()
      if (typeof _okNonPrimes[_tmp] !== 'undefined') {
        return {
          val: _tmp,
          isPrime: false,
          factors: _okNonPrimes[_tmp]
        }
      }
    }

    return getNearest(input, _prox + 1)
  }

  /**
   *
   * @param {string} inputA Initial value for left motor speed
   * @param {string} inputB Initial value for right motor speed
   */
  const noSharedFactors = (inputA, inputB) => {
    const _inputA = getNearest(inputA)

    if (_inputA.isPrime) {
      return {
        left: _inputA.val,
        right: inputB
      }
    }

    const _inputB = getNearest(inputB)
    if (_inputB.isPrime) {
      return {
        left: inputA,
        right: _inputB.val
      }
    }

    if (_inputA.factors.indexOf(_inputB.val) > -1 || _inputB.factors.indexOf(_inputA.val) > -1) {
      // One of the values is a factor of the other
      // Just give up
      return false
    } else {
      const _primary = (_inputA.factors.length > _inputB.factors.length)
        ? _inputA
        : _inputB
      const _secondary = (_inputA.factors.length < _inputB.factors.length)
        ? _inputB
        : _inputA

      for (let a = 0; a < _primary.factors.length; a += 1) {
        if (_secondary.factors.indexOf(_primary.factors[a]) > -1) {
          return false
        }
      }

      return {
        left: _inputA.val,
        right: _inputB.val
      }
    }
  }

  /**
   * Undocumented function
   *
   * @param float   ratio     decimal (up to 5 decimal places) between -1 and 1
   * @param boolean swap      swap the values for the wheels
   * @param integer baseSpeed The base speed of the motors of ratio = 0
   *
   * @return array
   */
  const getMotorSpeeds = (_ratio_, _swap, _baseSpeed, _topSpeed) => {
    const _totalSpeed = _baseSpeed * 2
    const _maxSpeed = (typeof _topSpeed !== 'number' || _topSpeed > 100 || _topSpeed < -100) ? 100 : _topSpeed
    let _output = { left: baseSpeed, right: baseSpeed }

    let _ratio = (_backwards) ? -_ratio_ : _ratio_
    let _left = _baseSpeed
    let _right = _baseSpeed

    _ratio = (_ratio > 1) ? 1 / _ratio : _ratio
    _ratio = 1 - _ratio

    _left = _baseSpeed * _ratio
    _right = _totalSpeed - _left
    _output.left = _left
    _output.right = _right

    if (_right > _maxSpeed) {
      _right = Math.round(_right)
      if (_right > 100) {
        // debug('going into recursion', _left, _right);
        _output = getMotorSpeeds(
          ratio,
          swap,
          (baseSpeed - ((_right - _maxSpeed) / 2))
        )
      }
    }

    return noSharedFactors(
      Math.round(_output.left),
      Math.round(_output.right)
    )
  }

  let output = getMotorSpeeds(ratio, swap, baseSpeed, maxSpeed)
  if (output === false) {
    // OK output is DUD, maybe if we adjust the baseSpeed, we can get something w
    for (let a = 0; a < 20; a += 1) {
      if ((baseSpeed + a) > maxSpeed) {
        break
      }

      output = getMotorSpeeds(ratio, swap, (baseSpeed + a), maxSpeed)
      if (output !== false) {
        break
      } else {
        output = getMotorSpeeds(ratio, swap, (baseSpeed - a), maxSpeed)
        if (output !== false) {
          break
        }
      }
    }
  }

  if (output !== false) {
    let tmp

    if (swap) {
      tmp = output.left
      output.left = output.right
      output.right = tmp
    }

    if (_backwards) {
      output.left = -output.left
    }

    return ' Left: ' + output.left + '\nRight: ' + output.right
  } else {
    return 'Could not get usable motor speeds'
  }
}

doStuff.register({
  action: 'artBotSpeeds',
  func: artBotSpeeds,
  description: '',
  // docsULR: '',
  extraInputs: [{
    id: 'ratio',
    type: 'number',
    label: 'Ratio as decimal',
    default: 0.236498,
    min: -2,
    max: 2,
    step: 0.000001
  }, {
    id: 'swap',
    type: 'checkbox',
    label: 'swap',
    options: [
      {
        value: 'true',
        label: 'Swap values for motors'
      }
    ]
  }, {
    id: 'baseSpeed',
    type: 'number',
    label: 'base speed of the motors at a ratio of 0',
    default: 50,
    min: -100,
    max: 100
  }, {
    id: 'maxSpeed',
    type: 'number',
    label: 'Maximum allowable speed of the motors',
    default: 80,
    min: -100,
    max: 100
  }],
  group: 'evan',
  ignore: false,
  name: 'Calculate Artbot Motor Speeds'
})

// ====================================================================
// START: ACUSIS queries

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
const acusysQueries = (input, extraInputs, GETvars) => {
  const _invoices = input.split('\n')
  let _in = ''
  let _sep = ''
  for (let a = 0; a < _invoices.length; a += 1) {
    _in += _sep + '\n      \'' + _invoices[a].trim() + '\''
    _sep = ','
  }

  return `
-- ====================================================
-- RUN BOTH THESE QUERIES IN ORDER EVERY TIME
-- (It saves you having to run them separately each time)

-- ==========================
-- Revert previous (below) change before re-running the update

UPDATE acu_project_invoice
SET    datesenttofinanace = null
WHERE  status = 'Approved'
AND    CAST(datesenttofinanace AS DATE) = CAST(GETDATE() AS DATE)
AND    invoiceno IN (
        -- - - - - - - - - - - - - - - - - - - - -
        -- Below are all the invoice IDs to be checked
        --
        -- These IDs do not need to be changed/commented
${_in}
);


-- ==========================
-- Make change

UPDATE acu_project_invoice
SET    datesenttofinanace = getdate()
WHERE  status = 'Approved'
AND    datesenttofinanace is null
AND    invoiceno IN (
        -- - - - - - - - - - - - - - - - - - - - -
        -- Below here should go all the invoice IDs to be checked
        -- (Use the same list as above)
        --
        -- Comment all of the below out (one by one)
        --
        -- Step 1:  Comment out the first ID
        -- Step 2:  Run the both SQL Queries
        -- Step 3:  Test the batch
        --          https://acusis.acu.edu.au/ACUSIS/ACUdefault/Enhancement/ProjectProcurement/Send_finance_email.aspx
        -- Step 4a: If the batch failed add a commnet after the
        --          failing ID to identify it as bad and uncomment
        --          it.
        -- Step 5b: If the batch succeeded, leave it the ID commented
        --          out
        -- Step 6:  Repeat steps 1 - 5 until all bad IDs have been
        --          identified for each subsequent ID
        --
        -- NOTE: You do not need to comment out any of the IDs in the
        --       last SQL Statement
        --       These are ignored if their datSsenTtoFinanace is NULL
        -- - - - - - - - - - - - - - - - - - - - -
${_in}
);`
}

doStuff.register({
  action: 'acusysQueries',
  func: acusysQueries,
  description: '',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'ACUSIS queries'
})

//  END: ACUSIS queries
// ====================================================================
// START: ACU Form Build email hash search

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
const emailHashSearch = (input, extraInputs, GETvars) => {
  const rows = input.split('\n')
  const IDs = []
  let IDstring = ''
  let sep = ''
  let output = ''
  console.log('rows:', rows)
  for (let a = 0; a < rows.length; a += 1) {
    if (rows[a].trim() !== '') {
      const row = rows[a].split('\t')
      console.log('row:', row)
      if (row[1].trim() !== '') {
        const ref = row[1].split('_')
        console.log('ref:', ref)
        const acro = ref[0].trim()
        const id = ref[1].trim()
        console.log('acro:', acro)
        console.log('id:', id)
        IDs.push(id)
        IDstring += sep + id
        sep = ', '
      }
    }
  }

  output = `\n-- Total rows: ${IDs.length}\n\nSELECT COUNT(*)\nFROM \`email_hash\`\nWHERE \`user_id\` IN ( ${IDstring} );`

  return output
}

doStuff.register({
  action: 'emailHashSearch',
  func: emailHashSearch,
  description: '',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'ACU Form Build email hash search'
})

//  END: ACU Form Build email hash search
// ====================================================================
// START: Fix bad ACU.Sitecore merge

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
const fixBadSitecoreMerge = (input, extraInputs, GETvars) => {
  var lines = input.split('\n')
  var uncommitted = false
  var untracked = false
  var line = ''
  var output = ''
  var file = ''
  var checkoutFiles = ''
  var rmFiles = ''
  var rmDirs = ''
  var thisURL = 'file:///C:/Users/evwills/Documents/Evan/code/do-JS-regex-stuff/do-JS-regex-stuff.html?groups=it,evan&action=fixbadsitecoremerge'

  for (var a = 0; a < lines.length; a += 1) {
    line = lines[a].trim()

    if (line === '' || line.substring(line.length - 3) === '.sh' || line.substr(0, 9) === 'On branch' || line.substr(0, 1) === '(' || line.substr(0, 10) === 'no changes' || line.substr(0, 33) === 'src/Project/ACUPublic/ACU.Static/') {
      console.log('Skipping line:', line)
      continue
    }

    if (line === 'Changes not staged for commit:') {
      uncommitted = true
      untracked = false
      // output += '\n-----------------------\necho "Undoing merge"\n\n'
      continue
    }
    if (line === 'Untracked files:') {
      uncommitted = false
      untracked = true
      // output += '\n-----------------------\necho "Removing untracked files"\n\n'
      continue
    }

    if (uncommitted === true) {
      file = line.replace(/^(?:deleted|modified):[\\t ]*/, '')
      console.log('file:', file)
      console.log('line:', line)
      if (file !== line) {
        checkoutFiles += ' "' + file + '"'
      }
    } else if (untracked === true) {
      if (line.substr(line.length - 1) === '/') {
        rmDirs += ' "' + line + '"'
      } else {
        rmFiles += ' "' + line + '"'
      }
    }
  }

  if (checkoutFiles !== '') {
    output += '\n\n-----------------------\necho "Files to be reset";\n\ngit checkout' + checkoutFiles + ';\n\ngit reset' + checkoutFiles + ';'
  }
  if (rmFiles !== '') {
    output += '\n\n-----------------------\necho "Files to be deleted";\n\nrm' + rmFiles + ';'
  }
  if (rmDirs !== '') {
    output += '\n\n-----------------------\necho "Directories to be deleted";\n\nrm -rf' + rmDirs + ';'
  }

  if (output !== '') {
    output = '#!/bin/sh\n\n// ' + thisURL + '\n\n' + output + '\n\n\ngit status;\n\n// ' + thisURL + '\n\n'
  } else {
    output = input
  }

  return output
}

doStuff.register({
  action: 'fixBadSitecoreMerge',
  func: fixBadSitecoreMerge,
  description: '',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Fix bad ACU.Sitecore merge'
})

//  END: Fix bad ACU.Sitecore merge
// ====================================================================
// START: Accept all origin changes

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
const acceptChanges = (input, extraInputs, GETvars) => {
  var lines = input.split('\n')
  var line = ''
  var output = ''
  var oursTheirs = extraInputs.oursTheirs()
  var doAdd = extraInputs.add('add')
  var doCheckout = extraInputs.add('checkout')
  var a

  oursTheirs = (typeof oursTheirs === 'string') ? oursTheirs : 'theirs'
  console.log('lines:', lines)
  console.log('lines.length:', lines.length)
  console.log('oursTheirs:', oursTheirs)

  for (a = 0; a < lines.length; a += 1) {
    console.log('lines[' + a + ']:', lines[a])
    line = lines[a].trim()
    console.log('line:', line)
    line = line.replace(/^both modified:\s+/, '')
    console.log('line:', line)

    if (line !== '') {
      if (doCheckout === true) {
        output += 'git checkout --' + oursTheirs + ' "' + line + '";\n'
      }
      if (doAdd === true) {
        output += 'git add "' + line + '";\n'
      }
      console.log('output:', output)
    }
  }

  if (output !== '') {
    output += 'git status;\n'
  }

  return output
}

doStuff.register({
  action: 'acceptChanges',
  func: acceptChanges,
  description: '',
  // docsULR: '',
  extraInputs: [{
    id: 'oursTheirs',
    label: 'Mine or theirs?',
    type: 'radio',
    options: [{
      value: 'ours',
      label: 'Mine'
    }, {
      value: 'theirs',
      label: 'Theirs',
      default: true
    }]
  }, {
    id: 'add',
    label: 'Git commands',
    type: 'checkbox',
    options: [{
      value: 'checkout',
      label: 'Do `git checkout`',
      default: true
    }, {
      value: 'add',
      label: 'Do `git add`',
      default: true
    }]
  }],
  group: 'evan',
  ignore: false,
  name: 'Accept merge changes'
})

//  END: DUMMY action
// ====================================================================
// START: side-accordion IDs

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
const sideAccordionIDs = (input, extraInputs, GETvars) => {
  const regex = new RegExp(
    '(@if \\(!string\\.IsNullOrEmpty\\(Model(?:\\.(?:DataItemModel|StudentType))?\\.' +
    '([^)]+)' +
    '\\)\\)\\s+\\{\\s+<div class="side-accordion")(?=>)',
    'gi'
  )

  const replaceFunc = (whole, ifPart, varPart) => {
    console.log('whole:', whole)
    console.log('ifPart:', ifPart)
    console.log('varPart:', varPart)
    var _varPart = varPart.replace(/[^a-zA-Z]+/ig, '-')
    _varPart = _varPart.replace(/([a-z])(?=[A-Z])/g, '$1-')
    return ifPart + ' id="' + _varPart.toLowerCase() + '"'
  }

  console.log('regex:', regex)

  return input.replace(regex, replaceFunc)
}

doStuff.register({
  action: 'sideAccordionIDs',
  func: sideAccordionIDs,
  description: '',
  // docsULR: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Side Accordion IDs'
})

//  END: side-accordion IDs
// ====================================================================
// START: Bash path to Windows path

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
const bash2windows = (input, extraInputs, GETvars) => {
  const prefix = {
    bash: '/c/ACU.Sitecore/Website/',
    win: 'C:\\ACU.Sitecore\\Website\\'
  }
  const whichWay = extraInputs.whichWay()
  let output = ''

  input = input.trim()

  const forwardBack = (_input) => {
    const _output = _input.replace(
      /^\/([a-z])(?=\/)/i,
      (whole, part) => {
        return part.toUpperCase() + ':'
      }
    )
    return _output.replace(/\//g, '\\')
  }
  const backForward = (_input) => {
    const _output = _input.replace(
      /^([a-z]):(?=\\)/i,
      (whole, part) => {
        return '/' + part.toLowerCase()
      }
    )
    return _output.replace(/\\/g, '/')
  }

  if (whichWay === 'win2bash') {
    output = backForward(input)
    console.log('input:', input)
    console.log('input.substr(1, 1):', input.substr(1, 1))
    if (input.substr(1, 1) === ':') {
      output = prefix.bash + output
    }
  } else {
    output = forwardBack(input)
    if (input.substr(0, 1) === '/') {
      output = prefix.win + output
    }
  }

  return output
}

doStuff.register({
  action: 'bash2windows',
  func: bash2windows,
  description: '',
  // docsULR: '',
  extraInputs: [
    {
      id: 'whichWay',
      label: 'Which way to convert',
      type: 'radio',
      options: [
        { value: 'bash2win', label: 'Bash path to Windows path', default: true },
        { value: 'win2bash', label: 'Windows to Bash' }
      ]
    }],
  // group: '',
  ignore: false,
  name: 'Bash path to Windows path'
})

//  END: Bash path to Windows path
// ====================================================================

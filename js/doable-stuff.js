/**
 * simpleUpdate() finds all the voels in a string and converts them
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

function simpleUpdate (input, extraInputs, GETvars) {
  return input.replace(/[aeiou]+/ig, ' [[BOC! BOC!!! I am a chicken]] ')
}

doStuff.register({
  action: 'doChicken',
  name: 'Expose the chickens',
  func: simpleUpdate,
  description: 'Change all vowels into chickens'
})

// ====================================================================
// Do JS Regex Stuff
// Expose the chickens
// Text to be modified
function internationalPatners (input, extraInputs, GETvars) {
  console.log('extraInputs:', extraInputs)
  console.log('extraInputs.textType():', extraInputs.textType())
  console.log('extraInputs.filterType():', extraInputs.filterType())
  console.log('extraInputs.radioType():', extraInputs.radioType())
  console.log('extraInputs.checkboxType("country-filter"):', extraInputs.checkboxType('country-filter'))
  console.log('extraInputs.checkboxType("agreement-type"):', extraInputs.checkboxType('agreement-type'))
  console.log('extraInputs.checkboxType("org-unit-filter"):', extraInputs.checkboxType('org-unit-filter'))
  return input
}

doStuff.register({
  action: 'internationalPatners',
  name: 'Iternational partners unique select',
  func: internationalPatners,
  description: 'I don\'t know what this is for but it had an extra input field so I\'m using it to test stuff.',
  extraInputs: [
    {
      id: 'textType',
      label: 'Text Type',
      type: 'text',
      description: 'text a filter type you want to output',
      placeholder: 'something here'
    },
    {
      id: 'tex1tType',
      label: 'Tex1t Type',
      type: 'text',
      description: 'text1 a filter type you want to output',
      placeholder: 'something here'
    },
    {
      id: 'filterType',
      label: 'Filter Type',
      type: 'select',
      options: [
        { 'value': 'country-filter', label: 'Country Filter' },
        { 'value': 'agreement-type', label: 'Agreement type', default: true },
        { 'value': 'org-unit-filter', label: 'Org Unit filter' }
      ],
      description: 'Select a filter type you want to output'
    },
    {
      id: 'radioType',
      label: 'Radio Type',
      type: 'radio',
      options: [
        { 'value': 'country-filter', label: 'Country Filter' },
        { 'value': 'agreement-type', label: 'Agreement type', default: true },
        { 'value': 'org-unit-filter', label: 'Org Unit filter' }
      ],
      description: 'Select a radio type you want to output'
    },
    {
      id: 'checkboxType',
      label: 'Checkbox Type',
      type: 'checkbox',
      options: [
        { 'value': 'country-filter', label: 'Country Filter' },
        { 'value': 'agreement-type', label: 'Agreement type', default: true },
        { 'value': 'org-unit-filter', label: 'Org Unit filter' }
      ],
      description: 'Select a radio type you want to output'
    }
  ]
})

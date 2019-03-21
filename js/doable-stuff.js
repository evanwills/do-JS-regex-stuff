/**
 *
 * @param {*} input
 * @param {*} extraInputs
 */

function simpleUpdate (input, extraInputs) {
  console.log('inside simpleUpdate()')
  return input.replace(/[aeiou]+/ig, ' [[BOC! BOC!!! I am a chicken]] ')
}

doStuff.register({
  action: 'doChicken',
  name: 'Expose the chickens',
  func: simpleUpdate,
  description: 'Change all vowels into chickens'
})

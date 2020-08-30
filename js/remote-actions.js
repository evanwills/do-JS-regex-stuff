/* jslint browser: true */
/* global doStuff */

doStuff.register({
  action: 'Base64',
  description: 'Encode/Decode Base64 string',
  // group: 'it',
  // ignore: true,
  name: 'Base64 encode/decode',
  extraInputs: [
    {
      id: 'mode',
      label: 'Encode/Decode mode',
      options: [
        {
          value: 'true',
          label: 'Encode',
          checked: true
        },
        {
          value: 'false',
          label: 'Decode',
          checked: false
        }
      ],
      type: 'radio'
    }
  ],
  remote: true
})

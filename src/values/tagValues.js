import {required, maxLength} from 'vuelidate/lib/validators'

export const tagTypeNames = [
  'people',
  'water',
  'vehicle',
  'area',
  'damage',
  'other',
]

export const tagTypeValues = {
  people: {
    amount: [
      'one person',
      'more than one person',
    ],
    state: [
      'all healthy',
      'some injured',
      'some dead',
      'mixed',
    ],
    freedom: [
      'walking',
      'unable to walk',
      'trapped',
    ],
  },
  water: {
    form: [
      'flood',
      'natural environment',
      'distributed safely',
    ],
  },
  vehicle: {
    state: [
      'working',
      'broken',
      'unsure',
    ],
  },
  area: {
    form: [
      'provided by relief effort',
      'makeshift',
    ],
    shelter: [
      'sheltered',
      'not sheltered',
    ],
    service: [
      'food',
      'water',
      'medical aid',
      'human remains management',
      'other supplies',
    ],
  },
  damage: {
    form: [
      'fire',
      'collapsed structure',
      'unstable structure',
      'road blockage',
      'compromised bridge',
      'damaged power or communication line',
      'landslide',
    ],
  },
}

export const tagForm = ({includeDescription}) => {
  const tagForm = {}
  // copy tagTypeValues to tagForm, replacing all arrays with null
  Object.keys(tagTypeValues).forEach((type) => {
    Object.keys(tagTypeValues[type]).forEach((subType) => {
      if (!tagForm[type]) tagForm[type] = {}
      tagForm[type][subType] = null
    })
  })
  // non sub-type fields
  tagForm.type = null
  if (includeDescription) tagForm.description = null
  return tagForm
}

export const tagValidations = ({selectedType}) => {
  // always applied no matter the selected type
  const validations = {
    form: {
      type: {required},
      description: {maxLength: maxLength(800)},
    },
  }
  if (selectedType === 'other') { // if selected type is other, then description is required
    validations.form.description.required = required
  } else if (selectedType) { // if selected type has sub-types, then all sub-types are required
    const subTypeValidations = {}
    Object.keys(tagTypeValues[selectedType]).forEach((subType) => {
      subTypeValidations[subType] = {required}
    })
    validations.form[selectedType] = subTypeValidations
  }
  return validations
}

import {withParams, req} from 'vuelidate/lib'

export const required = withParams({type: 'required'}, value => (!req(value) || value !== {}))

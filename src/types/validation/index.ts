export interface ValidationProps {
  identifier?: string
  value?: string | boolean
  tokenType?: 'registered' | 'verified' | 'loggedIn'
}

export interface HelperFooterMessage extends ValidationProps {
  status?: 'error' | 'success'
  statusMessage?: string
}

export interface SpreadErrorMessage extends HelperFooterMessage {
  spread?:
    | 'ontoAncestors'
    | 'ontoDescendants'
    | 'ontoAll'
    | 'ontoNone'
    | 'ontoSubmit'
  spreadMessage?: string
}
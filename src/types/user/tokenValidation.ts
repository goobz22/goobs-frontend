export interface TokenValidationResult {
  token?: {
    name: 'registered' | 'verified' | 'loggedIn'
    status:
      | 'valid'
      | 'onlyCookieToken'
      | 'onlyDatabaseBoolean'
      | 'onlyDatabaseToken'
      | 'cookieExpired'
      | 'invalid'
      | 'emptyTokens'
    cookie: {
      token?: string
      expiration?: Date | null
    }
    database: {
      token?: string
      boolean?: boolean
      expiration?: Date | null
    }
  }
}

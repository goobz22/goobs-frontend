import { describe, expect, it } from 'bun:test'
import {
  escapeCsvCell,
  redactDiagnosticFields,
  safeNavigationUrl,
} from '../../src/utils/security'

describe('safeNavigationUrl', () => {
  it('allows relative and HTTP(S) destinations', () => {
    for (const value of [
      '/workspace/tasks',
      './tasks?view=open',
      '../home',
      '?tab=security',
      '#details',
      'https://example.com/path',
      'http://localhost:3000/dev',
      '//example.com/path',
    ]) {
      expect(safeNavigationUrl(value)).toBe(value)
    }
  })

  it('rejects executable, data, file and control-character schemes', () => {
    for (const value of [
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      ' java\nscript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
      'mailto:security@example.com',
      'tel:+15551234567',
      '',
      '   ',
    ]) {
      expect(safeNavigationUrl(value)).toBeNull()
    }
  })
})

describe('escapeCsvCell', () => {
  it('quotes cells and doubles embedded quotes', () => {
    expect(escapeCsvCell('She said "hello"')).toBe('"She said ""hello"""')
  })

  it('neutralizes every spreadsheet-formula prefix, including leading whitespace', () => {
    for (const value of [
      '=1+1',
      '+SUM(A1:A2)',
      '-2+3',
      '@SUM(A1:A2)',
      '\t=1+1',
      '\r=1+1',
      '\n=1+1',
      '  =1+1',
      '\uFEFF@SUM(A1:A2)',
    ]) {
      expect(escapeCsvCell(value)).toStartWith('"\'')
    }
    expect(escapeCsvCell('ordinary text')).toBe('"ordinary text"')
  })
})

describe('redactDiagnosticFields', () => {
  it('keeps field names while removing every submitted value', () => {
    const fields = redactDiagnosticFields({
      email: 'person@example.com',
      password: 'correct horse battery staple',
      nested: { token: 'secret' },
    })
    expect(fields).toEqual({ email: true, password: true, nested: true })
    expect(JSON.stringify(fields)).not.toContain('person@example.com')
    expect(JSON.stringify(fields)).not.toContain('correct horse')
    expect(JSON.stringify(fields)).not.toContain('secret')
  })
})

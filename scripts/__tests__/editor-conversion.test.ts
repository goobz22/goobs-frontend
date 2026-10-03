import { describe, expect, test } from 'bun:test'
import {
  convertValue,
  sanitizeHtml,
} from '../../src/components/ComplexTextEditor/utils/conversion'

describe('rich HTML sanitization', () => {
  for (const href of [
    'java&#x73;cript:alert(1)',
    '&#106;avascript:alert(1)',
    'java&#9;script:alert(1)',
  ]) {
    test(`removes the browser-decoded executable URL ${href}`, () => {
      expect(sanitizeHtml(`<a href="${href}">bad</a>`)).toBe('<a>bad</a>')
    })
  }
  test('drops foreign markup and slash-delimited event attributes', () => {
    expect(sanitizeHtml('<svg/onload=alert(1)><circle /></svg>')).toBe('')
    expect(
      sanitizeHtml('<img src="photo.png"/onerror=alert(1)>')
    ).not.toContain('onerror')
  })
  test('preserves safe editor formatting, links and images', () => {
    const safe = sanitizeHtml(
      '<p style="text-align: center"><b>Bold</b> <a href="https://example.com/?a=1&amp;b=2">link</a><img src="data:image/png;base64,AAAA" alt="photo" /></p>'
    )
    expect(safe).toContain('<b>Bold</b>')
    expect(safe).toMatch(/text-align:\s*center/)
    expect(safe).toContain('href="https://example.com/?a=1&amp;b=2"')
    expect(safe).toContain('src="data:image/png;base64,AAAA"')
  })
})

describe('editor mode changes preserve text', () => {
  for (const text of [
    'A & B < C',
    '"quotes" and apostrophes\'',
    'literal &amp; and &#60; text',
    'Unicode: caf\u00e9 \u{1f408}',
    '<img src=x onerror=alert(1)>',
  ]) {
    test(`simple to rich to simple: ${text}`, () => {
      expect(
        convertValue(convertValue(text, 'simple', 'rich'), 'rich', 'simple')
      ).toBe(text)
    })
  }
  test('rich to markdown decodes text once, after removing tags', () => {
    expect(
      convertValue('<p>A &amp; B &lt; C &#x1f408;</p>', 'rich', 'markdown')
    ).toBe('A & B < C \u{1f408}')
    expect(convertValue('<p>&amp;lt;b&amp;gt;</p>', 'rich', 'markdown')).toBe(
      '&lt;b&gt;'
    )
  })
})

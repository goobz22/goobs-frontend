import * as React from 'react';
import * as S from "@ds-stories/src/components/Snackbar/snackbar.stories";

// OWNED preview (no @ds-preview marker). Two reasons the generated card showed a
// blank/faded snackbar while storybook showed it open:
//  1. Snackbar is a self-dismissing overlay — `open:true` mounts it, then a
//     setTimeout(autoHideDuration=6000) flips isOpen→false and it returns null.
//  2. Snackbar is `position: fixed` (viewport-bottom anchored), so it renders
//     outside the preview card's captured region.
// Fix (verification-only — the shipped component is unchanged): force every story
// open with a non-firing autoHideDuration, and wrap the render in a `transform`ed
// box so the fixed toast becomes contained by (and visible within) the card.
function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  const args: any = { ...(meta.args ?? {}), ...(st && st.args ? st.args : {}) };
  const at: any = { ...(meta.argTypes ?? {}), ...(st && st.argTypes ? st.argTypes : {}) };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === 'object' && args[k] in m) args[k] = m[args[k]];
  }
  args.open = true;
  // 10 min — large enough never to fire during the seconds-long still capture,
  // but within setTimeout's 32-bit max (2147483647ms); a value past that overflows
  // and fires immediately, auto-closing the toast (→ blank card).
  args.autoHideDuration = 600000;
  const title: string = typeof meta.title === 'string' ? meta.title : '';
  const ctx: any = {
    args, name: key, title, kind: title, id: '', componentId: '',
    globals: {}, viewMode: 'story',
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let render: (() => any) | null = null;
  if (st && typeof st.render === 'function') render = () => st.render(args, ctx);
  else if (typeof st === 'function') render = () => st(args, ctx);
  else if (typeof meta.render === 'function') render = () => meta.render(args, ctx);
  else {
    const C = (st && st.component) || meta.component;
    if (C) render = () => React.createElement(C, args);
  }
  if (!render) return () => null;
  const decorators: any[] = ([] as any[]).concat((st && st.decorators) ?? []).concat(meta.decorators ?? []);
  // Render the toast at its natural position:fixed window-bottom spot (as storybook
  // does). The short capture viewport declared in cfg.overrides.Snackbar frames it.
  // `open` is held true with a safe (non-overflowing) autoHideDuration so it stays
  // visible for the still capture.
  return decorators.reduce((inner: any, dec: any) => () => {
    const out = dec(inner, ctx);
    return out === undefined ? inner() : out;
  }, render);
}

export const LightThemeSuccess = /* Themes/Light Theme - Success */ compose(S, "LightThemeSuccess");
export const LightThemeError = /* Themes/Light Theme - Error */ compose(S, "LightThemeError");
export const LightThemeWarning = /* Themes/Light Theme - Warning */ compose(S, "LightThemeWarning");
export const LightThemeInfo = /* Themes/Light Theme - Info */ compose(S, "LightThemeInfo");
export const DarkThemeSuccess = /* Themes/Dark Theme - Success */ compose(S, "DarkThemeSuccess");
export const DarkThemeError = /* Themes/Dark Theme - Error */ compose(S, "DarkThemeError");
export const DarkThemeWarning = /* Themes/Dark Theme - Warning */ compose(S, "DarkThemeWarning");
export const DarkThemeInfo = /* Themes/Dark Theme - Info */ compose(S, "DarkThemeInfo");
export const SacredThemeSuccess = /* Themes/Sacred Theme - Success */ compose(S, "SacredThemeSuccess");
export const SacredThemeError = /* Themes/Sacred Theme - Error */ compose(S, "SacredThemeError");
export const SacredThemeWarning = /* Themes/Sacred Theme - Warning */ compose(S, "SacredThemeWarning");
export const SacredThemeInfo = /* Themes/Sacred Theme - Info */ compose(S, "SacredThemeInfo");
export const AllSeveritiesLight = /* Severity/All Severities - Light Theme */ compose(S, "AllSeveritiesLight");
export const AllSeveritiesDark = /* Severity/All Severities - Dark Theme */ compose(S, "AllSeveritiesDark");
export const AllSeveritiesSacred = /* Severity/All Severities - Sacred Theme */ compose(S, "AllSeveritiesSacred");
export const CustomDuration = /* Behavior/Custom Duration */ compose(S, "CustomDuration");
export const NoAutoHide = /* Behavior/No Auto-Hide */ compose(S, "NoAutoHide");
export const Interactive = /* Behavior/Interactive */ compose(S, "Interactive");
export const FormSubmission = /* Use Cases/Form Submission */ compose(S, "FormSubmission");
export const FileUpload = /* Use Cases/File Upload */ compose(S, "FileUpload");

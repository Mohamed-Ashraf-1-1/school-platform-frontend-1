import { GENDER_LABELS, DURATION_LABELS } from './constants.js';

export function genderLabel(gender, lang) {
  return GENDER_LABELS[lang]?.[gender] ?? gender;
}

export function durationLabel(duration, lang) {
  return DURATION_LABELS[lang]?.[duration] ?? duration;
}

export function formatScore(score) {
  if (score === null || score === undefined || score === '') return '—';
  return Number(score).toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function truncate(text, max = 140) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

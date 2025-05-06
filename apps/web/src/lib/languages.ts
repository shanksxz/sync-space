import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";

export const languages: Record<string, any> = {
	js: javascript(),
	ts: javascript({ typescript: true }),
	jsx: javascript({ jsx: true }),
	tsx: javascript({ typescript: true, jsx: true }),
	html: html(),
	css: css(),
	json: json(),
	markdown: markdown(),
	rust: rust(),
	sql: sql(),
	plaintext: [],
};

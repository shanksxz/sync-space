"use client";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

const languageMap = {
	javascript: javascript(),
	typescript: javascript({ typescript: true }),
	jsx: javascript({ jsx: true }),
	tsx: javascript({ typescript: true, jsx: true }),
	html: html(),
	css: css(),
	json: json(),
	md: markdown(),
	python: python(),
	rust: rust(),
	sql: sql(),
	xml: xml(),
};

type FileExtension = keyof typeof languageMap;

export function CodeEditor({
	content,
	fileName,
	readOnly = true,
}: {
	content: string;
	fileName: string;
	readOnly?: boolean;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const getLanguage = (fileName: string) => {
		const ext = fileName.split(".").pop()?.toLowerCase() as FileExtension;
		return languageMap[ext] || javascript();
	};

	return (
		<CodeMirror
			value={content}
			height="100%"
			theme="dark"
			basicSetup={{
				lineNumbers: true,
				highlightActiveLineGutter: true,
				highlightSpecialChars: true,
				history: true,
				foldGutter: true,
				drawSelection: true,
				dropCursor: true,
				allowMultipleSelections: true,
				indentOnInput: true,
				syntaxHighlighting: true,
				bracketMatching: true,
				closeBrackets: true,
				autocompletion: true,
				rectangularSelection: true,
				crosshairCursor: true,
				highlightActiveLine: true,
				highlightSelectionMatches: true,
				closeBracketsKeymap: true,
				defaultKeymap: true,
				searchKeymap: true,
				historyKeymap: true,
				foldKeymap: true,
				completionKeymap: true,
				lintKeymap: true,
			}}
			extensions={[
				getLanguage(fileName),
				EditorView.lineWrapping,
				EditorView.theme({
					"&": {
						backgroundColor: "transparent !important",
						height: "100%",
					},
					".cm-gutters": {
						backgroundColor: "transparent !important",
						border: "none",
					},
					".cm-line": {
						padding: "0 4px",
					},
				}),
			]}
			readOnly={readOnly}
		/>
	);
}

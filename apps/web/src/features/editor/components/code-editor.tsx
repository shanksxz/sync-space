"use client";

import { languages } from "@/lib/languages";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
	useMyPresence,
	useRoom,
	useSelf,
	useStorage,
} from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { basicSetup } from "codemirror";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { ayuLight, barf } from "thememirror";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import { Avatars } from "./avatars";

export function CodeEditor() {
	const editorRef = useRef<HTMLDivElement>(null);
	const editorViewRef = useRef<EditorView | null>(null);
	const { theme } = useTheme();
	console.log("theme", theme);

	const userInfo = useSelf((me) => me.info);

	const room = useRoom();
	const activeFileId = useStorage((root) => root.fileTree.activeFileId);
	const activeFile = useStorage((root) =>
		// @ts-ignore
		activeFileId ? root.fileTree.files?.[activeFileId.split(".").pop()] : null,
	);
	const [presence, updatePresence] = useMyPresence();

	useEffect(() => {
		if (!editorRef.current || !activeFileId || !activeFile) return;

		let view: EditorView | undefined;

		//? for some reason, the yjs provider is not working when using getYjsProviderForRoom
		//? it's not re-syncing the document when the file is changed
		//? so we are using the old way of doing it

		const yDoc = new Y.Doc();
		const providerRef = new LiveblocksYjsProvider(room, yDoc);

		providerRef.awareness.setLocalStateField("user", {
			name: userInfo?.name ?? "Anonymous",
			color: userInfo?.color ?? "red",
			colorLight: `${userInfo?.color}80`,
		});

		const onSynced = (isSynced: boolean) => {
			if (!isSynced) return;
			console.log("synced");

			const rootMap = yDoc.getMap("root") as Y.Map<any>;
			const ids = activeFileId.split(".");
			ids.shift();
			let currentNode: Y.Map<any> | null = rootMap;
			for (const id of ids) {
				if (currentNode?.has(id)) {
					currentNode = currentNode.get(id) as Y.Map<any>;
				} else {
					currentNode = null;
					break;
				}
			}
			if (!currentNode) {
				console.error("File not found in Yjs tree:", activeFileId);
				return;
			}
			const yText = currentNode.get("content") as Y.Text;
			if (!yText) {
				console.error("No content found for file:", activeFileId);
				return;
			}

			//TODO: fix this
			const languageExt =
				languages[activeFile.path.split(".").pop()] || languages.plaintext;

			//? is there a way to check if the editor is already initialized?
			if (editorViewRef.current) editorViewRef.current.destroy();

			const state = EditorState.create({
				doc: yText.toString(),
				extensions: [
					basicSetup,
					languageExt,
					theme === "dark" ? barf : ayuLight,
					// barf,
					yCollab(yText, providerRef.awareness),
					//TODO: fix this
					// EditorView.updateListener.of((update: ViewUpdate) => {
					//   if (update.docChanged || update.selectionSet) {
					//     const selection = update.state.selection.main;
					//     updatePresence({
					//       cursor: {
					//         line: update.state.doc.lineAt(selection.head).number - 1,
					//         ch:
					//           selection.head -
					//           update.state.doc.lineAt(selection.head).from,
					//       },
					//       selection: selection.empty
					//         ? null
					//         : {
					//           anchor: {
					//             line:
					//               update.state.doc.lineAt(selection.anchor).number - 1,
					//             ch:
					//               selection.anchor -
					//               update.state.doc.lineAt(selection.anchor).from,
					//           },
					//           head: {
					//             line:
					//               update.state.doc.lineAt(selection.head).number - 1,
					//             ch:
					//               selection.head -
					//               update.state.doc.lineAt(selection.head).from,
					//           },
					//         },
					//       isTyping: true,
					//     });
					//   }
					// }),
				],
			});

			//? if current editor view is not empty, destroy it
			// if (editorViewRef.current) editorViewRef.current.destroy();

			view = new EditorView({
				state,
				parent: editorRef.current!,
			});

			editorViewRef.current = view;
		};

		providerRef.on("synced", (status: boolean) => {
			console.log("inside sync", status);
			onSynced(status);
		});

		return () => {
			console.log("unmounting code editor");
			if (editorViewRef.current) editorViewRef.current.destroy();
		};
	}, [room, theme, activeFileId, activeFile]);

	if (!activeFileId || !activeFile) {
		return (
			<div className="h-full w-full flex items-center justify-center text-muted-foreground">
				Select a file to edit
			</div>
		);
	}

	return (
		<div className="h-full w-full relative">
			<div className="absolute top-0 left-0 right-0 h-10 px-4 border-b flex items-center justify-between">
				<span className="text-sm text-muted-foreground">{activeFile.path}</span>
				<Avatars />
			</div>
			<div className="pt-10 h-full">
				<div ref={editorRef} className="relative grow overflow-auto" />
			</div>
		</div>
	);
}

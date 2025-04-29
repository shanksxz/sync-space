"use client";

import { Avatars } from "@/features/editor/components/avatar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { EditorView, basicSetup } from "codemirror";
import { useCallback, useEffect, useState } from "react";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";

export function CollaborativeEditor() {
	const room = useRoom();
	const provider = getYjsProviderForRoom(room);
	const [element, setElement] = useState<HTMLElement>();
	const [yUndoManager, setYUndoManager] = useState<Y.UndoManager>();

	const userInfo = useSelf((me) => me.info);

	const ref = useCallback((node: HTMLElement | null) => {
		if (!node) return;
		setElement(node);
	}, []);

	useEffect(() => {
		if (!element || !room || !userInfo) {
			return;
		}

		const ydoc = provider.getYDoc();
		const ytext = ydoc.getText("codemirror");
		const undoManager = new Y.UndoManager(ytext);
		setYUndoManager(undoManager);

		provider.awareness.setLocalStateField("user", {
			name: userInfo.name,
			color: userInfo.color,
			colorLight: userInfo.color + "80", // 6-digit hex code at 50% opacity
		});

		const state = EditorState.create({
			doc: ytext.toString(),
			extensions: [
				basicSetup,
				javascript(),
				yCollab(ytext, provider.awareness, { undoManager }),
			],
		});

		const view = new EditorView({
			state,
			parent: element,
		});

		return () => {
			view?.destroy();
		};
	}, [element, room, userInfo]);

	return (
		<div className="flex flex-col relative rounded-xl bg-white w-full h-full text-gray-900 overflow-hidden">
			<div className="flex justify-between items-center">
				<div>
					{yUndoManager ? <Toolbar yUndoManager={yUndoManager} /> : null}
				</div>
				<Avatars />
			</div>
			<div className="relative flex-grow overflow-auto" ref={ref}></div>
		</div>
	);
}

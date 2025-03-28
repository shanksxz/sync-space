"use client";
import React, { useEffect, useState } from "react";

interface AnimatedCodeProps {
	className?: string;
}

export function AnimatedCode({ className }: AnimatedCodeProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [cursorPosition, setCursorPosition] = useState({ line: 0, char: 0 });
	const [editingUser, setEditingUser] = useState("user1");

	const codeLines = [
		'<div className="hero-section">',
		'  <h1 className="text-gradient">',
		"    Real-time Collaborative Coding",
		"  </h1>",
		'  <p className="description">',
		"    Work together seamlessly in real-time",
		"    with synchronized editing and instant",
		"    feedback.",
		"  </p>",
		"</div>",
	];

	useEffect(() => {
		setIsVisible(true);

		// Simulate cursor movement
		const interval = setInterval(() => {
			setCursorPosition((prev) => {
				const currentLine = prev.line;
				const currentChar = prev.char;

				// Calculate next position
				const lineText = codeLines[currentLine] || "";

				if (currentChar < lineText.length - 1) {
					return { line: currentLine, char: currentChar + 1 };
				} else if (currentLine < codeLines.length - 1) {
					return { line: currentLine + 1, char: 0 };
				} else {
					return { line: 0, char: 0 };
				}
			});

			// Switch editing user every 5 seconds
			if (Math.random() > 0.9) {
				setEditingUser((prev) => (prev === "user1" ? "user2" : "user1"));
			}
		}, 200);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className={`code-editor relative rounded-xl bg-gray-900 p-6 overflow-hidden ${className}`}
		>
			{/* Background elements */}
			<div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-4">
				<div className="flex space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
				</div>
				<div className="mx-auto text-xs text-gray-400">SyncSpace Editor</div>
			</div>

			{/* User avatars */}
			<div className="absolute top-2 right-4 flex -space-x-2">
				<div className="w-6 h-6 rounded-full bg-syncspace-blue flex items-center justify-center text-white text-xs z-10">
					U1
				</div>
				<div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
					U2
				</div>
			</div>

			{/* Code content with syntax highlighting */}
			<div className="pt-6 font-mono text-sm">
				{codeLines.map((line, i) => (
					<div key={i} className={`code-line code-line-${i + 1} flex`}>
						<span className="text-gray-500 w-6 text-right mr-3">{i + 1}</span>
						<span className="text-gray-300">
							{line.split("").map((char, j) => {
								// Apply colors based on syntax
								let colorClass = "text-gray-300"; // default text color

								if (
									char === "<" ||
									char === ">" ||
									char === "/" ||
									char === "="
								) {
									colorClass = "text-gray-400";
								} else if (line.substring(j).indexOf('"') === 0) {
									colorClass = "text-green-400";
								} else if (
									line.substring(j, j + 9) === "className" ||
									line.substring(j, j + 3) === "div" ||
									line.substring(j, j + 2) === "h1" ||
									line.substring(j, j + 1) === "p"
								) {
									colorClass = "text-blue-400";
								}

								// Check if this is the current cursor position and highlight the editing users's color
								const isCursorPosition =
									i === cursorPosition.line && j === cursorPosition.char;
								const userColor =
									editingUser === "user1"
										? "bg-syncspace-blue"
										: "bg-purple-500";

								return (
									<span
										key={j}
										className={`${colorClass} ${isCursorPosition ? `${userColor} bg-opacity-50` : ""}`}
									>
										{char}
										{isCursorPosition && <span className="cursor"></span>}
									</span>
								);
							})}
						</span>
					</div>
				))}
			</div>

			{/* Floating comments to simulate collaboration */}
			<div
				className={`absolute right-8 top-16 bg-syncspace-blue bg-opacity-90 text-white text-xs p-2 rounded transition-opacity duration-300 ${editingUser === "user1" ? "opacity-100" : "opacity-0"}`}
			>
				Adding hero section...
			</div>

			<div
				className={`absolute right-8 top-32 bg-purple-500 bg-opacity-90 text-white text-xs p-2 rounded transition-opacity duration-300 ${editingUser === "user2" ? "opacity-100" : "opacity-0"}`}
			>
				Let's use a gradient text here!
			</div>
		</div>
	);
}

import { useStorage } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";

interface TreeNode {
  name: string;
  isDirectory: boolean;
  children: Record<string, TreeNode>;
}

export function FileTree() {
  const files = useStorage(root => root.files) ?? new LiveMap();
  const fileTree = buildFileTree(files as LiveMap<string, any>);

  return (
    <div className="file-tree">
      {renderTree(fileTree)}
    </div>
  );
}

function buildFileTree(files: LiveMap<string, any>): Record<string, TreeNode> {
  const tree: Record<string, TreeNode> = {};
  
  Array.from(files.entries()).forEach(([path]) => {
    path.split("/").reduce((acc: Record<string, TreeNode>, part, index, parts) => {
      if (!acc[part]) {
        acc[part] = {
          name: part,
          isDirectory: index < parts.length - 1,
          children: {}
        };
      }
      return acc[part].children;
    }, tree);
  });

  return tree;
}

function renderTree(node: Record<string, TreeNode>) {
  return (
    <ul>
      {Object.values(node).map((item) => (
        <li key={item.name}>
          {item.isDirectory ? "📁" : "📄"} {item.name}
          {item.isDirectory && renderTree(item.children)}
        </li>
      ))}
    </ul>
  );
}

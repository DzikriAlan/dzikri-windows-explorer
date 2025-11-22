export interface TreeNode {
  id: string;
  parentId: string | null;
  name: string;
  isFolder: boolean;
  childrenIds: string[];
  hasMoreChildren?: boolean;
}

export interface TreeState {
  nodes: Record<string, TreeNode>;
  rootIds: string[];
  expanded: Set<string>;
  selected: Set<string>;
  loading: Set<string>;
}
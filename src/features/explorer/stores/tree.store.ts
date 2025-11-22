import { defineStore } from "pinia";
import { reactive } from "vue";

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

export const useTreeStore = defineStore("useTreeStore", () => {
    const state = reactive<TreeState>({
        nodes: {},
        rootIds: [],
        expanded: new Set(),
        selected: new Set(),
        loading: new Set(),
    });

    const findNode = (id: string) => {
        return state.nodes[id];
    };

    const isNodeExpanded = (id: string) => state.expanded.has(id);

    const isNodeSelected = (id: string) => state.selected.has(id);

    const isNodeIndeterminate = (id: string) => {
        const node = state.nodes[id];

        if (!node || !node.isFolder) return false;

        let hasSelected = false;
        let hasUnselected = false;

        for (const childId of node.childrenIds) {
            if (state.selected.has(childId)) hasSelected = true;
            else hasUnselected = true;
        }

        return hasSelected && hasUnselected;
    };

    const setNodes = (nodes: TreeNode[], parentId: string | null = null) => {
        nodes.forEach((node) => {
            state.nodes[node.id] = node;
        });

        if (parentId === null) {
            state.rootIds = nodes.map((n) => n.id);
        } else {
            state.nodes[parentId].childrenIds = nodes.map((n) => n.id);
        }
    };

    const toggleNodeExpand = (id: string) => {
        if (state.expanded.has(id)) {
            state.expanded.delete(id);
        } else {
            state.expanded.add(id);
        }
    };

    const toggleNodeSelect = (id: string) => {
        const isSelected = state.selected.has(id);

        if (isSelected) {
            unselectBranch(id);
        } else {
            selectBranch(id);
        }

        updateParentBranchState(id);
    };

    const selectBranch = (id: string) => {
        const traverse = (nodeId: string) => {
            state.selected.add(nodeId);

            const node = state.nodes[nodeId];
            node.childrenIds.forEach((child) => traverse(child));
        };

        traverse(id);
    };

    const unselectBranch = (id: string) => {
        const traverse = (nodeId: string) => {
            state.selected.delete(nodeId);

            const node = state.nodes[nodeId];
            node.childrenIds.forEach((child) => traverse(child));
        };

        traverse(id);
    };

    const updateParentBranchState = (id: string) => {
        let node = state.nodes[id];

        while (node && node.parentId) {
            const parent = state.nodes[node.parentId];

            const allSelected = parent.childrenIds.every((child) =>
                state.selected.has(child)
            );

            const noneSelected = parent.childrenIds.every(
                (child) => !state.selected.has(child)
            );

            if (allSelected) {
                state.selected.add(parent.id);
            } else if (noneSelected) {
                state.selected.delete(parent.id);
            } else {
                state.selected.delete(parent.id);
            }

            node = parent;
        }
    };

    return {
        state,

        findNode,
        isNodeExpanded,
        isNodeSelected,
        isNodeIndeterminate,

        setNodes,
        toggleNodeExpand,
        toggleNodeSelect,
    };
});
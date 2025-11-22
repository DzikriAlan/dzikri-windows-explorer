import { computed } from 'vue';
import { useTreeStore } from '../stores/tree.store';
import type { TreeNode } from '../types/tree.types';

export interface RenderedTreeNode extends TreeNode {
  level: number;
  isVisible: boolean;
  hasChildren: boolean;
  isLastChild: boolean;
  parentPath: string[];
}

export function useTreeRenderer() {
  const treeStore = useTreeStore();

  const flattenedTree = computed<RenderedTreeNode[]>(() => {
    const result: RenderedTreeNode[] = [];
    
    const traverse = (
      nodeIds: string[], 
      level: number = 0, 
      parentPath: string[] = [],
      parentExpanded: boolean = true
    ) => {
      nodeIds.forEach((nodeId, index) => {
        const node = treeStore.findNode(nodeId);
        if (!node) return;

        const isExpanded = treeStore.isNodeExpanded(nodeId);
        const hasChildren = node.childrenIds.length > 0;
        const isLastChild = index === nodeIds.length - 1;
        const currentPath = [...parentPath, nodeId];
        
        result.push({
          ...node,
          level,
          isVisible: parentExpanded,
          hasChildren,
          isLastChild,
          parentPath: currentPath,
        });

        if (hasChildren && isExpanded && parentExpanded) {
          traverse(node.childrenIds, level + 1, currentPath, true);
        }
      });
    };

    traverse(treeStore.state.rootIds);
    return result;
  });

  const visibleNodes = computed(() => {
    return flattenedTree.value.filter(node => node.isVisible);
  });

  const getNodesByLevel = (level: number) => {
    return flattenedTree.value.filter(node => node.level === level);
  };

  const getNodePath = (nodeId: string): RenderedTreeNode[] => {
    const node = flattenedTree.value.find(n => n.id === nodeId);
    if (!node) return [];

    const path: RenderedTreeNode[] = [];
    
    for (const pathNodeId of node.parentPath) {
      const pathNode = flattenedTree.value.find(n => n.id === pathNodeId);
      if (pathNode) {
        path.push(pathNode);
      }
    }
    
    return path;
  };

  const getNodeBreadcrumb = (nodeId: string): string[] => {
    const path = getNodePath(nodeId);
    return path.map(node => node.name);
  };

  const getNodeDepth = (nodeId: string): number => {
    const node = flattenedTree.value.find(n => n.id === nodeId);
    return node ? node.level : 0;
  };

  const getNextSibling = (nodeId: string): RenderedTreeNode | null => {
    const currentIndex = flattenedTree.value.findIndex(n => n.id === nodeId);
    if (currentIndex === -1) return null;

    const currentNode = flattenedTree.value[currentIndex];
    const nextNode = flattenedTree.value[currentIndex + 1];
    
    if (nextNode && nextNode.level === currentNode.level) {
      const currentParent = currentNode.parentPath[currentNode.parentPath.length - 2];
      const nextParent = nextNode.parentPath[nextNode.parentPath.length - 2];
      
      if (currentParent === nextParent) {
        return nextNode;
      }
    }
    
    return null;
  };

  const getPreviousSibling = (nodeId: string): RenderedTreeNode | null => {
    const currentIndex = flattenedTree.value.findIndex(n => n.id === nodeId);
    if (currentIndex <= 0) return null;

    const currentNode = flattenedTree.value[currentIndex];
    const prevNode = flattenedTree.value[currentIndex - 1];
    
    if (prevNode && prevNode.level === currentNode.level) {
      const currentParent = currentNode.parentPath[currentNode.parentPath.length - 2];
      const prevParent = prevNode.parentPath[prevNode.parentPath.length - 2];
      
      if (currentParent === prevParent) {
        return prevNode;
      }
    }
    
    return null;
  };

  const getChildNodes = (nodeId: string): RenderedTreeNode[] => {
    return flattenedTree.value.filter(node => {
      const parentId = node.parentPath[node.parentPath.length - 2];
      return parentId === nodeId;
    });
  };

  const getParentNode = (nodeId: string): RenderedTreeNode | null => {
    const node = flattenedTree.value.find(n => n.id === nodeId);
    if (!node || node.parentPath.length < 2) return null;
    
    const parentId = node.parentPath[node.parentPath.length - 2];
    return flattenedTree.value.find(n => n.id === parentId) || null;
  };

  const isNodeAncestor = (ancestorId: string, descendantId: string): boolean => {
    const descendantNode = flattenedTree.value.find(n => n.id === descendantId);
    if (!descendantNode) return false;
    
    return descendantNode.parentPath.includes(ancestorId);
  };

  const getTreeStatistics = () => {
    const stats = {
      totalNodes: flattenedTree.value.length,
      visibleNodes: visibleNodes.value.length,
      expandedNodes: Array.from(treeStore.state.expanded).length,
      selectedNodes: Array.from(treeStore.state.selected).length,
      maxDepth: 0,
      nodesByLevel: {} as Record<number, number>,
    };

    flattenedTree.value.forEach(node => {
      stats.maxDepth = Math.max(stats.maxDepth, node.level);
      stats.nodesByLevel[node.level] = (stats.nodesByLevel[node.level] || 0) + 1;
    });

    return stats;
  };

  return {
    flattenedTree,
    visibleNodes,
    
    getNodesByLevel,
    getNodePath,
    getNodeBreadcrumb,
    getNodeDepth,
    getNextSibling,
    getPreviousSibling,
    getChildNodes,
    getParentNode,
    isNodeAncestor,
    getTreeStatistics,
  };
}
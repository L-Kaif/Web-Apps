import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Clock, Heart, Crosshair } from 'lucide-react';
import { MemoryNode } from '@/types/memory';
import { Tooltip } from './tooltip';
import { useToast } from '@/hooks/use-toast';

interface ValuesSidebarProps {
  rootNode: MemoryNode;
  highlightedNodeId: string | null;
}

export function ValuesSidebar({ rootNode, highlightedNodeId }: ValuesSidebarProps) {
  const { toast } = useToast();

  const getResolvedValues = (node: MemoryNode, basePath: string = ''): Array<{
    node: MemoryNode;
    fullPath: string;
  }> => {
    const values: Array<{ node: MemoryNode; fullPath: string }> = [];
    
    if (node.value !== undefined) {
      values.push({
        node,
        fullPath: basePath + node.offset,
      });
    }

    if (node.children) {
      node.children.forEach(child => {
        values.push(...getResolvedValues(child, basePath + node.offset + ' '));
      });
    }

    return values;
  };

  const resolvedValues = getResolvedValues(rootNode, rootNode.offset + ' ');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: 'Address copied successfully',
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const formatValue = (value: any, type?: string) => {
    if (type === 'Vec3' && typeof value === 'object') {
      return (
        <div className="space-y-1">
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            X: <span className="text-accent-mint">{value.x}</span>
          </div>
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            Y: <span className="text-accent-mint">{value.y}</span>
          </div>
          <div className="font-mono text-sm text-gray-900 dark:text-white">
            Z: <span className="text-accent-mint">{value.z}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
        {value?.toString()}
      </div>
    );
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'float': return 'bg-primary/20 text-primary-purple';
      case 'int32': return 'bg-red-100 dark:bg-red-900/20 text-danger-red';
      case 'Vec3': return 'bg-green-100 dark:bg-green-900/20 text-accent-mint';
      case 'string': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600';
      case 'Array': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600';
    }
  };

  const totalOffsets = (node: MemoryNode): number => {
    let count = node.children ? node.children.length : 0;
    if (node.children) {
      node.children.forEach(child => {
        count += totalOffsets(child);
      });
    }
    return count;
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Copy className="h-4 w-4 text-accent-mint" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resolved Values</h3>
      </div>

      <div className="space-y-4">
        {resolvedValues.map(({ node, fullPath }, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`value-card bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer ${
              highlightedNodeId === node.id ? 'ring-2 ring-primary animate-pulse-soft' : ''
            }`}
            onClick={() => copyToClipboard(fullPath.trim())}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {node.name === 'Timer' && <Clock className="h-4 w-4 text-primary-purple" />}
                {node.name === 'Health' && <Heart className="h-4 w-4 text-danger-red" />}
                {node.name === 'Position' && <Crosshair className="h-4 w-4 text-accent-mint" />}
                {!['Timer', 'Health', 'Position'].includes(node.name) && (
                  <div className={`h-2 w-2 rounded-full ${node.color.replace('text-', 'bg-')}`} />
                )}
                <span className="font-medium text-gray-900 dark:text-white">{node.name}</span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-mono ${getTypeColor(node.valueType)}`}>
                {node.valueType || 'unknown'}
              </span>
            </div>
            
            <div className="space-y-2">
              <Tooltip content="Click to copy to clipboard">
                <div className="font-mono text-sm text-gray-600 dark:text-gray-400 break-all">
                  Address: <span className={node.color}>{fullPath.trim()}</span>
                </div>
              </Tooltip>
              
              {formatValue(node.value, node.valueType)}
              
              {node.description && (
                <div className="text-xs text-gray-500">
                  {node.description}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Memory Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: resolvedValues.length * 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Memory Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Base Address:</span>
              <span className="font-mono text-primary-purple">{rootNode.offset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Offsets:</span>
              <span className="font-mono text-gray-900 dark:text-white">{totalOffsets(rootNode)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Resolved:</span>
              <span className="font-mono text-accent-mint">{resolvedValues.length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

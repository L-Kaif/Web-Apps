import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Cpu, Globe, Users, User, Clock, Heart, Crosshair, Shield, Database, Settings, Gamepad2, Box, Map, Target, Type, Users as UsersIcon, Package, Layout, MapPin, Sun, Server, Activity, Hash, MemoryStick, ShieldCheck, DollarSign, Timer, Hand, Utensils, Star, Zap, Sprout, Image, Layers, Volume2, Play, VolumeX, Radio, Boxes, FileSignature, Key, CheckCircle, Link, Wifi, Network, Send, Download, AlertTriangle, Gauge, RefreshCw, List, RotateCcw, Lock, Code, Shuffle, Award, Calendar, Monitor, Palette, Triangle, Square, Anchor, ArrowUp, ArrowDown, Battery, Sword } from 'lucide-react';
import { MemoryNode } from '@/types/memory';
import { Tooltip } from './tooltip';

interface MemoryTreeProps {
  rootNode: MemoryNode;
  onNodeHover: (nodeId: string | null) => void;
}

const iconMap = {
  Cpu, Globe, Users: UsersIcon, User, Clock, Heart, Crosshair, Shield, Database, Settings, Gamepad2, Box, Map, Target, Type, Package, Layout, MapPin, Sun, Server, Activity, Hash, MemoryStick, ShieldCheck, DollarSign, Timer, Hand, Utensils, Star, Zap, Sprout, Image, Layers, Volume2, Play, VolumeX, Radio, Boxes, FileSignature, Key, CheckCircle, Link, Wifi, Network, Send, Download, AlertTriangle, Gauge, RefreshCw, List, RotateCcw, Lock, Code, Shuffle, Award, Calendar, Monitor, Palette, Triangle, Square, Anchor, ArrowUp, ArrowDown, Battery, Sword,
  // Missing icon fallbacks
  Seedling: Sprout,
  Waveform: Radio,
  Cube: Boxes,
  Checkmark: CheckCircle
};

export function MemoryTree({ rootNode, onNodeHover }: MemoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([rootNode.id, ...(rootNode.children?.filter(child => child.isExpanded).map(child => child.id) || [])])
  );

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: MemoryNode, level: number = 0) => {
    const IconComponent = iconMap[node.icon as keyof typeof iconMap] || Cpu;
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const hasValue = node.value !== undefined;

    return (
      <div key={node.id} className="tree-node">
        <motion.div
          whileHover={{ scale: 1.01, backgroundColor: 'var(--muted)' }}
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
            hasValue ? 'hover:bg-primary/5' : 'hover:bg-muted'
          }`}
          style={{ marginLeft: level * 24 }}
          onClick={() => hasChildren && toggleNode(node.id)}
          onMouseEnter={() => hasValue && onNodeHover(node.id)}
          onMouseLeave={() => hasValue && onNodeHover(null)}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-4 h-4"
            >
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </motion.div>
          )}
          {!hasChildren && level > 0 && (
            <div className="w-4 h-4 tree-line" />
          )}
          
          <IconComponent className={`h-4 w-4 ${node.color}`} />
          
          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {node.name}
          </span>
          
          <span className="font-mono text-xs text-gray-500">
            {node.offset}
          </span>
          
          {hasValue && (
            <Tooltip content={node.description || 'Memory value'}>
              <span className={`ml-auto font-mono text-xs ${node.color} font-medium`}>
                → {formatValue(node.value, node.valueType)}
              </span>
            </Tooltip>
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children!.map(child => renderNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const formatValue = (value: any, type?: string): string => {
    if (type === 'Vec3' && typeof value === 'object') {
      return 'Vec3';
    }
    if (type === 'Array') {
      return value.toString();
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return value?.toString() || '';
  };

  return (
    <div className="space-y-1">
      {renderNode(rootNode)}
    </div>
  );
}

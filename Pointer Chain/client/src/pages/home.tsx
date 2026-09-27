import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MemoryStick, Moon, Sun } from 'lucide-react';
import { ProcessSelector } from '@/components/process-selector';
import { MemoryTree } from '@/components/memory-tree';
import { ValuesSidebar } from '@/components/values-sidebar';
import { useTheme } from '@/components/theme-provider';
import { processes, generateMemoryTree } from '@/lib/memory-data';
import { Process } from '@/types/memory';

export default function Home() {
  const [selectedProcess, setSelectedProcess] = useState<Process>(processes[1]); // Default to csgo.exe
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const memoryTree = generateMemoryTree(selectedProcess.name);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-primary-purple" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pointer Explorer
                </h1>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">v2.1.0</div>
            </div>

            <div className="flex items-center space-x-4">
              <ProcessSelector
                selectedProcess={selectedProcess}
                onProcessSelect={setSelectedProcess}
              />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Memory Tree Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MemoryStick className="h-4 w-4 text-primary-purple" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Memory Structure
              </h2>
              <div className="text-sm text-gray-500 font-mono">
                Base: {memoryTree.offset}
              </div>
            </div>

            <MemoryTree
              rootNode={memoryTree}
              onNodeHover={setHighlightedNodeId}
            />
          </div>
        </motion.div>

        {/* Values Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ValuesSidebar
            rootNode={memoryTree}
            highlightedNodeId={highlightedNodeId}
          />
        </motion.div>
      </div>
    </div>
  );
}

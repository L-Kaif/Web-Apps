import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings, Gamepad2, Box } from 'lucide-react';
import { processes } from '@/lib/memory-data';
import { Process } from '@/types/memory';
import { Tooltip } from './tooltip';

interface ProcessSelectorProps {
  selectedProcess: Process;
  onProcessSelect: (process: Process) => void;
}

const processIcons = {
  Settings,
  Gamepad2,
  Box,
};

export function ProcessSelector({ selectedProcess, onProcessSelect }: ProcessSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleProcessSelect = (process: Process) => {
    onProcessSelect(process);
    setIsOpen(false);
  };

  const IconComponent = processIcons[selectedProcess.icon as keyof typeof processIcons];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <IconComponent className="h-4 w-4 text-primary-purple" />
        <span className="text-sm font-medium font-mono">{selectedProcess.name}</span>
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"
            >
              <div className="p-2">
                {processes.map((process) => {
                  const ProcessIcon = processIcons[process.icon as keyof typeof processIcons];
                  const isSelected = process.name === selectedProcess.name;
                  
                  return (
                    <Tooltip
                      key={process.name}
                      content={process.isDangerous ? 'Potentially dangerous process - highlighted in red' : `Process ID: ${process.pid}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''
                        }`}
                        onClick={() => handleProcessSelect(process)}
                      >
                        <div className="flex items-center space-x-3">
                          <ProcessIcon className={`h-4 w-4 ${
                            process.isDangerous 
                              ? 'text-danger-red' 
                              : process.name === 'csgo.exe' 
                                ? 'text-primary-purple' 
                                : 'text-gray-400'
                          }`} />
                          <div>
                            <div className={`text-sm font-medium font-mono ${
                              process.isDangerous ? 'text-danger-red' : 'text-gray-900 dark:text-white'
                            }`}>
                              {process.name}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              PID: {process.pid}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Tooltip>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

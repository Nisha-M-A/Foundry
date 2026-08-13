import { motion } from 'framer-motion';

const KanbanCard = ({ task }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-md text-[10px] text-gray-700 dark:text-gray-300 shadow-sm mb-2 last:mb-0 break-words transition-colors"
    >
      {task}
    </motion.div>
  );
};

export default KanbanCard;

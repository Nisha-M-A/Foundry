import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

const stages = ["planning", "working", "completed"];

const KanbanBoard = ({ status, tasks = [], role }) => {
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState(0);
  const totalTasks = tasks?.length || 0;
  useEffect(() => {
    if (status === 'thinking') {
      setStage(0);
      setCount(0);
      
      const t1 = setTimeout(() => setStage(1), 800);
      
      // Fake counter while thinking
      const t2 = setInterval(() => {
        setCount(c => c + 1);
      }, 1500);
      
      return () => {
        clearTimeout(t1);
        clearInterval(t2);
      };
    } else if (status === 'completed') {
      setStage(2);
      
      const targetCount = totalTasks;
      
      setCount(c => {
        if (c > targetCount) return targetCount;
        return c;
      });
      
      const intervalId = setInterval(() => {
        setCount(c => {
          if (c < targetCount) return c + 1;
          clearInterval(intervalId);
          return c;
        });
      }, 150);
      
      return () => clearInterval(intervalId);
    } else {
      setStage(0);
      setCount(0);
    }
  }, [status, totalTasks]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 w-full"
    >

      <div className="grid grid-cols-3 gap-2 w-full">

        {stages.map((name, index) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-500/5 backdrop-blur-sm p-2 h-16 flex flex-col items-center justify-between overflow-hidden"
          >

            <span className="text-[9px] uppercase tracking-wider text-gray-500 truncate w-full text-center px-0.5">
              {name}
            </span>

            <div className="h-8 flex items-center justify-center">

              {stage === index && (
                <motion.div
                  layoutId={`planner-chip-${role}`}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                  animate={
                    stage === 2
                      ? {
                        scale: [1, 1.15, 1],
                      }
                      : {}
                  }
                >
                  <Hexagon
                    size={18}
                    className={`fill-violet-500 stroke-violet-400 transition-all duration-500 ${stage === 2
                      ? "drop-shadow-[0_0_15px_rgba(139,92,246,1)] scale-110"
                      : ""
                      }`}
                  />
                </motion.div>
              )}

            </div>

          </div>
        ))}

      </div>

      <motion.p
        key={count}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-center text-[11px] text-gray-500 dark:text-gray-400"
      >
        Generated{" "}
        <span className="font-semibold text-violet-400">
          {count}
        </span>{" "}
        planning task{count === 1 ? "" : "s"}
      </motion.p>

    </motion.div>
  );
};

export default KanbanBoard;
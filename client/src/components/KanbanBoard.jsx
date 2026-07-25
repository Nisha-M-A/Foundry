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
    <div className="mt-4">

      <div className="grid grid-cols-3 gap-2">

        {stages.map((name, index) => (
          <div
            key={name}
            className="rounded-lg border border-gray-800 bg-gray-950 p-2 h-16 flex flex-col items-center justify-between"
          >

            <span className="text-[9px] uppercase tracking-wider text-gray-500">
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
                    className={`fill-violet-500 stroke-violet-400 ${stage === 2
                      ? "drop-shadow-[0_0_10px_rgba(139,92,246,0.9)]"
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
        className="mt-3 text-center text-[11px] text-gray-400"
      >
        Generated{" "}
        <span className="font-semibold text-violet-400">
          {count}
        </span>{" "}
        planning task{count === 1 ? "" : "s"}
      </motion.p>

    </div>
  );
};

export default KanbanBoard;
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-[32px] p-6 pb-12 z-[101] shadow-2xl overflow-hidden",
              className
            )}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            {title && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            )}
            
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

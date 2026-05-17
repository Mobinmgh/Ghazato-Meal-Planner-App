import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { QUESTIONS } from "@/src/lib/constants";
import { storage } from "@/src/lib/storage";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  const currentQuestion = QUESTIONS[step];

  const handleSelect = (value: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finish(newAnswers);
    }
  };

  const handleNextNumber = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finish(answers);
    }
  };

  const finish = (finalAnswers: any) => {
    storage.setProfile(finalAnswers);
    navigate("/plan");
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-12 pt-8 rtl flex flex-col">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </button>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                step >= idx ? "w-6 bg-primary-600" : "w-2 bg-gray-200"
              )} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex-1"
        >
          <h2 className="text-3xl font-bold mb-2">{currentQuestion.question}</h2>
          <p className="text-gray-500 mb-6">{currentQuestion.subtitle}</p>

          {currentQuestion.type === "options" && (
            <div className="space-y-4">
              {currentQuestion.options?.map((opt: any) => (
                <Card
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex items-center gap-4 cursor-pointer hover:border-primary-500 transition-colors",
                    answers[currentQuestion.id] === opt.value ? "border-primary-600 bg-primary-50" : ""
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">
                    {opt.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{opt.label}</h4>
                    <p className="text-sm text-gray-400">{opt.sub}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {currentQuestion.type === "number" && (
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="number"
                  className="w-full h-20 text-4xl font-black text-center bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary-500"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                  autoFocus
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  {currentQuestion.unit}
                </span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleNextNumber}
                disabled={!answers[currentQuestion.id]}
              >
                ادامه
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          )}

          {currentQuestion.type === "dual_number" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  className="w-full h-16 text-2xl font-black text-center bg-gray-50 
                    rounded-2xl border-none focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder={currentQuestion.placeholders?.[0]}
                  value={answers["weight"] || ""}
                  onChange={(e) => setAnswers({...answers, weight: e.target.value})}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  className="w-full h-16 text-2xl font-black text-center bg-gray-50 
                    rounded-2xl border-none focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder={currentQuestion.placeholders?.[1]}
                  value={answers["targetWeight"] || ""}
                  onChange={(e) => setAnswers({...answers, targetWeight: e.target.value})}
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleNextNumber}
                disabled={!answers["weight"] || !answers["targetWeight"]}
              >
                ادامه
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          )}

          {currentQuestion.type === "text_input" && (
            <div className="space-y-4">
              <textarea
                className="w-full h-36 text-base text-right bg-gray-50 
                  rounded-2xl border-none focus:ring-2 focus:ring-primary-500 
                  outline-none p-4 resize-none leading-relaxed font-medium
                  placeholder:text-gray-300"
                placeholder={currentQuestion.placeholder}
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => setAnswers({
                  ...answers, 
                  [currentQuestion.id]: e.target.value
                })}
              />
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleNextNumber}
                >
                  ادامه
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <button
                  onClick={handleNextNumber}
                  className="w-full py-3 text-sm font-bold text-gray-400 
                  hover:text-gray-600 transition-colors"
                >
                  رد کردن
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

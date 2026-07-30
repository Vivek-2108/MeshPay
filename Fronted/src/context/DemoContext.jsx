import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const [demoMode, setDemoMode] = useState(() => {
    const saved = localStorage.getItem('demoMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('demoStep');
    return saved !== null ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('demoMode', JSON.stringify(demoMode));
  }, [demoMode]);

  useEffect(() => {
    localStorage.setItem('demoStep', currentStep.toString());
  }, [currentStep]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetDemo = () => setCurrentStep(1);

  return (
    <DemoContext.Provider
      value={{
        demoMode,
        setDemoMode,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        resetDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface WizardProgressProps {
    currentStep: number
    steps: { title: string; icon?: React.ReactNode }[]
    onStepClick?: (step: number) => void
}

export function WizardProgress({ currentStep, steps, onStepClick }: WizardProgressProps) {
    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    // Can click if: step is completed (index < currentStep)
                    const isClickable = index < currentStep && onStepClick

                    return (
                        <div key={index} className="flex items-center flex-1 last:flex-none">
                            {/* Step Circle */}
                            <div className="relative flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick(index)}
                                    disabled={!isClickable}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                                        index < currentStep
                                            ? "bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                                            : index === currentStep
                                                ? "bg-pink-600 text-white ring-4 ring-pink-200 cursor-default"
                                                : "bg-gray-200 text-gray-500 cursor-default"
                                    )}
                                >
                                    {index < currentStep ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        index
                                    )}
                                </button>
                                <span
                                    className={cn(
                                        "absolute -bottom-6 text-xs font-medium whitespace-nowrap",
                                        index <= currentStep ? "text-pink-600" : "text-gray-400",
                                        isClickable && "cursor-pointer hover:underline"
                                    )}
                                    onClick={() => isClickable && onStepClick(index)}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-1 mx-2 rounded transition-all duration-300",
                                        index < currentStep ? "bg-pink-600" : "bg-gray-200"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

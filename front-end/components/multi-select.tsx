"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxHeight?: string;
  className?: string;
  error?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  loading = false,
  maxHeight = "max-h-60",
  className = "",
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map((v) => options.find((opt) => opt.value === v)?.label || v);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full min-h-[42px] px-3 py-2 text-left bg-white border rounded-lg 
          focus:outline-none focus:ring-2 transition-colors
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }
          ${
            disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {getSelectedLabels().map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value[index]);
                      }}
                      disabled={disabled}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Options list */}
          <div className={`${maxHeight} overflow-y-auto`}>
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                No options available
              </div>
            ) : (
              <div className="py-1">
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={`
                        w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                        ${
                          isSelected
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-900"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  loading = false,
  className = "",
  error,
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white border rounded-lg 
          focus:outline-none focus:ring-2 transition-colors
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }
          ${
            disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : options.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    ${
                      value === option.value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

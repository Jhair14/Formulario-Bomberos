import React, { useState } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  disabled = false,
  className = ''
}) => {
  const allowDecimal = !Number.isInteger(step);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Aceptar coma como separador decimal y validar número
    const normalized = newValue.replace(',', '.');
    const numValue = allowDecimal ? parseFloat(normalized) : parseInt(normalized, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Al perder el foco, validar y corregir el valor
    const normalized = inputValue.replace(',', '.');
    const numValue = allowDecimal ? parseFloat(normalized) : parseInt(normalized, 10);
    if (isNaN(numValue) || numValue < min) {
      const correctedValue = min;
      onChange(correctedValue);
      setInputValue(correctedValue.toString());
    } else if (numValue > max) {
      const correctedValue = max;
      onChange(correctedValue);
      setInputValue(correctedValue.toString());
    } else {
      onChange(numValue);
      setInputValue(numValue.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir números y teclas de control; el punto decimal sólo si allowDecimal y no existe ya
    if (/[0-9]/.test(e.key) ||
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'Tab' ||
        e.key === 'Enter') {
      return;
    }
    if ((e.key === '.' || e.key === ',') && allowDecimal && !inputValue.includes('.') && !inputValue.includes(',')) {
      return;
    }
    e.preventDefault();
  };

  // Sincronizar el inputValue cuando cambie el value desde fuera
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        -
      </button>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="w-16 h-12 bg-white border-2 border-gray-300 rounded-lg text-center text-gray-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        inputMode="numeric"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
};

export default NumberInput; 
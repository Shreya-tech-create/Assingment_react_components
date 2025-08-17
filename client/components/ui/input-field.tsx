import * as React from "react";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: string;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  loading?: boolean;
  id?: string;
  className?: string;
  onClear?: () => void;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    className,
    value,
    onChange,
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    variant = 'outlined',
    size = 'md',
    type = 'text',
    showClearButton = false,
    showPasswordToggle = false,
    loading = false,
    id,
    onClear,
    ...props 
  }, ref) => {
    const [inputType, setInputType] = React.useState(type);
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
      setInputType(showPassword ? 'password' : 'text');
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // Size variants
    const sizeClasses = {
      sm: "h-8 px-2 text-xs",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base"
    };

    // Variant classes
    const variantClasses = {
      filled: "bg-muted border-transparent focus-visible:bg-background",
      outlined: "bg-background border-input",
      ghost: "bg-transparent border-transparent hover:bg-muted focus-visible:bg-muted"
    };

    const inputClasses = cn(
      "flex w-full rounded-md ring-offset-background transition-colors",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      sizeClasses[size],
      variantClasses[variant],
      {
        "border-destructive focus-visible:ring-destructive": invalid || errorMessage,
        "pr-20": showClearButton && showPasswordToggle && value,
        "pr-10": (showClearButton && value && !showPasswordToggle) || (showPasswordToggle && !showClearButton),
        "pr-8": loading
      },
      className
    );

    const labelClasses = cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      {
        "text-destructive": invalid || errorMessage
      }
    );

    const helperTextClasses = cn(
      "text-xs mt-1",
      {
        "text-destructive": invalid || errorMessage,
        "text-muted-foreground": !invalid && !errorMessage
      }
    );

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            className={inputClasses}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-invalid={invalid || !!errorMessage}
            aria-describedby={
              helperText || errorMessage ? `${inputId}-description` : undefined
            }
            ref={ref}
            {...props}
          />
          
          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {/* Clear button and password toggle */}
          {!loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {showClearButton && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear input"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {(helperText || errorMessage) && (
          <p id={`${inputId}-description`} className={helperTextClasses}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField, type InputFieldProps };

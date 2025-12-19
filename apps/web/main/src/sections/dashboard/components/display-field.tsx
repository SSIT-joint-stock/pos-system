interface DisplayFieldProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
  value?: React.ReactNode;
}

export function DisplayField({ label, className = '', children, value }: DisplayFieldProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg ${className}`}>
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-semibold text-pos-blue-500">{label}</h1>
        {value}
      </div>
      <div>{children}</div>
    </div>
  );
}

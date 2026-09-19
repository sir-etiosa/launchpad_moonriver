const base =
  "inline-flex items-center justify-center rounded-sharp border px-6 py-3 text-base font-semibold tracking-tight transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40";

const variants = {
  primary:
    "border-gold bg-gold text-ink hover:border-gold-deep hover:bg-gold-deep",
  secondary:
    "border-rule-strong bg-transparent text-paper hover:border-paper/45 hover:bg-white/[0.03]",
  ghost: "border-transparent bg-transparent text-quiet hover:text-paper",
};

export default function Button({
  as,
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const Tag = as || (rest.href ? "a" : "button");

  return (
    <Tag className={`${base} ${variants[variant] ?? ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

const base =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent px-[1.35rem] py-[0.82rem] font-semibold text-ink no-underline transition duration-200 ease-out hover:-translate-y-px";

const variants = {
  primary:
    "bg-linear-to-br from-purple to-cyan shadow-[0_16px_36px_rgba(99,230,255,0.28)]",
  secondary: "border-line bg-white/[0.02]",
  ghost: "border-line bg-white/[0.02]",
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

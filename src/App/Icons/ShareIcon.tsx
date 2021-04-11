export const ShareIcon = ({
  color,
  style,
  className,
}: {
  style?: any;
  className?: string;
  color: string;
}) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <circle fill={color} cx={25} cy={50} r={18} />
    <circle fill={color} cx={100 - 25} cy={20} r={18} />
    <circle fill={color} cx={100 - 25} cy={100 - 20} r={18} />
    <line
      x1={25}
      x2={100 - 25}
      y1={50}
      y2={20}
      stroke={color}
      strokeWidth={10}
    />
    <line
      x1={25}
      x2={100 - 25}
      y1={50}
      y2={100 - 20}
      stroke={color}
      strokeWidth={10}
    />
  </svg>
);

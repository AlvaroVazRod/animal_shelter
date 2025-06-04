export const PawBtton = () => {
  return (
    <button
      className="w-38 h-28 p-2 rounded-full bg-transparent hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Dedos */}
        <circle cx="10" cy="35" r="10" fill="#D97236" />
        <circle cx="35" cy="18" r="12" fill="#D97236" />
        <circle cx="65" cy="18" r="12" fill="#D97236" />
        <circle cx="90" cy="35" r="10" fill="#D97236" />

        {/* Almohadilla */}
        <ellipse cx="50" cy="55" rx="35" ry="25" fill="#D97236" />
        {/* Texto */}
        <text 
          x="50" 
          y="55" 
          fill="white" 
          fontSize="10" 
          fontWeight="bold"
          textAnchor="middle" 
          dominantBaseline="middle"
        >
          Registrarse
        </text>
      </svg>
    </button>
  );
};
export default PawBtton;

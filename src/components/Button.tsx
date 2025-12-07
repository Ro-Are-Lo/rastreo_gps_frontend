// COMPONENTE REUTILIZABLE
// Aquí van elementos UI genéricos (botones, inputs, tarjetas).
// Son independientes de un ViewModel específico.



type ButtonProps = {
  text: string;
  onClick: () => void;
};

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      style={{ padding: "8px 12px", margin: "4px", cursor: "pointer" }}
    >
      {text}
    </button>
  );
}

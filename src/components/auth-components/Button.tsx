interface ButtonProps {
  type: "submit" | "button" | "reset";
  disabled: boolean;
  text: string;
}
const Button = ({ type, disabled, text }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full h-[55px] bg-linear-to-r from-[#FFBFA4] text-white to-[#ADE2FE] shadow-[0_4px_8px_rgba(0,0,0,0.2)] font-inter font-medium rounded-full bg-white flex-col">
      <span className="drop-shadow-[0_0_5px_rgba(0,0,0,0.4)] text-lg">
        {text}
      </span>
    </button>
  );
};

export default Button;

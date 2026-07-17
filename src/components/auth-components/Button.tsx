interface ButtonProps {
  type: 'submit' | 'button' | 'reset';
  disabled: boolean;
  text: string;
}
const Button = ({ type, disabled, text }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="font-inter h-[55px] w-full flex-col rounded-full bg-white bg-linear-to-r from-[#FFBFA4] to-[#ADE2FE] font-medium text-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
    >
      <span className="text-lg drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]">
        {text}
      </span>
    </button>
  );
};

export default Button;

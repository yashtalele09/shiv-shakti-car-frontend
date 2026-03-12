const Input = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="flex w-full h-[50px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-full bg-white flex-col">
      <input
        type="text"
        id="name"
        className="w-full pl-4 text-xl font-inter h-full rounded-full bg-white"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

const Input = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="flex h-[50px] w-full flex-col rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
      <input
        type="text"
        id="name"
        className="font-inter h-full w-full rounded-full bg-white pl-4 text-xl"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

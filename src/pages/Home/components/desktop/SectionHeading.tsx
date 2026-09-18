interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <div className="flex w-full max-w-md items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-300" />
        <h2 className="text-2xl font-bold tracking-wide whitespace-nowrap text-neutral-900 md:text-3xl">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-300" />
      </div>
    </div>
  );
};
export default SectionHeading;

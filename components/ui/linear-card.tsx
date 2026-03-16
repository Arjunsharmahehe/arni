export const LinearCard = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => {
  return (
    <div
      className={`
              flex flex-col items-center gap-12 w-96 px-8 py-6
              border border-neutral-900 rounded-md
              md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-none md:py-0
              ${isLast ? "md:border-r-0" : "md:border-r md:border-neutral-900"}
            `}
    >
      {children}
    </div>
  );
};

export const LinearCardHeading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="font-medium">{children}</h3>;
};

export const LinearCardSubheading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-neutral-500 text-balance">{children}</p>;
};

export const LinearCardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col text-neutral-50 text-[12px] gap-2">
      {children}
    </div>
  );
};

export const LinearCardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="hidden md:block text-neutral-600 text-[8px] font-mono w-full">
      {children}
    </p>
  );
};

export const LinearCardSVGContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="overflow-hidden w-72 h-56">{children}</div>;
};

export const LinearCardImageContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="overflow-hidden w-72 h-56 relative">{children}</div>;
};

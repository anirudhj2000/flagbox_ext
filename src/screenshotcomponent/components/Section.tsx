import React, { forwardRef, LegacyRef } from "react";

interface CursorProps {
  ref: LegacyRef<HTMLDivElement>;
}
const Section = ({ ref }: CursorProps) => {
  return (
    <div
      ref={ref}
      className=" absolute bg-red-200/70 border-[1px] border-red-300 rounded-full"
    ></div>
  );
};

export default Section;

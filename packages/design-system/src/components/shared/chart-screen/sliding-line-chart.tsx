/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useRef, useState } from 'react';
export default function SlidingTabs({
  data,
  onChangeTypeData,
}: {
  data: {
    name: string;
    value: string;
  }[];
  onChangeTypeData: (value: string) => void;
}) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const btn = containerRef.current?.querySelectorAll<HTMLButtonElement>('button')[active];
    if (btn && indicatorRef.current) {
      indicatorRef.current.style.width = `${btn.offsetWidth}px`;
      indicatorRef.current.style.transform = `translateX(${btn.offsetLeft - 3}px)`;
    }
  }, [active]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex w-fit rounded-sm p-1 overflow-x-auto border border-gray-50 bg-gray-50/100"
      >
        <div
          ref={indicatorRef}
          className="absolute top-1 bottom-1 bg-white  rounded-sm shadow-xl shadow-pos-blue-100 transition-all duration-300 border border-pos-blue-200"
        />
        {data.map((item, i) => (
          <button
            key={item.name}
            onClick={() => {
              onChangeTypeData(item.value);
              setActive(i);
            }}
            className={`relative cursor-pointer z-10 px-5 py-1 text-center text-xs font-medium whitespace-nowrap  ${
              active === i ? 'text-pos-blue-700' : 'text-gray-500 hover:text-pos-blue-700 '
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
}

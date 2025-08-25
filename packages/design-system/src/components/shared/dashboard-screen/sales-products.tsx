"use-client";
import { useEffect, useRef, useState } from "react";
import Image from "next/Image";
export function SalesProducts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a ResizeObserver for the container
    const observer = new ResizeObserver((entries) => {
      // eslint-disable-next-line prefer-const
      for (let entry of entries) {
        const width = entry.contentRect.width;

        // Dynamically control columns based on container width

        if (width < 700 && width >= 400) setCols(3);
        else if (width < 1000 && width >= 500) setCols(4);
        else if (width >= 1000) setCols(5);
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center overflow-hidden ">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
        className=" gap-5 w-full h-full p-5 overflow-y-scroll   "
      >
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>{" "}
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>{" "}
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>{" "}
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>{" "}
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>{" "}
        <div className="card aspect-[3/4]">
          <div className="relative bg-white w-full h-[65%] overflow-hidden ">
            <Image src={"/bo-huc.jpg"} alt="" width={500} height={500} />
            <div className="bg-pos-blue-600 rounded-xl text-white w-fit bottom-2 left-2 px-3 py-2 h-fit absolute">
              <p>12.000VND</p>
            </div>
          </div>
          <div className="flex flex-col gap-2  w-full h-[fit] p-2">
            <p>Bo Huc - 355ml</p>
            <p>Ma SP - 23001921</p>
            <button className="w-full h-fit px-2 py-1 bg-pos-blue-600 rounded-xl text-white">Nhan de them</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function Features() {
  return (
    <section className="">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <dl className="grid grid-cols-1 gap-8 py-16 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+20K</dt>
            <dd className="mt-1 text-sm text-gray-500">Trusted Retails</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+50K</dt>
            <dd className="mt-1 text-sm text-gray-500">Customers</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+400K</dt>
            <dd className="mt-1 text-sm text-gray-500">Review</dd>
          </div>
        </dl>

        {/* Row 1: image left, text right */}
        <div className="grid items-center gap-10 pb-10 pt-6 md:grid-cols-2">
          <Placeholder />
          <div>
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              one place for <br className="hidden sm:block" />
              everything you need
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS provides a variety of your business needs, from menu
              management with various platforms, easily and quickly.
            </p>
          </div>
        </div>

        {/* Row 2: text left, image right */}
        <div className="grid items-center gap-10 py-12 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              You can settings <br className="hidden sm:block" />
              anywhere and anytime
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS is very easy to use, because EraPOS can be accessed
              anywhere, anytime on various devices in one account.
            </p>
          </div>
          <Placeholder />
        </div>
      </div>
    </section>
  );
}

/** Simple gray image placeholder (swap with your <Image> later) */
function Placeholder() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-200">
      {/* 16:9 ratio box */}
      <div className="aspect-[16/9] w-full" />
      {/* Optional icon mark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 16l5-5 4 4 5-6 4 5" />
        </svg>
      </div>
    </div>
  );
}

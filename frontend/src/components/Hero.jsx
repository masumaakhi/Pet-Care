import { FaPaw, FaHandHoldingHeart } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[85vh] bg-cover bg-center sm:pt-[92px] md:pt-[96px]"
      style={{
        backgroundImage: `url(https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142446/hero_f3f9pu.jpg?auto=format,compress&w=1600)`,
      }}
    >
      {/* overlay for readability */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/25" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pb-16
                      pt-24 sm:pt-32 md:pt-32 lg:pt-0
                      grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        {/* LEFT */}
        <div className="flex flex-col justify-center text-center lg:text-left lg:py-[90px]">
          <h1 className="font-bold leading-tight
                         text-3xl sm:text-5xl md:text-5xl lg:text-6xl
                         bg-gradient-to-r from-orange-500 via-stone-700 to-black
                         bg-clip-text text-transparent">
            Caring for Every <br className="hidden sm:block" /> Paw & Whisker
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 lg:text-gray-700 max-w-md mx-auto lg:mx-0">
            Nurturing pets with love, care and compassion for a healthier life.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button className="w-full sm:w-auto relative flex items-center justify-center gap-2
                               bg-gradient-to-r from-green-500 to-green-700
                               px-5 sm:px-6 py-3 rounded-[15px] shadow
                               hover:from-green-600 hover:to-green-800
                               transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-300/30 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaPaw className="relative z-10 text-white" />
              <span className="relative z-10 text-white font-semibold text-sm sm:text-base">
                Find Pets for Adoption
              </span>
            </button>

            <button className="w-full sm:w-auto relative flex items-center justify-center gap-2
                               bg-gradient-to-r from-orange-500 to-orange-700
                               px-5 sm:px-6 py-3 rounded-[15px] shadow
                               hover:from-orange-600 hover:to-orange-800
                               transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-orange-300/30 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaHandHoldingHeart className="relative z-10 text-white" />
              <span className="relative z-10 text-white font-semibold text-sm sm:text-base">
                Request Rescue
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT side blank রাখলেও সমস্যা নাই */}
        {/* চাইলে এখানে future এ image/illustration বসাতে পারো */}
      </div>
    </section>
  );
};

export default HeroSection;
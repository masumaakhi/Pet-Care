import {
    FaPaw,
    FaFirstAid,
    FaHandHoldingHeart,
    FaCalendarCheck,
    FaDonate,
} from "react-icons/fa";

import herobg from "../assets/hero.jpg"


const HeroSection = () => {
    return (
        <section
            className="relative min-h-[85vh] bg-cover bg-center"
            style={{
                backgroundImage: `
      url(${herobg})
    `,
            }}
        >
            {/* Content */}
            <div className="mx-auto max-w-8xl px-6 py-16 grid lg:px-12 lg:pb-2 lg:grid-cols-2 gap-10 items-center">

                {/* LEFT */}
                <div className="flex flex-col justify-center lg:py-[90px]">
                    <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-orange-500 via-stone-700 via-white-100 to-black-100 bg-clip-text text-transparent">
                        Caring for Every <br /> Paw & Whisker
                    </h1>

                    <p className="mt-4 text-gray-700 text-medium max-w-md">
                        Nurturing pets with love, care and compassion for a healthier life.
                    </p>


                    {/* Buttons */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <button className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 px-6 py-3 rounded-[15px] shadow hover:from-green-600 hover:to-green-800 transition-all duration-300 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-300/30 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <FaPaw className="relative z-10 bg-gradient-to-r from-white via-green-50 to-white bg-clip-text text-transparent" />
                            <span className="relative z-10 bg-gradient-to-r from-white via-green-50 to-white bg-clip-text text-transparent font-semibold">
                                Find Pets for Adoption
                            </span>
                        </button>

                        <button className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-3 rounded-[15px] shadow hover:from-orange-600 hover:to-orange-800 transition-all duration-300 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-orange-300/30 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <FaHandHoldingHeart className="relative z-10 bg-gradient-to-r from-white via-orange-50 to-white bg-clip-text text-transparent" />
                            <span className="relative z-10 bg-gradient-to-r from-white via-orange-50 to-white bg-clip-text text-transparent font-semibold">
                                Request Rescue
                            </span>
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE
                <div className="relative flex justify-center items-end h-full">
                    <img
                        src={heropet}
                        alt="Pet Care"
                        className="w-full max-w-lg lg:max-w-xl object-contain align-bottom"
                        style={{ marginBottom: '-2px' }} // একদম নিচের বর্ডারের সাথে মিশিয়ে দিতে
                    />
                </div> */}
            </div>

        </section>
    );
};



export default HeroSection;

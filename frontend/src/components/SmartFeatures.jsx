import { useEffect, useState } from "react";
import { FaSearch, FaHeart, FaTruck, FaDonate } from "react-icons/fa";

/* ✅ Imgix CDN images */
const lostFoundImg =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142887/lost-found_ceyojl.png?auto=format,compress&w=600";
const adoptionImg =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142897/adoption_yayyae.png?auto=format,compress&w=600";
const servicesImg =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142954/services_tbjght.png?auto=format,compress&w=600";
const donateImg =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142911/donate_twm6oo.png?auto=format,compress&w=600";
const donateDog =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142932/donate-dog_blmnye.png?auto=format,compress&w=700";
const volunteerCat =
  "https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142971/volunteer-cat_fj3dns.png?auto=format,compress&w=700";

export default function SmartFeatures() {
  return (
    <section className="py-16">
      <h2 className="text-center text-2xl font-semibold text-[#5a6b3f] mb-12">
        ───────────────────── Smart Features of Pet-Care ─────────────────────
      </h2>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <GlassCard
          icon={<FaSearch />}
          image={lostFoundImg}
          title="Lost & Found Pets"
          desc="Boost the search success rate. Community-driven experiences."
        />

        <GlassCard
          icon={<FaHeart />}
          image={adoptionImg}
          title={<Counter to={250} suffix="+" />}
          desc="Successful Adoptions. Pets found loving homes."
        />

        <GlassCard
          icon={<FaTruck />}
          image={servicesImg}
          title="Find Pet Services"
          desc="Grooming, vets, training & trusted services."
        />

        <GlassCard
          icon={<FaDonate />}
          image={donateImg}
          title="Donate & Support"
          desc="Help rescue and care for animals in need."
        />
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-2 gap-6 px-6">
        <CTA
          title="Support Our Mission"
          text="Help Us Save More Lives!"
          button="Donate Now →"
          bgImage={donateDog}
          color="orange"
        />

        <CTA
          title="Looking to Volunteer?"
          text="Make a Difference for Pets in Need."
          button="Join as Volunteer →"
          bgImage={volunteerCat}
          color="green"
        />
      </div>
    </section>
  );
}

/* ================= Components ================= */

function GlassCard({ icon, image, title, desc }) {
  return (
    <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/55 border border-white/40 shadow-lg hover:shadow-xl transition">
      
      {/* ✅ Image wrapper with responsive aspect ratio */}
      <div className="w-full aspect-[16/10] md:aspect-[16/9] bg-white/40">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* ✅ Content */}
      <div className="p-4 sm:p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[#5a6b3f] text-xl sm:text-2xl leading-none flex items-center">
            {icon}
          </span>
          <h4 className="font-semibold text-base sm:text-lg text-[#5a6b3f] leading-none">
            {title}
          </h4>
        </div>

        <p className="text-sm text-gray-700">{desc}</p>
      </div>
    </div>
  );
}

/* Number Counter */
function Counter({ to, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.ceil(to / 60);

    const interval = setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [to]);

  return (
    <span className="text-lg font-bold text-[#5a6b3f]">
      {count}
      {suffix}
    </span>
  );
}

const CTA = ({ title, text, button, bgImage, color }) => {
  const colors = {
    orange: "bg-orange-500 hover:bg-orange-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-[#fdf7ee] border border-white/60 shadow-lg">
      {/* ✅ Mobile/Tablet: column | ✅ Desktop(lg+): row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-5 sm:p-6">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-[55%]">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h3>

          <p className="text-sm sm:text-base text-gray-700 mt-2">
            {text}
          </p>

          <button
            className={`mt-4 px-5 py-2.5 rounded-lg text-white text-sm font-medium ${colors[color]}`}
          >
            {button}
          </button>
        </div>

        {/* ✅ IMAGE */}
        {/* Mobile/Tablet: bottom full width */}
        {/* Desktop: right side fixed box */}
        <div className="w-full lg:w-[45%]">
          <div className="w-full rounded-xl bg-white/40 overflow-hidden aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/9]">
            <img
              src={bgImage}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
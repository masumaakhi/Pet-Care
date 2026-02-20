import { useEffect, useState } from "react";
import { FaSearch, FaHeart, FaTruck, FaDonate } from "react-icons/fa";

/* ✅ Imgix CDN images */
const lostFoundImg =
  "https://6971273ec0356527951e30fc.imgix.net/lost-found.png?auto=format,compress&w=600";
const adoptionImg =
  "https://6971273ec0356527951e30fc.imgix.net/adoption.png?auto=format,compress&w=600";
const servicesImg =
  "https://6971273ec0356527951e30fc.imgix.net/services.png?auto=format,compress&w=600";
const donateImg =
  "https://6971273ec0356527951e30fc.imgix.net/donate.png?auto=format,compress&w=600";
const donateDog =
  "https://6971273ec0356527951e30fc.imgix.net/donate-dog.png?auto=format,compress&w=700";
const volunteerCat =
  "https://6971273ec0356527951e30fc.imgix.net/volunteer-cat.png?auto=format,compress&w=700";

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
    <div className="rounded-2xl p-5 text-center backdrop-blur-xl bg-white/55 border border-white/40 shadow-lg hover:shadow-xl transition">
      <img src={image} alt="" className="w-60 h-55 mx-auto object-contain mb-3" />

      <div className="text-[#5a6b3f] text-2xl mb-2 flex justify-center">
        {icon}
      </div>

      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{desc}</p>
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
    <div className="flex items-center justify-between rounded-2xl bg-[#fdf7ee] border border-white/60 shadow-lg h-36 px-6 overflow-hidden">
      {/* LEFT CONTENT */}
      <div className="max-w-[60%]">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-700 mb-3">{text}</p>

        <button className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${colors[color]}`}>
          {button}
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <img src={bgImage} alt="" className="h-full max-w-[40%] object-contain" />
    </div>
  );
};
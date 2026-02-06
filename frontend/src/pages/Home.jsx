// import { motion } from "framer-motion";

// // import React, { useContext } from "react";


// export default function Home() {
//   return (
//     <main className="px-6 md:px-16">

//       {/* HERO */}
//       <section className="grid md:grid-cols-2 gap-8 items-center py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             Caring for Every <br /> Paw & Whisker
//           </h1>
//           <div className="flex gap-4">
//             <button className="bg-primary text-white px-6 py-3 rounded-full">
//               Find Pets for Adoption
//             </button>
//             <button className="bg-accent text-white px-6 py-3 rounded-full">
//               Request Rescue
//             </button>
//           </div>
//         </motion.div>

//         <motion.img
//           src="/hero.png"
//           className="rounded-3xl shadow-lg"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//         />
//       </section>

//       {/* QUICK ACTIONS */}
//       <section className="grid grid-cols-2 md:grid-cols-5 gap-4 my-10">
//         {[
//           "Adopt a Pet",
//           "Rescue a Pet",
//           "Pet Health Care",
//           "Book Pet Services",
//           "Donate & Support",
//         ].map((item) => (
//           <motion.div
//             whileHover={{ y: -8 }}
//             className="bg-white p-4 rounded-2xl shadow text-center font-medium"
//             key={item}
//           >
//             {item}
//           </motion.div>
//         ))}
//       </section>

//       {/* FEATURE CARDS */}
//       <section className="grid md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-3xl p-6 shadow">
//           <h3 className="font-semibold mb-3">Pets for Adoption</h3>
//           <p>Find loving pets waiting for a home.</p>
//         </div>

//         <div className="bg-white rounded-3xl p-6 shadow">
//           <h3 className="font-semibold mb-3">Urgent Rescue Alerts</h3>
//           <button className="mt-4 bg-accent text-white px-4 py-2 rounded-full">
//             Report a Rescue
//           </button>
//         </div>

//         <div className="bg-white rounded-3xl p-6 shadow">
//           <h3 className="font-semibold mb-3">Health Tips & Advice</h3>
//           <ul className="list-disc ml-5">
//             <li>Vaccination Reminders</li>
//             <li>Litter Training Tips</li>
//             <li>Seasonal Care</li>
//           </ul>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="text-center my-16">
//         <h2 className="text-2xl font-semibold mb-8">How It Works</h2>
//         <div className="grid md:grid-cols-3 gap-6">
//           {["Find & Adopt", "Request Rescue", "Smart Pet Care"].map(
//             (step, i) => (
//               <motion.div
//                 key={step}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-white p-6 rounded-3xl shadow"
//               >
//                 <div className="text-primary text-xl font-bold mb-2">
//                   {i + 1}
//                 </div>
//                 {step}
//               </motion.div>
//             )
//           )}
//         </div>
//       </section>

//       {/* SUPPORT */}
//       <section className="grid md:grid-cols-2 gap-6 mb-16">
//         <div className="bg-accent text-white rounded-3xl p-8">
//           <h3 className="text-xl font-semibold mb-4">
//             Support Our Mission
//           </h3>
//           <button className="bg-white text-accent px-6 py-2 rounded-full">
//             Donate Now
//           </button>
//         </div>

//         <div className="bg-primary text-white rounded-3xl p-8">
//           <h3 className="text-xl font-semibold mb-4">
//             Looking to Volunteer?
//           </h3>
//           <button className="bg-white text-primary px-6 py-2 rounded-full">
//             Join as Volunteer
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }

import React from 'react'
import Hero from '../components/Hero'
import SmartFeatures from '../components/SmartFeatures'
import SecondHero from '../components/SecondHero'

function Home() {
  return (
    <div>
      <Hero />
      <SecondHero />
      <SmartFeatures />
    </div>
  )
}

export default Home

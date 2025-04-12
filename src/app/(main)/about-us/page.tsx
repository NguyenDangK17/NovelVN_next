import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaDiscord,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    position: "Founder & CEO",
    bio: "Passionate about manga and novels for over 15 years. Founded MangaVN to create a community for fans.",
    image:
      "https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Content Director",
    bio: "Former editor at major publishing houses. Brings 10+ years of experience in content curation.",
    image:
      "https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg",
  },
  {
    id: 3,
    name: "Mike Johnson",
    position: "Community Manager",
    bio: "Expert in building and nurturing online communities. Makes sure our users have the best experience.",
    image:
      "https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg",
  },
  {
    id: 4,
    name: "Sarah Williams",
    position: "Technical Lead",
    bio: "Full-stack developer with a passion for creating seamless user experiences.",
    image:
      "https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg",
  },
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-[#191a1c] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About MangaVN
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Your ultimate destination for manga and novel discussions,
                reviews, and community.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-[#2c2c2c] rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 text-lg leading-relaxed">
                At MangaVN, we're passionate about bringing manga and novel
                enthusiasts together. Our platform serves as a hub for
                discussions, reviews, and recommendations, fostering a vibrant
                community of readers and fans.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mt-4">
                We believe in the power of storytelling and aim to connect
                people through their shared love for manga and novels. Our goal
                is to create an inclusive space where everyone can discover new
                stories and connect with fellow enthusiasts.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-64 relative rounded-lg overflow-hidden">
                <Image
                  src="https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg"
                  alt="Our mission"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#2c2c2c] rounded-lg overflow-hidden"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary-500 mb-3">{member.position}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#2c2c2c] rounded-lg p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">
                10K+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">
                5K+
              </div>
              <div className="text-gray-400">Manga Titles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">
                3K+
              </div>
              <div className="text-gray-400">Novel Titles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">
                50K+
              </div>
              <div className="text-gray-400">Forum Posts</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#2c2c2c] rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-primary-500 mt-1 mr-3 text-xl" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-400">
                      123 Manga Street, Novel City, 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-primary-500 mt-1 mr-3 text-xl" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-400">contact@mangavn.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-primary-500 mt-1 mr-3 text-xl" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-400">+1 (123) 456-7890</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-primary-500 text-2xl"
                  >
                    <FaFacebook />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-primary-500 text-2xl"
                  >
                    <FaTwitter />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-primary-500 text-2xl"
                  >
                    <FaInstagram />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-primary-500 text-2xl"
                  >
                    <FaDiscord />
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-[#212328] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-[#212328] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-[#212328] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

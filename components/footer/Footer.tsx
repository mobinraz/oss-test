
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-[#0b1120] text-gray-400 py-16 px-6 overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image src={"/mci-logo.png"} width={353} height={143} alt="" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            OSS<span className="text-cyan-500"> MCI</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Leading the future of telecommunication operations. Providing
            cutting-edge OSS solutions for global connectivity.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg relative w-fit">
            Quick Links
            <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-cyan-500 rounded-full" />
          </h3>
          <ul className="flex flex-col gap-3">
            {["Home", "Services", "About Us", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-all" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg relative w-fit">
            Vendors
            <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-cyan-500 rounded-full" />
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["Huawei", "Ericsson", "ZTE", "Nokia", "Cisco", "Samsung"].map(
              (vendor) => (
                <a
                  key={vendor}
                  href="#"
                  className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-center"
                >
                  {vendor}
                </a>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg relative w-fit">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-cyan-500 rounded-full" />
          </h3>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="text-cyan-500">
                <MapPin size={18} />
              </div>
              <span>Tehran, Iran , Tohid</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-cyan-500">
                <Phone size={18} />
              </div>
              <span className="ltr">+98 21 8888 0000</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-cyan-500">
                <Mail size={18} />
              </div>
              <span>support@oss-mci.ir</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase">
        <p>© {currentYear} OSS TEAM. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

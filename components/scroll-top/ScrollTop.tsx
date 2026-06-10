import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 p-3 cursor-pointer bg-blue-500/60 text-white rounded-full shadow-lg hover:bg-blue-400 transition z-50"
        >
          <ArrowUp className="text-white" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;

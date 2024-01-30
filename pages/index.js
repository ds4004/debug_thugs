import Image from "next/image";
// import { Inter } from "next/font/google";

import { useRouter } from 'next/router';
import { useState } from 'react';

// import levelButtons from './levelButtons';
// const inter = Inter({ subsets: ["latin"] });


const Home = () => {
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
console.log(showButtons)
  const id = 1;
  const handlePracticeClick = () => {
    
    // setShowButtons(false);
    router.push(`/practice/1`, null, { shallow: true });
  };
  const handleLearnClick = () => {
    // Navigate to the courses.js page
    router.push(`/courselearning/courses`, null, { shallow: true });
 };

 const handleChanllengeClick = () => {
  // Navigate to the courses.js page
  router.push(`/challenge`, null, { shallow: true });
};
  // export default function Home() {
  return (
    <div className="homecontainer">
      <h1 className="heading">SignCraft </h1>
      <h1 className="heading1">Academy</h1>
      <p className="description">We are developing an educational website where users can learn, practice, and engage in challenges to master sign languages. This platform empowers individuals to communicate effectively with the Deaf community. Join us in fostering inclusivity through interactive lessons and fun challenges that enhance sign language proficiency.</p>

      {!showButtons ? (
        <button className="button-letsGO" onClick={()=>setShowButtons(true)}>
          Lets GO
        </button>
      ) : (
        <div>
          <button className="button-new"onClick={handleLearnClick}>Learn!</button>
          <button className="button-new" onClick={handlePracticeClick} >Practice</button>
          <button className="button-new" onClick={handleChanllengeClick}>Challenge</button>
        </div>
      )}
    </div>

  );
};
export default Home;

import React from 'react'
import { Notes } from "./Notes";
const Home = (props) => {
 const {showAlert} = props;
  return (
    <div className=" conatainer">
   
    <Notes showAlert={showAlert}/>
    </div>
  );
};

export default Home;

import { useState } from "react";


export default function Home() {

  const [layoutName, setLayoutName] = useState('layoutB');

  let Layout = require(`../../layouts/${layoutName}`).default;
  return (
    <>
    <div>
      <button onClick={()=>setLayoutName("layoutA")} >layoutA</button>
      <button onClick={()=>setLayoutName("layoutB")}>layoutB</button>
      <div>
        <Layout name={"hello"} />
      </div>
    </div>
    </>
  );
}



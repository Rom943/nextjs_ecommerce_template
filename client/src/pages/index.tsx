


type HomeProps = {
  layoutName: string;
}

export default function Home({layoutName}:HomeProps) {

  let Layout = require(`../../layouts/${layoutName}/pages/index.tsx`).default;
  return (
    <>
    <div style={{height:"100%"}}>
      <Layout />
    </div>
    </>
  );
}

export async function getServerSideProps(){

  return{
    props:{
      layoutName: "art",
    }
  }
}



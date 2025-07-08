import { title } from "process";



type HomeProps = {
  defualtLayout: string;
}

export default function Home({defualtLayout}:HomeProps) {

  let Layout = require(`../../layouts/${defualtLayout}/pages/index.tsx`).default;
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
      defualtLayout: "fitness",
      page:{
        header:{
          customLayout:"",
          cart:{
            customLayout:"",
          },
          siteLogo:{
            logoUrl:"https://res.cloudinary.com/djnx5kuvx/image/upload/v1750349561/postgresql_l81wha.png",
          },
          position: "fixed",
          navMenu:{
            customLayout:"",
            navLinks: [
            {
              main: { link: "category_product_archive/shirts", title: "shirts" },
              sub: [
                { link: "category_product_archive/men-shirts", title: "men shirts",sub:[{title:"long sleeve",link:"category_product_archive/long-sleeve-shirts"},{title:"short sleeve",link:"category_product_archive/short-sleeve-shirts"}] },
                { link: "category_product_archive/women-shirts", title: "women shirts",sub:[{title:"long sleeve",link:"category_product_archive/long-sleeve-shirts"},{title:"short sleeve",link:"category_product_archive/short-sleeve-shirts"}] },
              ]
            },
            {
              main: { link: "category_product_archive/pants", title: "pants" },
              sub: [
                { link: "category_product_archive/shorts", title: "shorts"},
                 { link: "category_product_archive/jeans", title: "jeans" }]
            }
          ]
          },
          searchBar: {
            customLayout: "",
          },
        }
      }
    }
  }
}



import { useRouter } from "next/router";

export default function category_product_archive() {
  const router = useRouter();
  const { slug } = router.query;
  
  return (
    <div>
      <h1>category_product_archive Page</h1>
      <h2>Slug: {slug}</h2>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
}

export async function getServerSideProps(){

  return{
    props:{
      layoutName: "fitness",
      page:{
        header:{
          position: "relative",
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
        }
      }
    }
  }
}

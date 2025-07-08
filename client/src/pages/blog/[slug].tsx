import { useRouter } from "next/router";

export default function category_post_archive() {
  const router = useRouter();
  const { slug } = router.query;
  
  return (
    <div>
      <h1>category_post_archive Page</h1>
      <h2>Slug: {slug}</h2>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
}

export async function getServerSideProps(){

  return{
    props:{
      layoutName: "art",
      page:{
        header:{
          position: "relative",
          navLinks: [
            {
              main: { link: "category_product_archive/shirts", title: "shirts" },
              sub: [
                { link: "category_product_archive/men-shirts", title: "men shirts" },
                { link: "category_product_archive/women-shirts", title: "women shirts" },
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

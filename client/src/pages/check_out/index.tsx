

export default function check_out() {

  
  return (
    <div>
      <h1>check_out Page</h1>
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

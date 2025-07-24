import { title } from "process";
import type { GetServerSideProps } from "next";



export default function Home(props: { defualtLayout: string, page: any }) {
  const { defualtLayout, page } = props;

  let Layout = require(`../../layouts/${defualtLayout}/pages/index.tsx`).default;
  return (
    <>
    <div style={{height:"100%"}}>
      <Layout page={page} defualtLayout={defualtLayout} />
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return{
    props:{
      defualtLayout: "fitness",
      page:{
        header:{
          backgroundColor: "gold",
          customLayout:"",
          cart:{
            customLayout:"",
          },
          siteLogo:{
            logoUrl:"https://res.cloudinary.com/djnx5kuvx/image/upload/v1750349561/postgresql_l81wha.png",
          },
          position: "fixed",
          navMenu:{
            fontColor:"black",
            subMenuBackgroundColor:"white",
            direction:"rtl",
            customLayout:"",
            navLinks: [
            {
              main: { link: "category_product_archive/shirts", title: "חולצות" },
              sub: [
                { link: "category_product_archive/men-shirts", title: "חולצות גברים",sub:[{title:"שרבול ארוך",link:"category_product_archive/long-sleeve-shirts"},{title:"שרבול קצר",link:"category_product_archive/short-sleeve-shirts"}] },
                { link: "category_product_archive/women-shirts", title: "חולצות נשים",sub:[{title:"שרבול ארוך",link:"category_product_archive/long-sleeve-shirts"},{title:"שרבול קצר",link:"category_product_archive/short-sleeve-shirts"}] },
              ]
            },
            {
              main: { link: "category_product_archive/pants", title: "מכנסיים" },
              sub: [
                { link: "category_product_archive/shorts", title: "שורטים"},
                 { link: "category_product_archive/jeans", title: "ג'ינסים" }]
            }
          ]
          },
          searchBar: {
            customLayout: "",
          },
        },
        heroCarusel:{
          customLayout: "",
          autoPlay: true,
          autoPlayInterval: 5000,
          heroSlides:[
            {
              backgroundUrl: "https://picsum.photos/id/239/1080/600",
              title: "FEAR NOTHING PACK",
              description: "Step up when it matters most.",
              buttonText: "Shop",
              buttonLink: "/products/shoes",
              backgroundType: "image" as "image"
            },
            {
              backgroundUrl: "https://picsum.photos/id/287/1080/600",
              title: "JUST DO IT",
              description: "Your perfect workout companion.",
              buttonText: "Explore",
              buttonLink: "/collections/workout",
              backgroundType: "image" as "image"
            }
          ]
        },
        categoryCarusel:{
          customLayout: "",
          title:"חפשו בחנות",
          categorySlides: [
            {
              title: "חולצות",
              description: "Explore our collection of stylish shirts.",
              imageUrl: "https://picsum.photos/id/1015/400/300",
              link: "/category_product_archive/shirts"
            },
            {
              title: "מכנסיים",
              description: "Find the perfect pants for any occasion.",
              imageUrl: "https://picsum.photos/id/1016/400/300",
              link: "/category_product_archive/pants"
            },
            {
              title: "חולצות",
              description: "Explore our collection of stylish shirts.",
              imageUrl: "https://picsum.photos/id/1012/400/300",
              link: "/category_product_archive/shirts"
            },
                        {
              title: "חולצות",
              description: "Explore our collection of stylish shirts.",
              imageUrl: "https://picsum.photos/id/1013/400/300",
              link: "/category_product_archive/shirts"
            },
                        {
              title: "חולצות",
              description: "Explore our collection of stylish shirts.",
              imageUrl: "https://picsum.photos/id/1014/400/300",
              link: "/category_product_archive/shirts"
            },
          ]
        },
        productCarusel: {
          defualtLayout: "fitness",
          customLayout: "",
          title: "מוצרים פופולריים",
          discountBadgeColor: "yellow",
          discountBadgeTextColor: "black",
          headerTextColor: "black",
          headerFontSize: "50px",
          headerBackgroundColor: "black",
          productCards: [
            {
              imageUrls: ["https://picsum.photos/id/1018/200/300", "https://picsum.photos/id/1019/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod1",
              title: "חולצה אדומה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt"
            },
            {
              imageUrls: ["https://picsum.photos/id/1020/200/300", "https://picsum.photos/id/1021/200/300"],
              productAttributes: { מידה: "L", צבע: "Blue" },
              productId: "prod2",
              title: "חולצה כחולה",
              price: 89.99,
              link: "/products/blue-shirt"
            },
                        {
              imageUrls: ["https://picsum.photos/id/1023/200/300", "https://picsum.photos/id/1012/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod3",
              title: "חולצה כתומה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt"
            },
            {
              imageUrls: ["https://picsum.photos/id/1045/200/300", "https://picsum.photos/id/1024/200/300"],
              productAttributes: { מידה: "L", צבע: "Blue" },
              productId: "prod4",
              title: "חולצה ירוקה",
              price: 89.99,
              link: "/products/blue-shirt"
            },
                        {
              imageUrls: ["https://picsum.photos/id/1067/200/300", "https://picsum.photos/id/1043/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod5",
              title: "חולצה צהובה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt"
            },
            {
              imageUrls: ["https://picsum.photos/id/1078/200/300", "https://picsum.photos/id/1054/200/300"],
              productAttributes: { מידה: "L", color: "Blue" },
              productId: "prod6",
              title: "חולצה לבנה",
              price: 89.99,
              link: "/products/blue-shirt"
            },
          ]
        },
        productGrid:{
          defualtLayout: "fitness",
          customLayout: "",
          title: "מוצרים חדשים",
          discountBadgeColor: "yellow",
          discountBadgeTextColor: "black",
          productCards: [
            {
              imageUrls: ["https://picsum.photos/id/1080/200/300", "https://picsum.photos/id/1081/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod7",
              title: "חולצה אדומה חדשה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt-new"
            },
            {
              imageUrls: ["https://picsum.photos/id/1082/200/300", "https://picsum.photos/id/1083/200/300"],
              productAttributes: { מידה: "L", צבע: "Blue" },
              productId: "prod9",
              title: "חולצה כחולה חדשה",
              price: 89.99,
              link: "/products/blue-shirt-new"
            },
                        {
              imageUrls: ["https://picsum.photos/id/1080/200/300", "https://picsum.photos/id/1081/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod15",
              title: "חולצה אדומה חדשה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt-new"
            },
            {
              imageUrls: ["https://picsum.photos/id/1082/200/300", "https://picsum.photos/id/1083/200/300"],
              productAttributes: { מידה: "L", צבע: "Blue" },
              productId: "prod16",
              title: "חולצה כחולה חדשה",
              price: 89.99,
              link: "/products/blue-shirt-new"
            },
                        {
              imageUrls: ["https://picsum.photos/id/1080/200/300", "https://picsum.photos/id/1081/200/300"],
              productAttributes: { מידה: "M", צבע: "Red" },
              productId: "prod13",
              title: "חולצה אדומה חדשה",
              price: 99.99,
              discount: 10,
              link: "/products/red-shirt-new"
            },
            {
              imageUrls: ["https://picsum.photos/id/1082/200/300", "https://picsum.photos/id/1083/200/300"],
              productAttributes: { מידה: "L", צבע: "Blue" },
              productId: "prod81",
              title: "חולצה כחולה חדשה",
              price: 89.99,
              link: "/products/blue-shirt-new"
            }
          ]
        },
        footer: {
          defaultLayout: "fitness",
          customLayout: "",
          backgroundColor: "black",
          textColor: "white",
          fontSize: "14px",
          position: "relative",
          siteLogoUrl: "https://res.cloudinary.com/djnx5kuvx/image/upload/v1750349561/postgresql_l81wha.png",
          siteLogoAltText: "Site Logo",
          siteLogoSize: { width: "100px", height: "50px" },
          socialSection: {
            title: "עקבו אחרינו",
            links: [
              { name: "Facebook", url: "https://facebook.com", icon: "facebook-icon.png" },
              { name: "Instagram", url: "https://instagram.com", icon: "instagram-icon.png" },
              { name: "Twitter", url: "https://twitter.com", icon: "twitter-icon.png" }
            ]
          },
          linksSection:{
            title:"קישורים שימושיים",
            links:[
              {name:"אודותינו",url:"/about"},
              {name:"צור קשר",url:"/contact"},
              {name:"מדיניות פרטיות",url:"/privacy-policy"}
            ]
          },
          contactSection:{
            title:"צור קשר",
            links:[
              {name:"דוא\"ל", url:"mailto:example@example.com"},
              {name:"טלפון", url:"tel:+123456789"}
            ]
          },
          categorySection:{
            title:"קטגוריות",
            links:[
              {name:"ביגוד", url:"/category/clothing"},
              {name:"נעליים", url:"/category/shoes"},
              {name:"אקססוריז", url:"/category/accessories"}
            ]
          }
        }
      }
    }
  }
}






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

//category_product_archive, product_category_archive, product_page, post_page, post_category_archive, category_post_archive
//"check_out", "user_login", "user_register", "user_dashboard", "admin_login", "admin_dashboard"

// $folders = @("check_out", "user_login", "user_register", "user_dashboard", "admin_login", "admin_dashboard")

// $folders | ForEach-Object { 
//     # Create the folder
//     New-Item -ItemType Directory -Path $_ -Force
    
//     # Create index.tsx file with content
//     $content = @"


// export default function $($_)() {

  
//   return (
//     <div>
//       <h1>$($_) Page</h1>
//     </div>
//   );
// }
// "@
//     $content | Out-File -LiteralPath "$_\index.tsx" -Encoding UTF8
// }
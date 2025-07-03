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

//"category_product_archive", "product_category_archive", "product_page", "post_page", "post_category_archive", "category_post_archive"
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

// $mainFolders = @("art", "technology", "food", "travel", "health", "education", "entertainment", "business", "lifestyle", "finance", "real_estate", "automotive", "beauty", "fitness", "gaming", "music", "photography")

// $mainFolders | ForEach-Object {
//     $mainFolder = $_
    
//     # Create main folder and subfolders
//     New-Item -ItemType Directory -Path "$mainFolder\pages" -Force
//     New-Item -ItemType Directory -Path "$mainFolder\styles" -Force
    
//     # Create page components
//     $pageComponents = @("store", "product_category_archive", "product_page", "post_page", "post_category_archive", "blog", "check_out", "user_login", "user_register", "user_dashboard")
    
//     $pageComponents | ForEach-Object {
//         $pageContent = @"
// import styles from '../styles/$($_).module.css';

// export default function $mainFolder$($_)() {
//   return (
//     <div className={styles.container}>
//       <h1>$mainFolder $($_) Page</h1>
//       <p>Welcome to the $mainFolder $($_) section</p>
//     </div>
//   );
// }
// "@
//         $pageContent | Out-File -LiteralPath "$mainFolder\pages\$($_).tsx" -Encoding UTF8
        
//         # Create corresponding CSS module
//         $cssContent = @"
// .container {
//   padding: 2rem;
//   max-width: 1200px;
//   margin: 0 auto;
// }

// .container h1 {
//   color: #333;
//   margin-bottom: 1rem;
// }

// .container p {
//   color: #666;
//   line-height: 1.6;
// }
// "@
//         $cssContent | Out-File -LiteralPath "$mainFolder\styles\$($_).module.css" -Encoding UTF8
//     }
// }



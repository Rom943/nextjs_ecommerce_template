﻿import { useRouter } from "next/router";

export default function product_category_archive() {
  const router = useRouter();
  const { slug } = router.query;
  
  return (
    <div>
      <h1>product_category_archive Page</h1>
      <h2>Slug: {slug}</h2>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
}

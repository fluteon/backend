import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchHomepageCategoryProducts, findProducts } from "../Redux/Customers/Product/Action";

import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";

const categoriesToFetch = [
  { name: "formal_pants", label: "Formal Pants" },
  { name: "kurti", label: "Kurti's" },
  { name: "satin_shirts", label: "Satin Shirts" },3
];

const Homepage = () => {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    const fetchCategoryData = async () => {
      for (const category of categoriesToFetch) {
        try {
          const reqData = {
            category: category.name,
            pageNumber: 1,
            pageSize: 10,
          };

const actionResult = await dispatch(fetchHomepageCategoryProducts(reqData));

          console.log("actionResult...",actionResult )
          const data = actionResult;

          setCategoryData((prev) => ({
            ...prev,
            [category.name]: data?.content || [],
          }));
        } catch (error) {
          console.error(`Error fetching category "${category.name}":`, error);
        }
      }
    };

    fetchCategoryData();
  }, [dispatch]);

  return (
    <div>
      <HomeCarousel images={homeCarouselData} />
      <div className="space-y-10 py-20">
        {categoriesToFetch.map((cat) => (
          <HomeProductSection
            key={cat.name}
            section={cat.label}
            data={categoryData[cat.name]}
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;

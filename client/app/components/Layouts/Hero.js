"use client";
import Link from "next/link";
import { useGetHeroDataQuery } from "../../redux/features/layout/layoutApi";
import Loader from "../Loader/Loader";
import { Button } from "../ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Hero = () => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Hero */}
            <div className="container py-24 lg:py-32">
              {/* Grid */}
              <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
                <div className="lg:col-span-3">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {data?.layout?.banner.title}
                  </h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    {data?.layout?.banner.subTitle}
                  </p>
                  <div className="mt-5 lg:mt-8 flex flex-col sm:items-center gap-2 sm:flex-row sm:gap-3">
                    <div className="w-full max-w-lg  lg:w-auto">
                      <Button size={"lg"}>
                        <Link href='/courses'>
                        View Courses
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {/* Brands */}
                  <div className="mt-6 lg:mt-12">
                    <span className="text-xs font-medium uppercase">Contact us on:</span>
                    <div className="flex justify-start items-center space-x-8">
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-10 h-10" />
                      </a>
                      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-12 h-12" />
                      </a>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-10 h-10" />
                      </a>
                    </div>
                  </div>
                  {/* End Brands */}
                </div>
                {/* End Col */}
                <div className="lg:col-span-4 mt-10 lg:mt-0">
                  <img
                    className="w-full rounded-xl"
                    src={data?.layout?.banner?.image?.url}
                    alt="Image Description"
                  />
                </div>
                {/* End Col */}
              </div>
              {/* End Grid */}
            </div>
            {/* End Hero */}
          </>
        )
      }
    </>
  );
}
export default Hero;

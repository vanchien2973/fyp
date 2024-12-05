import React, { useState, useEffect } from 'react';
import { useGetAllUserCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Slider } from "../ui/slider"
import { Card, CardContent } from "../ui/card"
import { Search, SlidersHorizontal } from "lucide-react"
import CourseCard from '../Layouts/CourseCard';
import { Label } from '../ui/label';
import Loader from '../Loader/Loader';
import { useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"
import Link from 'next/link';

const AllCourses = () => {
  const { data, isLoading } = useGetAllUserCoursesQuery({});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  useEffect(() => {
    if (data?.courses && categoriesData?.layout.categories) {
      let filtered = [...data.courses];

      if (searchTerm) {
        filtered = filtered.filter((item) => {
          const matchTitle = item.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchCategory = categoriesData.layout.categories.some(cat =>
            cat.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            item.categories === cat.title
          );
          const matchLevel = categoriesData.layout.categories.some(cat =>
            cat.levels.some(level =>
              level.toLowerCase().includes(searchTerm.toLowerCase()) &&
              item.level === level
            )
          );
          return matchTitle || matchCategory || matchLevel;
        });
      }

      if (selectedCategory !== 'All') {
        filtered = filtered.filter((item) => item.category.title === selectedCategory);
      }

      if (selectedLevel !== 'All') {
        filtered = filtered.filter((item) => item.category.level === selectedLevel);
      }

      // Apply price filter
      filtered = filtered.filter(
        (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
      );

      // Apply sorting
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.ratings - a.ratings);
      }

      setFilteredCourses(filtered);
      setCurrentPage(1);
    }
  }, [data, categoriesData, selectedCategory, selectedLevel, searchTerm, priceRange, sortBy]);

  const categories = categoriesData?.layout.categories || [];
  const levels = Array.from(new Set(categories.flatMap(cat => cat.levels)));

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 2) {
        pageNumbers.push('...');
      }
      if (currentPage > 1 && currentPage < totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };


  return (
    <div className="container mx-auto p-4 mb-8">
      {/* Add Entry Test Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="flex flex-col md:flex-row justify-between items-center p-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Not sure which level to start?</h2>
            <p className="text-muted-foreground">Take our entry test to find the perfect course for you!</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/entry-tests">Take Entry Test</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <div className="flex flex-nowrap gap-2 items-center">
          <div className="relative flex-grow">
            <Input
              placeholder="Search courses, categories, or levels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex-shrink-0 whitespace-nowrap"
          >
            <SlidersHorizontal size={20} className="mr-2 hidden sm:inline" />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-8">
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
            <div>
              <Label className="block text-sm font-medium mb-2">Price Range</Label>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.title}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Level</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => {
                setSearchTerm('');
                setPriceRange([0, 1000]);
                setSortBy('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCourses.map((item, index) => (
              <CourseCard course={item} key={index} />
            ))}
          </div>

          {/* Updated Pagination UI */}
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {getPageNumbers().map((number, index) => (
                <PaginationItem key={index}>
                  {number === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => paginate(number)}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      {filteredCourses.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-xl font-semibold mb-4">No courses found</p>
            <Button onClick={() => {
              setSearchTerm('');
              setPriceRange([0, 1000]);
              setSortBy('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllCourses;
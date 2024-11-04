import React, { useState, useEffect } from 'react';
import { useGetAllEntranceTestsQuery } from '@/app/redux/features/entry-test/entryTestApi';
import { useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Loader from '../Loader/Loader';
import Link from 'next/link';
import { Clock, BookOpen, ArrowRight, Timer, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";

const ChooseTestEntry = () => {
  const { data: testsData, isLoading: testsLoading } = useGetAllEntranceTestsQuery();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetHeroDataQuery("Categories");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTests, setFilteredTests] = useState([]);
  const testsPerPage = 6;
  const testTypes = testsData?.tests 
    ? ['all', ...new Set(testsData.tests.map(test => test.testType))]
    : ['all'];
  const categories = categoriesData?.layout?.categories || [];

  useEffect(() => {
    if (testsData?.tests) {
      let filtered = [...testsData.tests];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(test => 
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories.some(cat => 
            cat.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            cat.title === test.testType
          )
        );
      }

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(test => {
          const matchingCategory = categories.find(cat => cat.title === selectedCategory);
          return test.testType === matchingCategory?.title;
        });
      }

      setFilteredTests(filtered);
      setCurrentPage(1);
    }
  }, [testsData, searchTerm, selectedCategory, categories]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (testsLoading || categoriesLoading) return <Loader />;

  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">English Placement Test</h1>
          <p className="text-muted-foreground mb-4">
            Take our placement test to determine your English proficiency level and get personalized course recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-5 w-5" />
              <span>Flexible time</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary h-5 w-5" />
              <span>Multiple sections</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="text-primary h-5 w-5" />
              <span>Instant results</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.title}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Available Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentTests.map((test) => {
          const matchingCategory = categories.find(cat => cat.title === test.testType);
          
          return (
            <Card 
              key={test._id} 
              className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">{test.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{matchingCategory?.title || test.testType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>{test.totalTime} minutes</span>
                  </div>
                  <Button 
                    className="w-full mt-4 hover:bg-primary/90" 
                    asChild
                  >
                    <Link href={`/entry-test/${test._id}`}>
                      Start Test
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results Message */}
      {currentTests.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-xl font-semibold mb-4">No tests found matching your criteria</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => paginate(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => paginate(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => paginate(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ChooseTestEntry;
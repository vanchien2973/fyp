'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { BookOpen, GraduationCap, BarChart, Trophy, Target, Book, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import CourseCard from '../Layouts/CourseCard';
import { Separator } from '../ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';

const RecommendationCourse = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery();
    const { data: coursesData, isLoading: isLoadingCourses } = useGetAllCoursesQuery({});
    const [latestResult, setLatestResult] = useState(null);
    const [recommendedCourses, setRecommendedCourses] = useState([]);

    useEffect(() => {
        const getLatestResult = () => {
            const testResults = userData?.user?.entranceTestResults || user?.entranceTestResults;
            if (testResults && testResults.length > 0) {
                return [...testResults].sort((a, b) => 
                    new Date(b.takenAt) - new Date(a.takenAt)
                )[0];
            }
            return null;
        };

        const result = getLatestResult();
        if (result && coursesData?.courses) {
            setLatestResult(result);
            
            if (result.recommendations?.recommendedCourses) {
                const recommendedCourseIds = result.recommendations.recommendedCourses;
                const filteredCourses = coursesData.courses.filter(course => 
                    recommendedCourseIds.includes(course._id)
                );
                setRecommendedCourses(filteredCourses);
            }
        }
    }, [userData, user, coursesData]);

    if (isLoadingUser || isLoadingCourses) {
        return (
            <Alert>
                <AlertTitle>Loading</AlertTitle>
                <AlertDescription>
                    Please wait while we load your data...
                </AlertDescription>
            </Alert>
        );
    }

    const getLevelColor = (score) => {
        if (!score && score !== 0) return "text-gray-500";
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getSectionIcon = (sectionName) => {
        switch (sectionName) {
            case 'Listening':
                return <BookOpen className="h-5 w-5" />;
            case 'Reading':
                return <Book className="h-5 w-5" />;
            case 'Writing':
                return <GraduationCap className="h-5 w-5" />;
            case 'Speaking':
                return <BarChart className="h-5 w-5" />;
            default:
                return <CheckCircle2 className="h-5 w-5" />;
        }
    };

    const renderSectionScore = (section, score) => {
        if ((section === 'Writing' || section === 'Speaking') && (!score || score === 0)) {
            return (
                <Badge variant="secondary">
                    Needs Manual Grading
                </Badge>
            );
        }
        
        const roundedScore = score ? Math.round(score * 10) / 10 : 0;
        return (
            <Badge className={getLevelColor(roundedScore)}>
                {roundedScore}%
            </Badge>
        );
    };

    const renderSectionProgress = (section, score) => {
        if ((section === 'Writing' || section === 'Speaking') && (!score || score === 0)) {
            return null;
        }
        const progressValue = Math.min(Math.max(score || 0, 0), 100);
        return <Progress value={progressValue} className="h-2" />;
    };

    const renderRecommendedCourses = () => {
        if (isLoadingCourses) {
            return (
                <Alert>
                    <AlertTitle>Loading</AlertTitle>
                    <AlertDescription>
                        Please wait while we load the course information...
                    </AlertDescription>
                </Alert>
            );
        }

        if (!latestResult || !latestResult.recommendations) {
            return (
                <Alert>
                    <AlertTitle>No Data</AlertTitle>
                    <AlertDescription>
                        No test results or course recommendations found.
                    </AlertDescription>
                </Alert>
            );
        }

        if (!recommendedCourses || recommendedCourses.length === 0) {
            return (
                <Alert>
                    <AlertTitle>No Courses Found</AlertTitle>
                    <AlertDescription>
                        Currently no courses match your level {latestResult.recommendations.level} 
                        and test type {latestResult.test?.testType}.
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Recommended Courses ({recommendedCourses.length})
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Based on level {latestResult.recommendations?.level} and test type {latestResult.test?.testType}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendedCourses.map((course, index) => {
                            return (
                                <CourseCard 
                                    course={course} 
                                    key={index}
                                    isRecommended={true}
                                />
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (!latestResult) {
        return (
            <Alert>
                <AlertTitle>No Results</AlertTitle>
                <AlertDescription>
                    You haven't completed the entrance test yet. Please take the test to receive suitable course recommendations.
                </AlertDescription>
            </Alert>
        );
    }

    const sectionScores = latestResult?.sectionScores || {};
    const detailedResults = latestResult?.detailedResults || [];
    const recommendations = latestResult?.recommendations || [];
    const totalScore = latestResult?.score || 0;

    const isValidResult = latestResult && latestResult.takenAt && latestResult.score !== undefined;

    if (!isValidResult) {
        return (
            <Alert>
                <AlertTitle>No Results</AlertTitle>
                <AlertDescription>
                    You haven't completed the entrance test or the results are invalid.
                    Please take the test to receive suitable course recommendations.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Test Results</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Completed on: {latestResult.takenAt ? new Date(latestResult.takenAt).toLocaleDateString('en-US') : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            *Score calculated from automatically gradable questions only
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold">
                            {Math.round(latestResult.score || 0)}%
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span>Total Score</span>
                                <span className={getLevelColor(latestResult.score)}>
                                    {Math.round(latestResult.score || 0)}%
                                </span>
                            </div>
                            <Progress value={latestResult.score || 0} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {Object.entries(sectionScores).map(([section, score]) => (
                                <Card key={section} className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getSectionIcon(section)}
                                            <span>{section}</span>
                                        </div>
                                        {renderSectionScore(section, score)}
                                    </div>
                                    {renderSectionProgress(section, score)}
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Your Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold">
                                {user?.proficiencyLevel || 'Not determined'}
                            </span>
                            <Badge variant="outline" className="text-lg">
                                {Math.round(latestResult.score || 0)}%
                            </Badge>
                        </div>
                        <Separator className="my-4" />
                        <p className="text-muted-foreground">
                            Based on your test results, your English proficiency level is assessed at {(user?.proficiencyLevel || '').toLowerCase()}.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5" />
                            Detailed Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            {detailedResults.map((result, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            {getSectionIcon(result.section)}
                                            <span>Question {index + 1}</span>
                                            {result.needsManualGrading ? (
                                                <Badge variant="secondary">Needs Manual Grading</Badge>
                                            ) : (
                                                <Badge variant={result.isCorrect ? "success" : "destructive"}>
                                                    {result.score}/{result.maxScore}
                                                </Badge>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 p-2">
                                            <p>Section: {result.section}</p>
                                            <p>Your answer: {result.userAnswer || 'No answer'}</p>
                                            {!result.needsManualGrading && (
                                                <p className={result.isCorrect ? "text-green-500" : "text-red-500"}>
                                                    {result.isCorrect ? "Correct" : "Incorrect"}
                                                </p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {renderRecommendedCourses()}
        </div>
    );
};

export default RecommendationCourse;
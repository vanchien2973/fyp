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

const RecommendationCourse = () => {
    const { user } = useSelector((state) => state.auth);
    const [latestResult, setLatestResult] = useState(null);

    useEffect(() => {
        if (user?.entranceTestResults && user.entranceTestResults.length > 0) {
            // Tìm kết quả mới nhất bằng reduce
            const latest = user.entranceTestResults.reduce((latest, current) => {
                if (!latest.takenAt) return current;
                if (!current.takenAt) return latest;
                
                const latestDate = new Date(latest.takenAt);
                const currentDate = new Date(current.takenAt);
                
                return currentDate > latestDate ? current : latest;
            });

            // Log để debug
            console.log('Found latest result:', latest);
            console.log('Latest date:', new Date(latest.takenAt));

            setLatestResult(latest);
        }
    }, [user]);

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

    // Kiểm tra và khởi tạo sectionScores nếu không tồn tại
    const sectionScores = latestResult?.sectionScores || {};
    const detailedResults = latestResult?.detailedResults || [];
    const recommendations = latestResult?.recommendations || [];
    const totalScore = latestResult?.score || 0;

    // Kiểm tra xem có phải là kết quả hợp lệ không
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
            {/* Tổng quan kết quả */}
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Test Results</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Completed on: {latestResult.takenAt ? new Date(latestResult.takenAt).toLocaleDateString('en-US') : 'N/A'}
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
                                        <Badge className={getLevelColor(score)}>
                                            {Math.round(score || 0)}%
                                        </Badge>
                                    </div>
                                    <Progress value={score || 0} className="h-2" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Trình độ và đề xuất */}
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

                {/* Chi tiết từng phần */}
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
                                            <Badge variant={result.isCorrect ? "success" : "destructive"}>
                                                {result.score}/{result.maxScore}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 p-2">
                                            <p>Section: {result.section}</p>
                                            <p>Your answer: {result.userAnswer || 'No answer'}</p>
                                            <p className={result.isCorrect ? "text-green-500" : "text-red-500"}>
                                                {result.isCorrect ? "Correct" : "Incorrect"}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Khóa học đề xuất */}
            {recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Recommended Courses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RecommendationCourse;
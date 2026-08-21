import { useState, useEffect, useCallback } from "react";
import api from "../../Utils/api";
import AttendanceTable from "../Components/AttendanceTable";

const AttendanceHistory = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    };

    // State for student attendance records
    const [records, setRecords] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("Rain 2025/2026");
    const [page, setPage] = useState(1);

    const fetchStudentAttendance = useCallback(
        async (pageNumber = 1) => {
            setLoading(true);
            try {
                const response = await api.get(
                    "/my-attendance",
                    {
                        params: {
                            page: pageNumber,
                            limit: 5,
                            ...(selectedCourse ? { courseCode: selectedCourse } : {}),
                        },
                    },
                );

                if (response.data && response.data.records) {
                    setRecords(response.data.records);
                    setTotalPages(response.data.totalPages);
                    setPage(response.data.page);
                } else if (Array.isArray(response.data)) {
                    setRecords(response.data);
                }
            } catch (error) {
                console.error("Error fetching student attendance history:", error);
            } finally {
                setLoading(false);
            }
        },
        [selectedCourse, token],
    );

    // Re-fetch when selected course or semester changes
    useEffect(() => {
        fetchStudentAttendance(1);
    }, [fetchStudentAttendance, selectedSemester]);

    // Dynamically get unique courses from currently loaded records or full course list
    const studentCourses = Array.from(
        new Set(records.map((r) => r.courseCode)),
    ).filter(Boolean);

    // Dynamic calculations for loaded records
    const totalLectures = records.length;
    const presentCount = records.filter(
        (r) => r.status?.toLowerCase() === "present",
    ).length;
    const absentCount = totalLectures - presentCount;
    const attendancePercentage =
        totalLectures > 0 ? Math.round((presentCount / totalLectures) * 100) : 0;

    return (
        <>
            <div className="bg-[#fafdf4] min-h-screen font-sans">
                <div className="py-4 px-4 sm:px-6 lg:px-10 w-full pb-28 mt-[4rem] lg:mt-[0rem]">
                    <div className="flex flex-col">
                        {/* Header & Controls */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-[24px] sm:text-[30px] font-bold">
                                    Attendance History
                                </h1>
                                <span className="text-[14px] sm:text-[16px] text-[#3f4941] font-medium">
                                    Review your presence across all enrolled courses.
                                </span>
                            </div>

                            <div className="flex items-end sm:items-center gap-3 self-start lg:self-auto flex-wrap sm:flex-nowrap">
                                <div className="flex flex-1 sm:flex-none p-1 sm:p-3 rounded-lg items-center gap-3 sm:gap-4 mt-2 sm:mt-6">
                                    {/* Course Select */}
                                    <div className="flex flex-col flex-1 sm:flex-none">
                                        <span className="font-medium text-sm sm:text-base">
                                            Course
                                        </span>
                                        <select
                                            value={selectedCourse}
                                            onChange={(e) => {
                                                setSelectedCourse(e.target.value);
                                                setPage(1);
                                            }}
                                            className="border-1 border-[#bfc9bf] rounded-md outline-none py-2 px-2 sm:px-3 text-sm sm:text-base w-full"
                                        >
                                            <option value="">All Courses</option>
                                            {studentCourses.map((code) => (
                                                <option key={code} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Semester Select */}
                                    <div className="flex flex-col flex-1 sm:flex-none">
                                        <span className="font-medium text-sm sm:text-base">
                                            Semester
                                        </span>
                                        <select
                                            value={selectedSemester}
                                            onChange={(e) => {
                                                setSelectedSemester(e.target.value);
                                                setPage(1);
                                            }}
                                            className="border-1 border-[#bfc9bf] outline-none rounded-md py-2 px-2 sm:px-3 text-sm sm:text-base w-full"
                                        >
                                            <option value="Rain 2025/2026">Rain 2025/2026</option>
                                            <option value="Harmattan 2025/2026">
                                                Harmattan 2025/2026
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Refresh Button */}
                                <div
                                    onClick={() => fetchStudentAttendance(page)}
                                    className="bg-[#0a643a] text-[#ffffff] mb-1 sm:mt-[3rem] rounded-md p-2 sm:p-1 cursor-pointer flex items-center justify-center"
                                    title="Refresh Data"
                                >
                                    <span
                                        className="text-[20px] text-center material-symbols-outlined"
                                        style={iconStyle}
                                    >
                                        refresh
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Metrics */}
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-[40px] mt-6">
                            {/* Overall Attendance Card */}
                            <div className="w-full lg:w-[65%] bg-[#ffffff] p-4 border-1 border-[#bfc9bf] rounded-md">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                                    <div>
                                        <h2 className="text-[18px] sm:text-[20px] font-bold leading-tight">
                                            Overall Attendance
                                        </h2>
                                        <span className="text-[12px] text-[#3f4941]">
                                            Requirement: 75% for eligibility
                                        </span>
                                    </div>
                                    <div className="bg-[#baeed9] text-[#0a643a] font-medium py-1 px-4 rounded-xl self-start sm:self-auto text-sm sm:text-base">
                                        {loading ? "..." : `${attendancePercentage}% Total`}
                                    </div>
                                </div>
                                <div>
                                    <div className="w-full bg-[#e2e9ec] h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-[#0a643a] h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${attendancePercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-[#3f4941] text-xs sm:text-sm">
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>
                                            75% <small>(min)</small>
                                        </span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Lectures Card */}
                            <div className="bg-[#0a643a] w-full lg:w-[35%] p-4 rounded-xl">
                                <span className="font-medium text-[#e2e9ec] text-sm sm:text-base">
                                    Total Lectures
                                </span>
                                <h1 className="text-[26px] sm:text-[30px] font-bold text-[#ffffff]">
                                    {loading ? "..." : totalLectures}
                                </h1>
                                <div className="text-left text-[#ffffff] gap-2 mt-1">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="px-2 text-[12px] font-normal">
                                                    Present
                                                </th>
                                                <th className="text-[12px] font-normal">Absent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-2 text-[16px] font-bold">
                                                    {loading ? "-" : presentCount}
                                                </td>
                                                <td className="text-[16px] font-bold text-red-200">
                                                    {loading ? "-" : absentCount}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Table Component */}
                        <div className="mt-6 overflow-x-auto">
                            <AttendanceTable
                                records={records}
                                loading={loading}
                                totalPages={totalPages}
                                page={page}
                                onPageChange={(newPage) => fetchStudentAttendance(newPage)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendanceHistory;

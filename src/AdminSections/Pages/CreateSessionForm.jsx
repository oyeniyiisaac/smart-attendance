import { useState, useEffect } from "react";
import FormSection from "./FormSection";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sessionURI = import.meta.env.VITE_SESSION_URL;

// 🏫 Dynamic Scale Mapping: 13 Faculties & 100+ Departments
// Add or adjust these names to match your exact institutional database naming conventions!
const FACULTIES_DATA = {
  "Faculty of Engineering (FET)": [
    "Electrical & Electronic Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Computer Engineering"
  ],
  "Faculty of Computing and Informatics (FCI)": [
    "Computer Science",
    "Software Engineering",
    "Information Systems",
    "Cybersecurity"
  ],
  "Faculty of Pure and Applied Science(FPAS)": [
    "Pure and Applied Physics",
    "Pure and Applied Chemistry",
    "Pure and Applied Mathematics",
    "Pure and Applied Biology",
    "Statistics",
    "Science Laboratory Technology",
    "Earth Sciences"
  ],
  "Faculty of Agriculture Sciences(FAG)": [
    "Agricultural Economics",
    "Animal Nutrition and Biotechnology",
    "Crop and Environmental Production",
    "Crop Production and Soil Science",
    "Animal Production and Health",
    "Agricultural Extension and Rural Development"
  ],
  "Faculty of Renewable Natural Resources (FRNR)": [
    "Forest Resource Management",
    "Fisheries and Aquaculture",
    "Wildlife and Ecotourism Management"
  ],
  "Faculty of Management Sciences (FMS)": [
    "Accounting",
    "Business Management",
    "Economics",
    "Marketing",
    "Transport Management",
  ],
  "Faculty of Environmental Sciences(FES)": [
    "Architecture",
    "Urban and Regional Planning",
    "Estate Management",
    "Surveying and Geoinformatics",
    "Fine and Applied Arts",
    "Building"
  ],
  "Faculty of Food and Consumer Sciences(FES)": [
    "Food Science",
    "Consumer Science/Home Economics",
    "Nutrition and Dietetics"
  ],
  "Faculty of Arts and Social Sciences(FASS)": [
    "Sociology",
    "Economics",
    "Political Science",
    "English and Literary Studies",
    "Philosophy",
    "History",
    "Linguistics and Yoruba Studies",
    "Theatre Arts",
    "Psychology"
  ],
  "Faculty of Basic Medical Sciences (FBMS)": [
    "Anatomy",
    "Biochemistry",
    "Medical Laboratory Science",
    "Physiology"
  ],
  "Faculty of Clinical Sciences(FCS)": [
    "Medicine",
    "Surgery",
    "Ophthalmology",
    "Obstetrics and Gynaecology",
    "Radiology",
    "Paediatrics",
    "Anaesthesia"
  ],
  "Faculty of Basic Clinical Sciences(FBCS)": [
    "Chemical Pathology",
    "Haematology/Blood Transfusion",
    "Medical Microbiology/Parasitology",
    "Morbid Anatomy and Histopathology",
  ],
  "Faculty of Clinical Nursing Sciences(FCNS)": [
    "Nursing"
  ],
};

// Helper function to get current browser local time formatted for <input type="datetime-local">
const getFormattedLocalDateTime = (offsetHours = 0) => {
  const localDate = new Date();
  if (offsetHours > 0) {
    localDate.setHours(localDate.getHours() + offsetHours);
  }

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function CreateSessionForm() {
  const initialFormState = () => ({
    courseName: "",
    courseCode: "",
    courseId: "",
    academicLevel: "",
    semester: "First Semester",
    academicSession: "",
    dateTimeFrom: getFormattedLocalDateTime(0),
    dateTimeTo: getFormattedLocalDateTime(1),
    venue: "",
    activateImmediately: true,

    // 🏫 Dynamic Academic Routing
    faculty: "",
    department: "",

    // Toggles for active validation strategies
    useGpsVerification: true,
    useWifiVerification: false,
    useBeaconVerification: false,

    // Hardware value properties
    latitude: "",
    longitude: "",
    expectedBssid: "",
    expectedSsid: "",
    beaconUuid: "",
    mapUrl: "",
  });

  const [formData, setFormData] = useState(initialFormState());

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dateTimeFrom: getFormattedLocalDateTime(0),
      dateTimeTo: getFormattedLocalDateTime(1),
    }));
  }, []);

  // Handle resets for department dropdown if faculty gets changed
  const handleFacultyChange = (e) => {
    const selectedFaculty = e.target.value;
    setFormData((prev) => ({
      ...prev,
      faculty: selectedFaculty,
      department: "", // Reset department selection back to default on faculty change
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    console.log("Token sent to header:", token);

    if (!token) {
      toast.error("Your session has expired or you are not authorized. Please log in again.");
      return;
    }

    // Validation Guard: Ensure Faculty and Department are selected
    if (!formData.faculty || !formData.department) {
      toast.error("Please assign a Faculty and Department for this session.");
      return;
    }

    // Validation Guard: Ensure at least one verification strategy is checked
    if (!formData.useGpsVerification && !formData.useWifiVerification && !formData.useBeaconVerification) {
      toast.error("Please select at least one verification method (GPS, Wi-Fi, or Bluetooth).");
      return;
    }

    const payload = {
      ...formData,
      dateTimeFrom: new Date(formData.dateTimeFrom).toISOString(),
      dateTimeTo: new Date(formData.dateTimeTo).toISOString(),
      // Clean up fields if their respective verification strategies are untoggled
      latitude: formData.useGpsVerification ? formData.latitude : null,
      longitude: formData.useGpsVerification ? formData.longitude : null,
      expectedBssid: formData.useWifiVerification ? formData.expectedBssid : null,
      expectedSsid: formData.useWifiVerification ? formData.expectedSsid : null,
      beaconUuid: formData.useBeaconVerification ? formData.beaconUuid : null,
    };

    axios
      .post(sessionURI, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        toast.success(res.data.message || "Session created successfully! 🚀");
        setFormData(initialFormState());
      })
      .catch((err) => {
        console.error("Session creation error:", err);
        const errorMsg = err.response?.data?.message || "Failed to create session.";
        toast.error(errorMsg);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
      <ToastContainer />

      {/* SECTION 1: Course Information */}
      <FormSection title="Course Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Course Name</label>
            <input
              type="text"
              name="courseName"
              placeholder="e.g. Distributed Systems"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.courseName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Course Code</label>
            <input
              type="text"
              name="courseCode"
              placeholder="e.g. CS402"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.courseCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Course ID</label>
            <input
              type="text"
              name="courseId"
              placeholder="Unique Database ID"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.courseId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Academic Level</label>
            <select
              name="academicLevel"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-600"
              value={formData.academicLevel}
              onChange={handleChange}
            >
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>

          {/* 🆕 Faculty Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Faculty</label>
            <select
              name="faculty"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-700"
              value={formData.faculty}
              onChange={handleFacultyChange}
              required
            >
              <option value="">Select Faculty</option>
              {Object.keys(FACULTIES_DATA).map((facultyName) => (
                <option key={facultyName} value={facultyName}>
                  {facultyName}
                </option>
              ))}
            </select>
          </div>

          {/* 🆕 Department Selection Dropdown (Depends on Faculty choice) */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${formData.faculty ? 'text-slate-700' : 'text-slate-400'}`}>
              Department
            </label>
            <select
              name="department"
              disabled={!formData.faculty}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-700"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {formData.faculty &&
                FACULTIES_DATA[formData.faculty].map((deptName) => (
                  <option key={deptName} value={deptName}>
                    {deptName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Semester</label>
            <select
              name="semester"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-700"
              value={formData.semester}
              onChange={handleChange}
            >
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Academic Session</label>
            <input
              type="text"
              name="academicSession"
              placeholder="e.g. 2023/2024"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.academicSession}
              onChange={handleChange}
            />
          </div>
        </div>
      </FormSection>

      {/* SECTION 2: Logistics & Schedule */}
      <FormSection title="Logistics & Schedule">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Date & Time From</label>
              <input
                type="datetime-local"
                name="dateTimeFrom"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-700"
                value={formData.dateTimeFrom}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Date & Time To</label>
              <input
                type="datetime-local"
                name="dateTimeTo"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-700"
                value={formData.dateTimeTo}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Venue Name</label>
            <input
              type="text"
              name="venue"
              placeholder="e.g. Science Auditorium A"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.venue}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Activation Toggle Button Block */}
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Activate Session Immediately</h4>
            <p className="text-xs text-slate-500">Students can start signing in once created</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="activateImmediately"
              checked={formData.activateImmediately}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f5132]"></div>
          </label>
        </div>
      </FormSection>

      {/* SECTION 3: Verification Methods & Constraints */}
      <FormSection title="Verification Methods & Constraints">
        {/* Verification Checkbox Strategy Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.useGpsVerification ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
            <input
              type="checkbox"
              name="useGpsVerification"
              checked={formData.useGpsVerification}
              onChange={handleChange}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">GPS Geofencing</span>
              <span className="block text-[10px] text-slate-500">Verify coordinates</span>
            </div>
          </label>

          <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.useWifiVerification ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
            <input
              type="checkbox"
              name="useWifiVerification"
              checked={formData.useWifiVerification}
              onChange={handleChange}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">Wi-Fi Router Routing</span>
              <span className="block text-[10px] text-slate-500">Verify network BSSID/SSID</span>
            </div>
          </label>

          <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${formData.useBeaconVerification ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
            <input
              type="checkbox"
              name="useBeaconVerification"
              checked={formData.useBeaconVerification}
              onChange={handleChange}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <div>
              <span className="block text-xs font-bold text-slate-800">Bluetooth Beacon</span>
              <span className="block text-[10px] text-slate-500">Verify physical proximity</span>
            </div>
          </label>
        </div>

        {/* Conditional GPS Configuration Layout Mapping */}
        {formData.useGpsVerification && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b border-dashed border-gray-200">
            <div className="lg:col-span-2 relative bg-slate-900 border border-gray-300 rounded-lg h-48 overflow-hidden flex items-center justify-center">
              <iframe
                title="Venue Location Map"
                width="100%"
                height="100%"
                className="absolute inset-0 border-0 z-1"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${formData.latitude || 0},${formData.longitude || 0}&t=k&z=17&output=embed`}
              ></iframe>
              <span className="absolute bottom-2 left-2 text-[10px] text-white/60 bg-black/70 px-2 py-0.5 rounded pointer-events-none z-10">
                Satellite Preview Active
              </span>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  placeholder="e.g. 51.5074"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                  value={formData.latitude}
                  onChange={handleChange}
                  required={formData.useGpsVerification}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  placeholder="e.g. -0.1278"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                  value={formData.longitude}
                  onChange={handleChange}
                  required={formData.useGpsVerification}
                />
              </div>
              <div className="bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs p-3 rounded flex items-start space-x-2">
                <span className="font-bold text-sm leading-none">ⓘ</span>
                <p>Ensure coordinates match the physical venue for accurate geofencing.</p>
              </div>
            </div>
          </div>
        )}

        {/* Hardware Network Configurations Inputs Container Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          <div>
            <label className={`block text-xs font-bold mb-2 ${formData.useWifiVerification ? 'text-slate-700' : 'text-slate-400'}`}>
              Expected BSSID {formData.useWifiVerification && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="text"
              name="expectedBssid"
              disabled={!formData.useWifiVerification}
              placeholder="e.g. 00:11:22:33:44:55"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-800"
              value={formData.expectedBssid || ""}
              onChange={handleChange}
              required={formData.useWifiVerification}
            />
          </div>
          <div>
            <label className={`block text-xs font-bold mb-2 ${formData.useWifiVerification ? 'text-slate-700' : 'text-slate-400'}`}>
              Expected SSID {formData.useWifiVerification && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="text"
              name="expectedSsid"
              disabled={!formData.useWifiVerification}
              placeholder="e.g. MyWiFiNetwork"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-800"
              value={formData.expectedSsid || ""}
              onChange={handleChange}
              required={formData.useWifiVerification}
            />
          </div>
          <div>
            <label className={`block text-xs font-bold mb-2 ${formData.useBeaconVerification ? 'text-slate-700' : 'text-slate-400'}`}>
              Beacon UUID {formData.useBeaconVerification && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="text"
              name="beaconUuid"
              disabled={!formData.useBeaconVerification}
              placeholder="e.g. 123e4567-e89b-12d3..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-800"
              value={formData.beaconUuid || ""}
              onChange={handleChange}
              required={formData.useBeaconVerification}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">Map URL</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">🔗</span>
            <input
              type="text"
              name="mapUrl"
              placeholder="Google Maps or Mapbox URL"
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
              value={formData.mapUrl}
              onChange={handleChange}
            />
          </div>
        </div>
      </FormSection>

      {/* Action Button Section with Mobile Full-Width Snapping Optimization */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 -mx-4 -mb-4 flex justify-end md:static md:bg-transparent md:border-0 md:p-0 md:m-0 pt-4 z-50">
        <button
          type="submit"
          className="bg-[#0f5132] hover:bg-[#0b3d26] text-white font-semibold text-sm py-3 px-6 rounded-lg shadow transition-colors flex items-center space-x-2 w-full md:w-auto justify-center"
        >
          <span>📋</span>
          <span>Save & Create Session</span>
        </button>
      </div>
    </form>
  );
}
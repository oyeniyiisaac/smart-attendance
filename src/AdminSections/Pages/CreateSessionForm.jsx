import { useState, useEffect } from "react";
import FormSection from "./FormSection";
import axios from "axios";
const sessionURI = import.meta.env.VITE_SESSION_URL;

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateSessionForm() {
  // (see top-level helper) Get current browser local time formatted for <input type="datetime-local">
  // const token = localStorage.getItem('token');
  const initialFormState = () => ({
    courseName: "",
    courseCode: "",
    courseId: "",
    academicLevel: "",
    semester: "First Semester",
    academicSession: "",
    dateTimeFrom: getFormattedLocalDateTime(0), // Automatically sets to your current browser time
    dateTimeTo: getFormattedLocalDateTime(1), // Automatically sets to +1 hour from now
    venue: "",
    activateImmediately: true,
    latitude: "",
    longitude: "",
    expectedBssid: null,
    expectedSsid: null,
    beaconUuid: null,
    mapUrl: "",
  });

  const [formData, setFormData] = useState(initialFormState());

  // Reset dates if the form stays open over a long period before initial interaction
  useEffect(() => {
    // Refresh only the date fields on mount so long-lived open forms get current times
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      dateTimeFrom: getFormattedLocalDateTime(0),
      dateTimeTo: getFormattedLocalDateTime(1),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Grab the admin token from localStorage (Ensure 'token' matches the exact key name used at login)
    const token = localStorage.getItem("adminToken");
    console.log("Token sent to header:", token);
    // 2. Guard clause: Stop the request immediately if the user isn't logged in
    if (!token) {
      toast.error(
        "Your session has expired or you are not authorized. Please log in again.",
      );
      return;
    }

    // Convert the localized form strings into absolute ISO standard UTC strings for backend safety
    const payload = {
      ...formData,
      dateTimeFrom: new Date(formData.dateTimeFrom).toISOString(),
      dateTimeTo: new Date(formData.dateTimeTo).toISOString(),
    };

    // 3. Pass the payload along with the Authorization headers config
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
        console.log(res.data);
        setFormData(initialFormState()); // Clean state reset including refreshed times
      })
      .catch((err) => {
        console.error("Session creation error:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to create session.";
        toast.error(errorMsg);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
      <ToastContainer />
      {/* SECTION 1: Course Information */}
      <FormSection title="Course Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Course Name
            </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Course Code
            </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Course ID
            </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Academic Level
            </label>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Semester
            </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Academic Session
            </label>
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
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Date & Time From
              </label>
              <input
                type="datetime-local"
                name="dateTimeFrom"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 text-slate-700"
                value={formData.dateTimeFrom}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Date & Time To
              </label>
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
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {" "}
              Venue Name
            </label>
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
            <h4 className="text-sm font-bold text-slate-800">
              Activate Session Immediately
            </h4>
            <p className="text-xs text-slate-500">
              Students can start signing in once created
            </p>
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

      {/* SECTION 3: Geofencing & GPS Coordinates */}
      <FormSection title="Geofencing & GPS Coordinates">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 z-1">
          <div className="lg:col-span-2 relative bg-slate-900 border border-gray-300 rounded-lg h-48 overflow-hidden flex items-center justify-center">
            <iframe
              title="Venue Location Map"
              width="100%"
              height="100%"
              className="absolute inset-0 border-0 z-1"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&t=k&z=17&output=embed`}
            ></iframe>
            <span className="absolute bottom-2 left-2 text-[10px] text-white/60 bg-black/70 px-2 py-0.5 rounded pointer-events-none z-10">
              Satellite Preview Active
            </span>
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                placeholder="e.g. 51.5074"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                placeholder="e.g. -0.1278"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs p-3 rounded flex items-start space-x-2">
              <span className="font-bold text-sm leading-none">ⓘ</span>
              <p>
                Ensure coordinates match the physical venue for accurate
                geofencing.
              </p>
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected BSSID
              </label>
              <input
                type="text"
                name="expectedBssid"
                placeholder="e.g. 00:11:22:33:44:55"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                value={formData.expectedBssid}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected SSID
              </label>
              <input
                type="text"
                name="expectedSsid"
                placeholder="e.g. MyWiFiNetwork"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                value={formData.expectedSsid}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Beacon UUID
              </label>
              <input
                type="text"
                name="beaconUuid"
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                value={formData.beaconUuid}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Map URL
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              🔗
            </span>
            <input
              type="text"
              name="mapUrl"
              placeholder="Google Maps or Mapbox URL"
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 z-1"
              value={formData.mapUrl}
              onChange={handleChange}
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-[#0f5132] hover:bg-[#0b3d26] text-white font-semibold text-sm py-3 px-6 rounded-lg shadow transition-colors flex items-center space-x-2"
        >
          <span>📋</span>
          <span>Save & Create Session</span>
        </button>
      </div>
    </form>
  );
}

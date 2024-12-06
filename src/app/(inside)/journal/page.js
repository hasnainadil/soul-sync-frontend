'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { axiosInstance } from "@/utils/axiosInstance";

export default function JournalPage() {
  const [journals, setJournals] = useState({});
  const [newJournal, setNewJournal] = useState({ title: "", content: "" });
  const [selectedJournal, setSelectedJournal] = useState(null); // State for popup

  // Fetch journals on component mount
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        // const response = await fetch("http://localhost:8080/v1/journals", {
        //   credentials: 'include',
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (response.ok) {
        //   const data = await response.json();

        //   // Group journals by date
        //   const groupedJournals = data.content.reduce((acc, journal) => {
        //     const date = new Date(journal.createdAt).toLocaleDateString("en-US", {
        //       year: "numeric",
        //       month: "long",
        //       day: "numeric",
        //     });

        //     if (!acc[date]) acc[date] = [];
        //     acc[date].push(journal);
        //     return acc;
        //   }, {});

        //   setJournals(groupedJournals);
        // } else {
        //   console.error("Failed to fetch journals");
        // }

        axiosInstance.get("http://localhost:8080/v1/journals").then((response) => {
          console.log("Journals fetched successfully!");
          const data = response.data;

          // Group journals by date
          const groupedJournals = data.content.reduce((acc, journal) => {
            const date = new Date(journal.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            if (!acc[date]) acc[date] = [];
            acc[date].push(journal);
            return acc;
          }, {});

          setJournals(groupedJournals);
        }).catch((error) => {
          console.error("Error fetching journals:", error);
        });
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  const handleChange = (e) => {
    setNewJournal({ ...newJournal, [e.target.name]: e.target.value });
  };

  const saveJournal = async () => {
    if (!newJournal.title.trim()) {
      alert("Please provide a title for the journal before saving.");
      return;
    }

    if (!newJournal.content.trim()) {
      alert("Please write something in the journal before saving.");
      return;
    }

    const journalData = {
      title: newJournal.title,
      content: newJournal.content,
    };

    try {
      // const response = await fetch("http://localhost:8080/v1/journals", {
      //   credentials: 'include',
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(journalData),
      // });

      // if (response.ok) {
      //   const savedJournal = await response.json();
      //   alert("Journal saved successfully!");

      //   const today = new Date().toLocaleDateString("en-US", {
      //     year: "numeric",
      //     month: "long",
      //     day: "numeric",
      //   });

      //   const updatedJournals = {
      //     ...journals,
      //     [today]: [...(journals[today] || []), savedJournal],
      //   };

      //   setJournals(updatedJournals);
      //   setNewJournal({ title: "", content: "" });
      // } else {
      //   alert("Failed to save journal. Please try again.");
      // }

      axiosInstance.post("http://localhost:8080/v1/journals", journalData).then((response) => {
        console.log("Journal saved successfully!");
        alert("Journal saved successfully!");
        window.location.reload();

        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const updatedJournals = {
          ...journals,
          [today]: [...(journals[today] || []), response.data],
        };

        setJournals(updatedJournals);
        setNewJournal({ title: "", content: "" });
      }).catch((error) => {});
    } catch (error) {
      console.error("Error saving journal:", error);
      alert("An error occurred while saving the journal.");
    }
  };

  const openJournal = async (entry) => {
    try {
      // const response = await fetch(`http://localhost:8080/v1/journals/${entry.id}`, {
      //   credentials: 'include',
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (response.ok) {
      //   const journalData = await response.json();
      //   setSelectedJournal(journalData); // Open the selected journal in a popup
      // } else {
      //   console.error("Failed to fetch journal by ID");
      // }

      axiosInstance.get(`http://localhost:8080/v1/journals/${entry.id}`).then((response) => {
        console.log("Journal fetched successfully!");
        setSelectedJournal(response.data);
      }).catch((error) => {
        console.error("Error fetching journal by ID:", error);
      });
    } catch (error) {
      console.error("Error fetching journal by ID:", error);
    }
  };

  const closeJournal = () => {
    setSelectedJournal(null); // Close the popup
  };

  const deleteJournal = async () => {
    if (!selectedJournal) return;

    try {
      axiosInstance.delete(`http://localhost:8080/v1/journals/${selectedJournal.id}`).then((response) => {
        console.log("Journal deleted successfully!");
        const updatedJournals = { ...journals };
        const date = new Date(selectedJournal.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        updatedJournals[date] = updatedJournals[date].filter(
          (journal) => journal.id !== selectedJournal.id
        );

        if (updatedJournals[date].length === 0) {
          delete updatedJournals[date];
        }

        setJournals(updatedJournals);
        closeJournal();
      }).catch((error) => {
        console.error("Error deleting journal:", error);
        alert("An error occurred while deleting the journal.");
      });

    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("An error occurred while deleting the journal.");
    }
  };

  return (
    <div className="flex flex-row w-full h-full bg-primary p-10 gap-6">
      {/* Left Section - Journal Input */}
      <div className="flex-[3] bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Write a Journal</h2>
        <div className="border-b-2 border-gray-300 mt-2 mb-4" style={{ width: "150px" }}></div>
        <div className="flex flex-col gap-4">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={newJournal.title}
              onChange={handleChange}
              placeholder="Enter your journal title"
              className="rounded-lg"
            />
          </div>

          {/* Content Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Tell me about your day</Label>
            <textarea
              id="content"
              name="content"
              value={newJournal.content}
              onChange={handleChange}
              placeholder="Write your journal here..."
              className="rounded-lg p-3 border border-gray-300 h-48"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveJournal}
              className="w-40 flex items-center justify-center gap-2 bg-[#f2b9a6] text-white hover:bg-[#e98463] px-4 py-2 text-sm"
            >
              Save Journal
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section - Previous Journals */}
      <div className="flex-[1] bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800">Previous Journals</h2>
        <div className="border-b-2 border-gray-300 mt-2 mb-4" style={{ width: "200px" }}></div>
        <div className="flex flex-col gap-4">
          {Object.keys(journals).length === 0 ? (
            <p className="text-gray-500">No journals have been written yet.</p>
          ) : (
            Object.entries(journals).map(([date, journalEntries]) => (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-700">{date}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {journalEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                      onClick={() => openJournal(entry)}
                    >
                      <h4 className="text-md font-semibold text-gray-800">{entry.title}</h4>
                      <p className="text-sm text-gray-600 truncate">
                        {entry?.content?.length > 30
                          ? `${entry?.content?.slice(0, 30)}...`
                          : entry?.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup for Viewing Selected Journal */}
      {/* Popup for Viewing Selected Journal */}
      {selectedJournal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">{selectedJournal.title}</h2>
            <div className="border-b-2 border-gray-300 mt-2 mb-4"></div>
            <p className="text-gray-700">{selectedJournal.content}</p>
            <div className="flex justify-end gap-4 mt-4"> {/* Use `gap-4` to create spacing */}
              <Button
                onClick={deleteJournal}
                className="bg-red-400 text-white hover:bg-red-500 px-4 py-2"
              >
                Delete
              </Button>
              <Button
                onClick={closeJournal}
                className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

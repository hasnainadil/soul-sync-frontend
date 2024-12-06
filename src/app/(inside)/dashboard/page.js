'use client';

import { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Check } from "lucide-react";

export default function Dashboard() {
  const [moodData, setMoodData] = useState([]);
  const [aiConversations, setAiConversations] = useState(0);
  const [taskGroups, setTaskGroups] = useState([]);
  const [completedGroups, setCompletedGroups] = useState([]); // Track completed groups
  const [unlockedGifts, setUnlockedGifts] = useState([]); // Store unlocked gifts
  const [notification, setNotification] = useState(""); // Notification for the unlocked card

  const cardGifts = [
    "Mood Booster Card",
    "Work Efficiency Card",
    "Mindfulness Card",
    "Focus Enhancement Card",
    "Creative Spark Card",
  ]; // Array of fancy card names

  
  useEffect(() => {
    // Mock data for testing
    setMoodData([
      { day: "Day 1", mood: 60 },
      { day: "Day 2", mood: 70 },
      { day: "Day 3", mood: 75 },
      { day: "Day 4", mood: 65 },
      { day: "Day 5", mood: 80 },
      { day: "Day 6", mood: 85 },
      { day: "Today", mood: 90 },
    ]);
    setAiConversations(121); // Example AI conversation count

    // Example task group
    setTaskGroups([
      {
        title: "Moodlifting Activities",
        tasks: [
          { id: 1, title: "Morning workout", completed: false },
          { id: 2, title: "Read a book", completed: false },
          { id: 3, title: "Meditate for 15 minutes", completed: false },
        ],
      },
      {
        title: "Work Goals",
        tasks: [
          { id: 4, title: "Complete project report", completed: false },
          { id: 5, title: "Prepare presentation", completed: false },
        ],
      },
    ]);
  }, []);

  const markTaskComplete = (groupIndex, taskIndex) => {
    const updatedTaskGroups = [...taskGroups];
    const task = updatedTaskGroups[groupIndex].tasks[taskIndex];
    task.completed = true;

    setTaskGroups(updatedTaskGroups);

    // Check if all tasks in the group are completed
    const allCompleted = updatedTaskGroups[groupIndex].tasks.every(
      (task) => task.completed
    );
    if (allCompleted && !completedGroups.includes(groupIndex)) {
      // Select a random card gift
      const randomGift = cardGifts[Math.floor(Math.random() * cardGifts.length)];
      setUnlockedGifts([...unlockedGifts, randomGift]); // Add to unlocked gifts
      setCompletedGroups([...completedGroups, groupIndex]);
      setNotification(`🎉 You have received the "${randomGift}"!`);
      
      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification("");
      }, 5000);
    }

    // Remove the task with a delay for animation
    setTimeout(() => {
      const filteredTasks = updatedTaskGroups[groupIndex].tasks.filter(
        (_, index) => index !== taskIndex
      );
      updatedTaskGroups[groupIndex].tasks = filteredTasks;
      setTaskGroups([...updatedTaskGroups]);
    }, 1500); // Delay set to 1500ms (1.5 seconds)
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary p-10 gap-6">
      {/* Graph and Comment Section */}
      <div className="flex flex-row gap-6">
        {/* Mood Graph */}
        <div className="w-8/12 bg-white shadow-md rounded-lg p-6 h-72">
          <h2 className="text-2xl font-bold text-gray-800">Mood Over the Last 7 Days</h2>
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#FFB74D"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill="rgba(255, 183, 77, 0.4)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beautiful Comment */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center h-72 w-60">
          <p
            className="text-lg font-bold text-[#5d6264] text-center"
            style={{
              fontFamily: "'Dancing Script', cursive",
            }}
          >
            Your mood has shown remarkable improvement over the week! Keep up the great work and stay positive! 🌟
          </p>
        </div>
      </div>

      {/* Stats and Task Section */}
      <div className="flex flex-row gap-6">
        {/* AI Chat Conversations */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-6 text-center h-64 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800">AI Conversations</h2>
          <p className="text-4xl font-semibold text-gray-700 mt-4">{aiConversations}</p>
          <p className="text-gray-500 mt-2">Times chatted recently</p>
        </div>

        {/* Task List */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-6 min-h-64 relative">
          <h2 className="text-xl font-bold text-gray-800">Task List</h2>
          <div className="mt-4 space-y-4 overflow-y-auto max-h-48">
            {taskGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{group.title}</h3>
                <ul className="space-y-2">
                  {group.tasks.map((task, taskIndex) => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition-all duration-1000 ${
                        task.completed ? "opacity-0 transform translate-y-4" : ""
                      }`}
                    >
                      <span className="text-gray-700">{task.title}</span>
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer ${
                          task.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-400"
                        }`}
                        onClick={() => markTaskComplete(groupIndex, taskIndex)}
                      >
                        {task.completed && <Check className="w-4 h-4" />}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Notification in the top-right corner */}
          {notification && (
            <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-sm p-2 rounded shadow-md">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

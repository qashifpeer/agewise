"use client";
import { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";

// Defining voter interface
interface Voter {
  id: number;
  nameOfVoter: string;
  age: number;
  sex: string;
  ageGroup: string;
}

// Defining age groups interface
interface AgeGroupCount {
  "18-19 years": { male: number; female: number };
  "20-29 years": { male: number; female: number };
  "30-59 years": { male: number; female: number };
  "60-84 years": { male: number; female: number };
  "Above 84 years": { male: number; female: number };
}

export default function VoterForm() {
  const [nameOfVoter, setNameOfVoter] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [sex, setSex] = useState<string>("Male");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [ageGroupCount, setAgeGroupCount] = useState<AgeGroupCount>({
    "18-19 years": { male: 0, female: 0 },
    "20-29 years": { male: 0, female: 0 },
    "30-59 years": { male: 0, female: 0 },
    "60-84 years": { male: 0, female: 0 },
    "Above 84 years": { male: 0, female: 0 },
  });

  const [totalMale, setTotalMale] = useState<number>(0);
  const [totalFemale, setTotalFemale] = useState<number>(0);

  // Function to determine age group
  const getAgeGroup = (age: number): string => {
    if (age >= 18 && age <= 19) return "18-19 years";
    if (age >= 20 && age <= 29) return "20-29 years";
    if (age >= 30 && age <= 59) return "30-59 years";
    if (age >= 60 && age <= 84) return "60-84 years";
    if (age >= 85) return "Above 84 years";
    return "Invalid Age";
  };

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedVoters = localStorage.getItem("voters");
    if (savedVoters) {
      const parsedVoters = JSON.parse(savedVoters);
      setVoters(parsedVoters);
      updateAgeGroupCount(parsedVoters);
    }
  }, []);

  // Update the age group count based on existing voters
  const updateAgeGroupCount = (votersList: Voter[]) => {
    const ageGroupSummary: AgeGroupCount = {
      "18-19 years": { male: 0, female: 0 },
      "20-29 years": { male: 0, female: 0 },
      "30-59 years": { male: 0, female: 0 },
      "60-84 years": { male: 0, female: 0 },
      "Above 84 years": { male: 0, female: 0 },
    };

    let maleCount = 0;
    let femaleCount = 0;

    votersList.forEach((voter) => {
      const ageGroup = voter.ageGroup;
      if (voter.sex === "Male") {
        ageGroupSummary[ageGroup as keyof AgeGroupCount].male++;
        maleCount++;
      } else if (voter.sex === "Female") {
        ageGroupSummary[ageGroup as keyof AgeGroupCount].female++;
        femaleCount++;
      }
    });

    setAgeGroupCount(ageGroupSummary);
    setTotalMale(maleCount);
    setTotalFemale(femaleCount);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ageGroup = getAgeGroup(age);

    const newVoter: Voter = {
      id: voters.length + 1,
      nameOfVoter,
      age,
      sex,
      ageGroup,
    };

    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    updateAgeGroupCount(updatedVoters);

    // Save to localStorage
    localStorage.setItem("voters", JSON.stringify(updatedVoters));

    // Clear form fields
    setNameOfVoter("");
    setAge(0);
    setSex("Male");
  };

  // Function to delete a voter and decrement age group count
  const deleteVoter = (id: number) => {
    const voterToDelete = voters.find((voter) => voter.id === id);
    if (voterToDelete) {
      const updatedVoters = voters.filter((voter) => voter.id !== id);
      updateAgeGroupCount(updatedVoters);
      setVoters(updatedVoters);
      localStorage.setItem("voters", JSON.stringify(updatedVoters));
    }
  };

  // Clear all voters and reset everything
  const clearAll = () => {
    setVoters([]);
    setAgeGroupCount({
      "18-19 years": { male: 0, female: 0 },
      "20-29 years": { male: 0, female: 0 },
      "30-59 years": { male: 0, female: 0 },
      "60-84 years": { male: 0, female: 0 },
      "Above 84 years": { male: 0, female: 0 },
    });
    setTotalMale(0);
    setTotalFemale(0);
    localStorage.removeItem("voters");
  };

  return (
    <div className="h-screen border-1 flex justify-center items-start mt-2">
      <div className="flex flex-col justify-center items-center border border-green-700 p-1">
        <h1 className="font-bold text-slate-100 uppercase text-lg mb-4">VIF by qashif  <a href="https://x.com/QashifPeer" target="blank"><BsInfoCircle className="inline-block text-sky-500 cursor-pointer" /></a></h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <label htmlFor="nameOfVoter" className="w-1/2">
              Name of Voter:
            </label>
            <input
              type="text"
              id="nameOfVoter"
              value={nameOfVoter}
              className="w-1/2 text-slate-700 px-2"
              onChange={(e) => setNameOfVoter(e.target.value)}
              required
            />
          </div>

          <div className="flex  justify-between mt-1">
            <label htmlFor="age" className="">
              Age:
            </label>
            <input
              type="number"
              id="age"
              value={age}
              className="w-1/2 text-slate-700 px-2"
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-between mt-1">
            <label htmlFor="sex">Sex:</label>
            <select
              id="sex"
              value={sex}
              className="text-slate-700"
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button className=" bg-green-700 border border-green-700 px-2 py-1 rounded-lg hover:bg-green-600 transition-all duration-200 hover:text-black" type="submit">Submit </button>
            <button className="bg-orange-400 border border-green-700 px-2 py-1 rounded-lg hover:bg-green-600 transition-all duration-200 hover:text-black" type="button" onClick={clearAll}>
              Clear All
            </button>
          </div>
        </form>

        <h2 className="mt-4">Voter Count by Age Group</h2>
        <table className="border border-orange-400">
          <thead className="border border-orange-400">
            <tr >
              <th className="text-sm font-bold bg-slate-100 text-slate-700 border-l border-l-orange-500">Age Group</th>
              <th className="text-sm font-bold bg-slate-100 text-slate-700 border-l border-l-orange-500">Male</th>
              <th className="text-sm font-bold bg-slate-100 text-slate-700 border-l border-l-orange-500">Female</th>
              <th className="text-sm font-bold bg-slate-100 text-slate-700 border-l border-l-orange-500">Total Voters</th>
            </tr>
          </thead>
          <tbody>
          {Object.keys(ageGroupCount).map((ageGroup) => {
            const group = ageGroupCount[ageGroup as keyof AgeGroupCount];
            return (
            <tr className="border border-orange-400" key={ageGroup}>
              <td className="">{ageGroup}</td>
              <td className="pl-4">{group.male}</td>
              <td className="pl-4">{group.female}</td>
              <td className="pl-4">{group.male + group.female}</td>
            </tr>
             );
            })}
            {/* <tr className="border border-orange-400">
              <td>20-24 years</td>
              <td className="pl-4">{ageGroupCount["20-29 years"]}</td>
            </tr>
            <tr className="border border-orange-400">
              <td>25-35 years</td>
              <td className="pl-4">{ageGroupCount["30-59 years"]}</td>
            </tr>
            <tr className="border border-orange-400">
              <td>36-60 years</td>
              <td className="pl-4">{ageGroupCount["60-84 years"]}</td>
            </tr>
            <tr className="">
              <td>Above 60 years</td>
              <td className="pl-4">{ageGroupCount["Above 85 years"]}</td>
            </tr> */}
          </tbody>
          <tfoot>
          <tr>
            <td className="border-l border-l-orange-500 bg-slate-100 text-black font-bold">Total</td>
            <td className="border-l border-l-orange-500 bg-slate-100 text-black font-bold pl-4">{totalMale}</td>
            <td className="border-l border-l-orange-500 bg-slate-100 text-black font-bold pl-4">{totalFemale}</td>
            <td className=" border-l border-l-orange-600 bg-slate-100 text-black font-bold pl-4">{totalMale + totalFemale}</td>
          </tr>
        </tfoot>
        </table>

        <h2>Voter List by Sex</h2>
        <table className="border border-green-700">
          <thead>
            <tr className="border border-green-700">
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">ID</th>
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">Name</th>
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">Age</th>
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">Sex</th>
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">Age Group</th>
              <th className="border-l border-l-green-700 px-1 text-center text-xs font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter) => (
              <tr key={voter.id} onDoubleClick={() => deleteVoter(voter.id)} className="border border-green-700">
                <td className="border-l border-l-green-700 px-1 text-center text-xs">{voter.id}</td>
                <td className="border-l border-l-green-700 px-1 text-center text-xs">{voter.nameOfVoter}</td>
                <td className="border-l border-l-green-700 px-1 text-center text-xs">{voter.age}</td>
                <td className="border-l border-l-green-700 px-1 text-center text-xs">{voter.sex}</td>
                <td className="border-l border-l-green-700 px-1 text-center text-xs">{voter.ageGroup}</td>
                <td className="border-l border-l-green-700 px-1 text-center text-xs">
                  <button onClick={() => deleteVoter(voter.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

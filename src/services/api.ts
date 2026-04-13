const BASE_URL = "http://localhost:8080/api";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const createLog = async (userId: number) => {
  const res = await fetch(`${BASE_URL}/daily/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bibleReading: "John Chapter 2",
      bookReading: "Atomic Habits",
      codingWork: "Spring Boot",
      csTopic: "OOP",
      collegeActivity: "DBMS",
      diary: "Productive day",
      expenses: 150,
      movie: "Inception",
      phoneUsage: "3 hours",
    }),
  });

  return res.json();
};